const AuthorProfile = {
  template: `
    <div class="author-profile" v-if="author">
      <div class="profile-header">
        <div class="profile-main">
          <h2>{{ author.display_name }}</h2>
          <div v-if="author.last_known_institution" class="institution-badge">
            <span class="institution-icon">🏢</span>
            {{ author.last_known_institution.display_name }}
          </div>
        </div>
      </div>
      
      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>Publications</h3>
            <p>{{ author.works_count?.toLocaleString() || 0 }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <h3>Citations</h3>
            <p>{{ author.cited_by_count?.toLocaleString() || 0 }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>h-index</h3>
            <p>{{ author.summary_stats?.h_index || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="charts-container">
        <div class="chart-card">
          <h3>Publications by Year</h3>
          <canvas ref="worksChart"></canvas>
        </div>
        <div class="chart-card">
          <h3>Citations by Year</h3>
          <canvas ref="citationsChart"></canvas>
        </div>
      </div>

      <div v-if="works.length" class="recent-works">
        <h3>Recent Publications</h3>
        <ul class="works-list">
          <li v-for="work in works" :key="work.id" class="work-item">
            <div class="work-content">
              <h4>{{ work.title }}</h4>
              <div class="work-meta">
                <span class="work-year">{{ work.publication_year }}</span>
                <span class="work-type">{{ work.type }}</span>
                <span v-if="work.cited_by_count" class="work-citations">
                  {{ work.cited_by_count }} citations
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  props: {
    authorId: String
  },
  data() {
    return {
      author: null,
      works: [],
      error: null,
      worksChart: null,
      citationsChart: null,
      yearlyStats: {
        works: {},
        citations: {}
      }
    }
  },
  async created() {
    if (this.authorId) {
      await this.fetchAuthorData();
      await this.fetchAuthorWorks();
      await this.fetchYearlyStats();
    }
  },
  methods: {
    async fetchAuthorData() {
      try {
        const response = await axios.get(`https://api.openalex.org/authors/${this.authorId}`);
        this.author = response.data;
      } catch (err) {
        this.error = 'Failed to load author data';
        console.error(err);
      }
    },
    async fetchAuthorWorks() {
      try {
        const response = await axios.get('https://api.openalex.org/works', {
          params: {
            filter: `author.id:${this.authorId}`,
            sort: 'publication_date:desc',
            per_page: 5
          }
        });
        this.works = response.data.results;
      } catch (err) {
        console.error(err);
      }
    },
    async fetchYearlyStats() {
      try {
        const response = await axios.get('https://api.openalex.org/works', {
          params: {
            filter: `author.id:${this.authorId}`,
            group_by: 'publication_year',
            per_page: 100
          }
        });
        
        const data = response.data.group_by;
        const currentYear = new Date().getFullYear();
        const lastTenYears = Array.from({length: 10}, (_, i) => currentYear - i).reverse();
        
        lastTenYears.forEach(year => {
          this.yearlyStats.works[year] = 0;
          this.yearlyStats.citations[year] = 0;
        });

        data.forEach(item => {
          if (lastTenYears.includes(parseInt(item.key))) {
            this.yearlyStats.works[item.key] = item.count;
            this.yearlyStats.citations[item.key] = item.cited_by_count || 0;
          }
        });

        this.createCharts();
      } catch (err) {
        console.error('Error fetching yearly stats:', err);
      }
    },

    createCharts() {
      const years = Object.keys(this.yearlyStats.works);
      const worksCounts = Object.values(this.yearlyStats.works);
      const citationsCounts = Object.values(this.yearlyStats.citations);

      const chartConfig = {
        works: {
          labels: years,
          datasets: [{
            label: 'Publications',
            data: worksCounts,
            backgroundColor: 'rgba(66, 133, 244, 0.2)',
            borderColor: 'rgba(66, 133, 244, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        citations: {
          labels: years,
          datasets: [{
            label: 'Citations',
            data: citationsCounts,
            backgroundColor: 'rgba(251, 188, 4, 0.2)',
            borderColor: 'rgba(251, 188, 4, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        }
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      };

      if (this.worksChart) this.worksChart.destroy();
      if (this.citationsChart) this.citationsChart.destroy();

      this.worksChart = new Chart(this.$refs.worksChart, {
        type: 'line',
        data: chartConfig.works,
        options: chartOptions
      });

      this.citationsChart = new Chart(this.$refs.citationsChart, {
        type: 'line',
        data: chartConfig.citations,
        options: chartOptions
      });
    }
  },
  beforeUnmount() {
    if (this.worksChart) this.worksChart.destroy();
    if (this.citationsChart) this.citationsChart.destroy();
  }
};
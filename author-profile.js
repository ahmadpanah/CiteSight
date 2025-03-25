const AuthorProfile = {
  template: `
    <div class="author-profile" v-if="author">
      <div class="profile-header">
        <h2>{{ author.display_name }}</h2>
        <span v-if="author.last_known_institution" class="institution">
          {{ author.last_known_institution.display_name }}
        </span>
      </div>
      
      <div class="profile-stats">
        <div class="stat-card">
          <h3>📚 Works</h3>
          <p>{{ author.works_count?.toLocaleString() || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>🏆 Citations</h3>
          <p>{{ author.cited_by_count?.toLocaleString() || 0 }}</p>
        </div>
        <div class="stat-card">
          <h3>📊 h-index</h3>
          <p>{{ author.summary_stats?.h_index || 0 }}</p>
        </div>
      </div>

      <div v-if="works.length" class="recent-works">
        <h3>Recent Publications</h3>
        <ul class="works-list">
          <li v-for="work in works" :key="work.id" class="work-item">
            <h4>{{ work.title }}</h4>
            <p class="work-meta">
              {{ work.publication_year }} · {{ work.type }}
              <span v-if="work.cited_by_count" class="citations">
                · {{ work.cited_by_count }} citations
              </span>
            </p>
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
      error: null
    }
  },
  async created() {
    if (this.authorId) {
      await this.fetchAuthorData();
      await this.fetchAuthorWorks();
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
    }
  }
};
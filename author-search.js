const AuthorSearch = {
    template: `
      <div class="author-search">
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          placeholder="Type author name..."
          type="search"
          class="search-input"
        />
        <div v-if="isLoading" class="loading">Searching authors...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="results.length === 0 && searchQuery.length > 1" class="no-results">
          No authors found matching "{{ searchQuery }}"
        </div>
        
        <ul v-if="results.length > 0" class="results">
          <li v-for="author in results" :key="author.id" class="result-item">
            <div class="author-header">
              <span class="author-name">{{ author.display_name }}</span>
              <span v-if="author.last_known_institution" class="institution">
                {{ author.last_known_institution.display_name }}
              </span>
            </div>
            <div class="author-stats">
              <span v-if="author.works_count" class="works">
                📚 {{ author.works_count.toLocaleString() }} works
              </span>
              <span v-if="author.cited_by_count" class="citations">
                🏆 {{ author.cited_by_count.toLocaleString() }} citations
              </span>
            </div>
          </li>
        </ul>
      </div>
    `,
    data() {
      return {
        searchQuery: '',
        results: [],
        isLoading: false,
        error: null,
        debounceTimer: null
      }
    },
    methods: {
      async searchAuthors() {
        if (this.searchQuery.length < 2) {
          this.results = [];
          return;
        }
  
        this.isLoading = true;
        this.error = null;
  
        try {
          const response = await axios.get('https://api.openalex.org/authors', {
            params: {
              search: this.searchQuery,
              per_page: 8
            }
          });
          this.results = response.data.results || [];
        } catch (err) {
          this.error = 'Failed to fetch authors. Please try again later.';
          console.error('Search error:', err);
        } finally {
          this.isLoading = false;
        }
      },
      debouncedSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(this.searchAuthors, 500);
      }
    },
    watch: {
      searchQuery(newVal) {
        if (newVal === '') {
          this.results = [];
        }
      }
    }
  };
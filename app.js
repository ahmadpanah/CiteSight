const { createApp } = Vue;

const App = {
  data() {
    return {
      isDarkMode: localStorage.getItem('darkMode') === 'true',
      currentView: 'search',
      selectedAuthorId: null
    }
  },
  created() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', this.isDarkMode);
    },
    showAuthorProfile(authorId) {
      this.selectedAuthorId = authorId;
      this.currentView = 'profile';
    },
    backToSearch() {
      this.currentView = 'search';
      this.selectedAuthorId = null;
    }
  },
  template: `
    <div class="app">
      <header>
        <div class="header-content">
          <h1 @click="backToSearch" style="cursor: pointer">CiteSight</h1>
          <button class="theme-toggle" @click="toggleDarkMode" aria-label="Toggle dark mode">
            <span class="theme-icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
          </button>
        </div>
        <p>Search for academic authors</p>
      </header>
      <main>
        <author-search v-if="currentView === 'search'" @select-author="showAuthorProfile"></author-search>
        <author-profile v-else :author-id="selectedAuthorId"></author-profile>
      </main>
      <footer>
        <p>Powered by Seyed Hossein Ahmadpanah</p>
      </footer>
    </div>
  `,
  components: {
    'author-search': AuthorSearch,
    'author-profile': AuthorProfile
  }
};

createApp(App).mount('#app');
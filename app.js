const { createApp } = Vue;

const App = {
  data() {
    return {
      isDarkMode: localStorage.getItem('darkMode') === 'true'
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
    }
  },
  template: `
    <div class="app">
      <header>
        <div class="header-content">
          <h1>CiteSight</h1>
          <button class="theme-toggle" @click="toggleDarkMode" aria-label="Toggle dark mode">
            <span class="theme-icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
          </button>
        </div>
        <p>Search for academic authors</p>
      </header>
      <main>
        <author-search></author-search>
      </main>
      <footer>
        <p>Powered by Seyed Hossein Ahmadpanah</p>
      </footer>
    </div>
  `,
  components: {
    'author-search': AuthorSearch
  }
};

createApp(App).mount('#app');
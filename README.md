# CiteSight

CiteSight is a modern web application that allows users to search and explore academic authors using the OpenAlex API. Built with Vue.js, it provides a clean interface for discovering scholarly work and author metrics.

## Features

- 🔍 Real-time author search
- 📊 Author metrics visualization
- 🎨 Dark/Light theme support
- 📱 Responsive design
- 📚 Recent publications display
- 🏢 Institution information

## Tech Stack

- Vue.js 3 (CDN)
- Axios for API requests
- CSS Variables for theming
- OpenAlex API

## Project Structure

```
Scholar/
├── index.html          # Entry point
├── styles.css          # Global styles and theme variables
├── app.js             # Main Vue application
├── author-search.js   # Author search component
└── author-profile.js  # Author profile component
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/citesight.git
cd citesight
```

2. Open the project in a web server. For example, using Visual Studio Code's Live Server extension or Python's built-in server:
```bash
# Using Python
python -m http.server 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Seyed Hossein Ahmadpanah

## Acknowledgments

- [OpenAlex](https://openalex.org/) for providing the academic data API
- [Vue.js](https://vuejs.org/) for the reactive framework
- [Axios](https://axios-http.com/) for HTTP requests
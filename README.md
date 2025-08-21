# USB Recognized - Advanced USB Device Detection & Troubleshooting Tool

## Project Overview

USB Recognized is a powerful web application designed to help users diagnose and troubleshoot USB device recognition issues directly from their browser. Built with modern web technologies, this tool leverages the WebUSB API to provide instant device detection and detailed information without requiring any software installation.

### Key Features

- **Instant USB Device Detection**: Identify connected USB devices and retrieve detailed hardware information
- **Comprehensive Troubleshooting Guides**: Platform-specific (Windows, macOS, Linux) solutions for common USB recognition issues
- **Visual Troubleshooting Assistant**: Step-by-step visual guidance for resolving USB connection problems
- **Device-Specific Solutions**: Targeted fixes for popular USB device categories
- **Advanced Diagnostic Tools**: In-depth analysis of USB connection status and potential issues
- **SEO Optimized Content**: Rich, keyword-targeted information about USB troubleshooting
- **Responsive Design**: Fully optimized for desktop and mobile devices

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Hooks, TanStack React Query
- **Routing**: React Router
- **Animation**: Framer Motion
- **API Integration**: WebUSB API, Supabase
- **Testing**: Jest
- **Linting**: ESLint

## Quick Start

### Prerequisites
- Node.js 16 or newer
- npm, yarn, or pnpm package manager

### Installation

1. **Install NVM (Node Version Manager)**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

2. **Install Node.js 16**
```bash
nvm install 16
nvm use 16
```

3. **Clone the repository**
```bash
git clone <repository-url>
cd usb-recognized
```

4. **Install dependencies**
```bash
npm install
# or
yarn install
```

### Development Server

Start the development server at http://localhost:8080
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── data/              # Static data and content
│   ├── utils/             # Utility functions and helpers
│   ├── lib/               # Shared libraries
│   ├── styles/            # Custom styles
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── scripts/               # Build and deployment scripts
├── vite.config.js         # Vite configuration
└── package.json           # Project dependencies and scripts
```

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the development server
- **`npm run build`**: Builds the app for production to the `dist` folder
- **`npm run build:dev`**: Builds the app in development mode
- **`npm run build:seo`**: Builds the app with SEO optimizations including sitemap generation and prerendering
- **`npm run preview`**: Serves the built app from the `dist` folder
- **`npm run lint`**: Runs ESLint to check for code quality issues
- **`npm run test`**: Runs Jest tests
- **`npm run generate:sitemap`**: Generates the sitemap.xml file
- **`npm run prerender`**: Prerenders pages for improved SEO and performance

## SEO Features

The project includes comprehensive SEO features:
- Automated sitemap generation
- Page-level metadata optimization
- Structured data for rich snippets
- Keyword density optimization
- Canonical URLs
- Multilingual support
- Pre-rendering for improved search engine indexing

## Browser Compatibility

The USB detection feature requires browsers that support the WebUSB API, including:
- Google Chrome (version 61+)
- Microsoft Edge (version 79+)
- Chrome for Android (limited support)

The troubleshooting guides and other content are accessible from all modern browsers.

## Contributing

We welcome contributions to improve USB Recognized. Here's how you can help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- The WebUSB API for enabling browser-based device detection
- Radix UI and Tailwind CSS for powerful UI components
- Vite for fast development and optimized builds
- All contributors who have helped improve this project


## Other Things

if this project is helpful to you, buy be a coffee.

<a href="https://www.buymeacoffee.com/moca" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
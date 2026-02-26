# Portfolio Website

Personal portfolio website showcasing projects and AI-powered features.

**Live:** https://creatman.site (coming soon)
**GitHub:** https://github.com/CreatmanCEO/portfolio

## Features

- ⚡ **Next.js 14** with App Router and TypeScript
- 🎨 **Eye-Friendly Design** - Warm color palette with reduced blue light
- 🌓 **Theme Toggle** - Light/dark mode with localStorage persistence
- 🤖 **AI Code Analyst** - Real-time streaming code analysis using Claude API
- 📱 **Responsive** - Mobile-first design with Framer Motion animations
- 🚀 **Production Ready** - Deployed on VPS with Nginx + PM2

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **AI Integration:** Anthropic SDK (Claude Sonnet 4.5)
- **Code Highlighting:** Shiki
- **Deployment:** VPS (Nginx + PM2) + GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (for AI Code Analyst feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/CreatmanCEO/portfolio.git
cd portfolio

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your Anthropic API key to .env.local
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create a `.env.local` file:

```bash
# Required for AI Code Analyst feature
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Next.js Configuration
NODE_ENV=development
PORT=3000
HOSTNAME=localhost
```

Get your Anthropic API key from: https://console.anthropic.com/

## Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Deployment

This site is deployed on a VPS using:

- **Nginx** - Reverse proxy and SSL termination
- **PM2** - Process manager for Node.js
- **Let's Encrypt** - Free SSL certificates
- **GitHub Actions** - Automated deployment on push

Deployment configuration files are available in the parent `/vps-config` directory.

## License

© 2026 Creatman. All rights reserved.

## Contact

- **Email:** creatmanick@gmail.com
- **GitHub:** [@CreatmanCEO](https://github.com/CreatmanCEO)
- **Site:** https://creatman.site

---

**Built with ❤️ and Claude Code**

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
- **AI Integration:** Claude Code CLI (local installation)
- **Code Highlighting:** Shiki
- **Deployment:** VPS (Nginx + PM2) + GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Claude Code CLI installed and available in PATH (for AI Code Analyst feature)

### Installation

```bash
# Clone the repository
git clone https://github.com/CreatmanCEO/portfolio.git
cd portfolio

# Install dependencies
npm install

# Ensure Claude Code is installed and in PATH
# Installation: https://github.com/anthropics/claude-code
# Test: claude --version

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Requirements

### Claude Code CLI

The AI Code Analyst feature requires Claude Code to be installed and available in your system PATH.

**Installation:**
```bash
# Linux/macOS (via curl)
curl -fsSL https://raw.githubusercontent.com/anthropics/claude-code/main/install.sh | sh

# Or download from GitHub releases
# https://github.com/anthropics/claude-code/releases
```

**Verify installation:**
```bash
claude --version
# Should output: 2.1.42 (Claude Code) or higher
```

### Environment Variables

Optional `.env.local` file:

```bash
# Next.js Configuration
NODE_ENV=development
PORT=3000
HOSTNAME=localhost
```

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

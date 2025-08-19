# Summon Experts - AI-Powered Business Planning Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)

A modern, AI-powered business planning platform that transforms business ideas into actionable strategies, roadmaps, and weekly task plans.

## 🌐 Links

- **[Live Platform](https://summonexperts.com)** - Full business planning platform
- **[Demo Mode](/demo)** - Try the platform features
- **[Documentation](https://docs.summonexperts.com)** - Platform guides and tutorials

## 🚀 Features

- **AI-Powered Planning** - GPT-4o and Claude integration for business intelligence
- **Business Setup Wizard** - 3-step configuration process for new businesses
- **Growth Planning Tools** - Strategic goal setting and execution planning
- **Progress Tracking** - Weekly audits and performance monitoring
- **User Management** - Complete authentication and profile system
- **Modern UI/UX** - Glassmorphism design with responsive layouts

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **UI Components**: Radix UI + Custom components
- **AI Integration**: OpenAI GPT-4o, Claude API
- **Database**: Notion API integration
- **Deployment**: Netlify ready

## 📦 Quick Start

```bash
# Clone the repository
git clone https://github.com/BTheCoderr/summonExpertsV1.git
cd summonExpertV1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🎯 Platform Structure

```
/platform                    # Main platform dashboard
├── /account               # User account creation
├── /login                 # User authentication
├── /business-setup        # Business configuration wizard
├── /growth-plan           # Strategic planning tools
└── /settings              # User preferences
```

## 🔧 Environment Variables

```env
# Notion Integration
NOTION_SECRET=your-notion-secret
NOTION_DATABASE_ID=your-database-id

# AI APIs (optional)
OPENAI_API_KEY=your-openai-key
CLAUDE_API_KEY=your-claude-key
```

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `out`
4. Add environment variables

### Vercel
```bash
npm i -g vercel
vercel
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

---

**Built with ❤️ by the Summon Experts team**

[Website](https://summonexperts.com) • [Support](mailto:support@summonexperts.com) • [Issues](https://github.com/BTheCoderr/summonExpertsV1/issues) 
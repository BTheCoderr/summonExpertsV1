# Summon Experts - AI-Powered Business Planning Platform

A comprehensive AI-powered business planning platform that transforms business ideas into actionable strategies, roadmaps, and weekly task plans.

## 🚀 Features

### **Strategic Planning**
- AI-generated business strategies tailored to your specific goals
- Market analysis and competitive positioning
- Revenue projections and financial planning
- Strategic hurdles identification and mitigation

### **Roadmap Generation**
- Detailed execution timelines with milestones
- Key results and success metrics
- Progress tracking and monitoring
- Dependencies and resource allocation

### **Weekly Task Management**
- Personalized weekly task plans
- Detailed subtasks with execution guidance
- Interactive checkboxes for progress tracking
- Priority-based task organization

### **Progress Tracking**
- Weekly audit system for reflection
- Performance analytics and insights
- Progress visualization and reporting
- Continuous improvement tracking

### **AI Integration**
- Advanced AI processing with real-time metrics
- Multiple AI models (GPT-4o, Claude)
- Notion integration for seamless workflow
- Intelligent task prioritization

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI + Custom components
- **AI Integration**: OpenAI GPT-4o, Claude API
- **Database**: Notion API integration
- **Deployment**: Netlify/Vercel ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd summonExpertV1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   # Notion API Integration
   NOTION_SECRET=your-notion-secret-here
   NOTION_DATABASE_ID=your-database-id-here
   
   # AI APIs (optional)
   OPENAI_API_KEY=your-openai-key-here
   CLAUDE_API_KEY=your-claude-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🎯 Usage

### **Getting Started**
1. Visit the homepage and click "Demo" to see the platform in action
2. Explore the different tabs: Overview, Roadmap, Weekly Tasks, Progress Audit
3. Try the AI generation features for strategic planning and task management

### **Key Features**
- **Demo Mode**: Access via `/demo` to see the full platform
- **AI Generation**: Click "Generate Strategic Plan", "Generate Roadmap", or "Generate Tasks"
- **Task Management**: Use interactive checkboxes to track progress
- **Weekly Audits**: Submit weekly reflections and learnings

## 🚀 Deployment

### **Netlify Deployment**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Add environment variables in Netlify dashboard

### **Vercel Deployment**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## 📁 Project Structure

```
summonExpertV1/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── demo/              # Demo page
│   └── yc-prototype/      # Main platform page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Configuration

### **Notion Integration Setup**
1. Create a Notion integration at [notion.so/my-integrations](https://notion.so/my-integrations)
2. Share your pages with the integration
3. Add the integration secret to your environment variables

### **AI API Setup**
1. Get API keys from OpenAI and/or Anthropic
2. Add them to your environment variables
3. The platform will use these for enhanced AI features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@summonexperts.com or create an issue in this repository.

---

**Built with ❤️ by the Summon Experts team** 
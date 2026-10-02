# 🚀 AutoGen Multi-Agent Applications Setup Guide

This guide will help you set up and run the AutoGen multi-agent applications included in this course.

## 📋 Prerequisites

- Python 3.8 or higher
- pip package manager
- OpenAI API key (or Azure OpenAI credentials)
- Optional: Ollama for local LLM support

## 🛠️ Quick Setup

### 1. Clone and Navigate
```bash
cd autogen-agentchat
```

### 2. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install Jupyter Kernel
```bash
python -m ipykernel install --user --name=autogen-env --display-name="AutoGen Environment"
```

### 5. Install Playwright Browsers (for testing)
```bash
playwright install
```

### 6. Run Setup Script
```bash
python setup.py
```

## 🔑 Environment Configuration

### Option 1: Using the Setup Script
The setup script will automatically create a `.env` file from the template.

### Option 2: Manual Setup
1. Copy `env_template.txt` to `.env`
2. Update the `.env` file with your API keys:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1

# Azure OpenAI Configuration (alternative)
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint_here
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Ollama Configuration (for local LLMs)
OLLAMA_BASE_URL=http://localhost:11434
```

## 🎯 Available Projects

### Project 1: AI Code Explainer & Optimizer
**Location**: `03 - Project 1: Explain and optimize code/`

**Features**:
- Upload Python files or paste code
- Get AI-powered code explanations
- Receive optimization suggestions
- Built with Streamlit

**Run**:
```bash
cd "03 - Project 1: Explain and optimize code"
streamlit run app.py
```

### Project 2: Multi-Agent AI Chatbot for Customer Support
**Location**: `05 - Project2-Multi-AgentAIChatbotForCustomerSupport/`

**Features**:
- Multi-agent system with specialized agents
- Product inquiries and order management
- Complaint handling
- FastAPI backend with Streamlit frontend

**Run Backend**:
```bash
cd "05 - Project2-Multi-AgentAIChatbotForCustomerSupport"
python team_api.py
```

**Run Frontend** (in another terminal):
```bash
cd "05 - Project2-Multi-AgentAIChatbotForCustomerSupport"
streamlit run app.py
```

## 📚 Learning Path

### 1. Start with Notebooks
Begin with the Jupyter notebooks in the numbered directories:
- `00-course-setup/` - Initial setup
- `01 - Models/` - Model configuration
- `02-important-autogen-concepts/` - Core concepts
- `04 - Team - A group of Agents/` - Team dynamics
- `06 - Advanced Concepts/` - Advanced features

### 2. Hands-on Projects
- **Project 1**: Simple single-agent application
- **Project 2**: Complex multi-agent system

### 3. Advanced Topics
- State management
- Magentic-One integration
- Custom termination conditions

## 🔧 Troubleshooting

### Common Issues

#### 1. Import Errors
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 2. API Key Issues
- Check your `.env` file exists
- Verify API keys are correct
- Ensure you have sufficient API credits

#### 3. Port Conflicts
- Change ports in the configuration files
- Check if ports 8000 (FastAPI) or 8501 (Streamlit) are available

#### 4. Jupyter Kernel Issues
```bash
# Reinstall kernel
python -m ipykernel install --user --name=autogen-env --display-name="AutoGen Environment"
```

### Getting Help

1. Check the [AutoGen Documentation](https://microsoft.github.io/autogen/stable/)
2. Review the course materials
3. Check the notebook examples for working code

## 🚀 Next Steps

1. **Complete the notebooks** in order to understand AutoGen concepts
2. **Experiment with the projects** by modifying agent behaviors
3. **Build your own multi-agent system** using the patterns shown
4. **Explore advanced features** like custom tools and termination conditions

## 📖 Additional Resources

- [AutoGen GitHub Repository](https://github.com/microsoft/autogen)
- [AutoGen Documentation](https://microsoft.github.io/autogen/stable/)
- [Course Link](https://www.udemy.com/course/build-intelligent-multi-agent-applications-with-autogen/)

---

**Happy coding with AutoGen! 🎉**

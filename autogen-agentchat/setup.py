#!/usr/bin/env python3
"""
Setup script for AutoGen Multi-Agent Applications
This script helps configure the environment and test the projects.
"""

import os
import sys
import subprocess
import asyncio
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible."""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required.")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro} detected")
    return True

def check_dependencies():
    """Check if required packages are installed."""
    required_packages = [
        'autogen_core',
        'autogen_agentchat', 
        'autogen_ext',
        'streamlit',
        'fastapi',
        'uvicorn'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package}")
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def create_env_file():
    """Create .env file from template if it doesn't exist."""
    env_file = Path('.env')
    template_file = Path('env_template.txt')
    
    if not env_file.exists() and template_file.exists():
        print("\n📝 Creating .env file from template...")
        with open(template_file, 'r') as f:
            content = f.read()
        
        with open(env_file, 'w') as f:
            f.write(content)
        
        print("✅ .env file created. Please update it with your API keys.")
        return True
    elif env_file.exists():
        print("✅ .env file already exists.")
        return True
    else:
        print("❌ No environment template found.")
        return False

def test_project1():
    """Test Project 1: Code Explainer."""
    print("\n🧪 Testing Project 1: Code Explainer...")
    
    project_dir = Path("03 - Project 1: Explain and optimize code")
    if not project_dir.exists():
        print("❌ Project 1 directory not found.")
        return False
    
    try:
        # Test the agent module
        sys.path.insert(0, str(project_dir))
        from agent import get_code_explanation
        
        # Simple test
        test_code = "def hello(): print('Hello, World!')"
        print("✅ Project 1 agent module loaded successfully")
        return True
        
    except Exception as e:
        print(f"❌ Project 1 test failed: {e}")
        return False
    finally:
        if str(project_dir) in sys.path:
            sys.path.remove(str(project_dir))

def test_project2():
    """Test Project 2: Multi-Agent Chatbot."""
    print("\n🧪 Testing Project 2: Multi-Agent Chatbot...")
    
    project_dir = Path("05 - Project2-Multi-AgentAIChatbotForCustomerSupport")
    if not project_dir.exists():
        print("❌ Project 2 directory not found.")
        return False
    
    try:
        # Test the teams module
        sys.path.insert(0, str(project_dir))
        from teams import main
        
        print("✅ Project 2 teams module loaded successfully")
        return True
        
    except Exception as e:
        print(f"❌ Project 2 test failed: {e}")
        return False
    finally:
        if str(project_dir) in sys.path:
            sys.path.remove(str(project_dir))

def run_streamlit_demo():
    """Run the Streamlit demo for Project 1."""
    print("\n🚀 Starting Streamlit demo for Project 1...")
    print("Press Ctrl+C to stop the server")
    
    project_dir = Path("03 - Project 1: Explain and optimize code")
    if not project_dir.exists():
        print("❌ Project 1 directory not found.")
        return
    
    try:
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py"
        ], cwd=project_dir)
    except KeyboardInterrupt:
        print("\n✅ Streamlit server stopped.")

def run_fastapi_demo():
    """Run the FastAPI demo for Project 2."""
    print("\n🚀 Starting FastAPI demo for Project 2...")
    print("Press Ctrl+C to stop the server")
    
    project_dir = Path("05 - Project2-Multi-AgentAIChatbotForCustomerSupport")
    if not project_dir.exists():
        print("❌ Project 2 directory not found.")
        return
    
    try:
        subprocess.run([
            sys.executable, "team_api.py"
        ], cwd=project_dir)
    except KeyboardInterrupt:
        print("\n✅ FastAPI server stopped.")

def main():
    """Main setup function."""
    print("🚀 AutoGen Multi-Agent Applications Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return
    
    # Check dependencies
    print("\n📦 Checking dependencies...")
    if not check_dependencies():
        return
    
    # Create environment file
    print("\n🔧 Setting up environment...")
    create_env_file()
    
    # Test projects
    print("\n🧪 Testing projects...")
    project1_ok = test_project1()
    project2_ok = test_project2()
    
    if project1_ok and project2_ok:
        print("\n✅ All projects are ready!")
        
        # Ask user what they want to do
        print("\n🎯 What would you like to do?")
        print("1. Run Project 1 (Streamlit Code Explainer)")
        print("2. Run Project 2 (FastAPI Multi-Agent Chatbot)")
        print("3. Exit")
        
        while True:
            choice = input("\nEnter your choice (1-3): ").strip()
            
            if choice == "1":
                run_streamlit_demo()
                break
            elif choice == "2":
                run_fastapi_demo()
                break
            elif choice == "3":
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid choice. Please enter 1, 2, or 3.")
    else:
        print("\n❌ Some projects failed to load. Please check the errors above.")

if __name__ == "__main__":
    main()

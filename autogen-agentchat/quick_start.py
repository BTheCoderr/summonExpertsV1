#!/usr/bin/env python3
"""
Quick Start Script for AutoGen Multi-Agent Applications
This script provides easy access to all main features and demos.
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def print_banner():
    """Print the application banner."""
    print("🚀 AutoGen Multi-Agent Applications - Quick Start")
    print("=" * 60)
    print("Build intelligent multi-agent systems with AutoGen 0.4")
    print("=" * 60)

def check_environment():
    """Check if environment is properly configured."""
    env_file = Path('.env')
    if not env_file.exists():
        print("❌ .env file not found. Please run setup first.")
        return False
    
    with open(env_file, 'r') as f:
        content = f.read()
        if 'your_openai_api_key_here' in content:
            print("⚠️  Please update your .env file with real API keys first.")
            print("   Edit the .env file and replace placeholder values.")
            return False
    
    return True

def show_menu():
    """Show the main menu."""
    print("\n🎯 What would you like to do?")
    print("1. 📚 Open Course Setup Notebooks")
    print("2. 🧪 Run Project 1: Code Explainer (Streamlit)")
    print("3. 🤖 Run Project 2: Multi-Agent Chatbot (FastAPI + Streamlit)")
    print("4. 🔧 Run Setup & Tests")
    print("5. 📖 View Documentation")
    print("6. 🚪 Exit")
    print("-" * 60)

def open_notebooks():
    """Open the course setup notebooks."""
    print("\n📚 Opening course setup notebooks...")
    
    notebook_dir = Path("00-course-setup")
    if not notebook_dir.exists():
        print("❌ Course setup directory not found.")
        return
    
    # Try to start Jupyter
    try:
        print("🚀 Starting Jupyter notebook server...")
        print("📝 Opening notebooks in your browser...")
        
        # Start Jupyter in background
        subprocess.Popen([
            sys.executable, "-m", "jupyter", "notebook", 
            "--notebook-dir", str(notebook_dir),
            "--port", "8888"
        ])
        
        # Wait a moment for server to start
        import time
        time.sleep(3)
        
        # Open browser
        webbrowser.open("http://localhost:8888")
        
        print("✅ Jupyter notebook server started!")
        print("🌐 Notebooks should open in your browser at http://localhost:8888")
        print("📝 Start with '1. install Python.ipynb'")
        
    except Exception as e:
        print(f"❌ Failed to start Jupyter: {e}")
        print("💡 You can manually start Jupyter with: jupyter notebook")

def run_project1():
    """Run Project 1: Code Explainer."""
    print("\n🧪 Starting Project 1: Code Explainer...")
    
    project_dir = Path("03 - Project 1: Explain and optimize code")
    if not project_dir.exists():
        print("❌ Project 1 directory not found.")
        return
    
    try:
        print("🚀 Starting Streamlit app...")
        print("🌐 The app will open in your browser at http://localhost:8501")
        print("📝 Upload a Python file or paste code to get started!")
        print("🛑 Press Ctrl+C to stop the server")
        
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py"
        ], cwd=project_dir)
        
    except KeyboardInterrupt:
        print("\n✅ Streamlit server stopped.")
    except Exception as e:
        print(f"❌ Failed to start Project 1: {e}")

def run_project2():
    """Run Project 2: Multi-Agent Chatbot."""
    print("\n🤖 Starting Project 2: Multi-Agent Chatbot...")
    
    project_dir = Path("05 - Project2-Multi-AgentAIChatbotForCustomerSupport")
    if not project_dir.exists():
        print("❌ Project 2 directory not found.")
        return
    
    print("🚀 This project requires two terminals:")
    print("   1. Backend (FastAPI) - Starting now...")
    print("   2. Frontend (Streamlit) - Will open in new terminal")
    
    try:
        # Start backend in background
        backend_process = subprocess.Popen([
            sys.executable, "team_api.py"
        ], cwd=project_dir)
        
        print("✅ Backend started! FastAPI server running on http://localhost:8000")
        
        # Wait a moment for backend to start
        import time
        time.sleep(3)
        
        # Start frontend
        print("🚀 Starting frontend...")
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py"
        ], cwd=project_dir)
        
    except KeyboardInterrupt:
        print("\n✅ Stopping servers...")
        if 'backend_process' in locals():
            backend_process.terminate()
        print("✅ All servers stopped.")
    except Exception as e:
        print(f"❌ Failed to start Project 2: {e}")

def run_setup():
    """Run the setup and tests."""
    print("\n🔧 Running setup and tests...")
    
    try:
        subprocess.run([sys.executable, "setup.py"])
    except Exception as e:
        print(f"❌ Setup failed: {e}")

def show_documentation():
    """Show documentation and resources."""
    print("\n📖 Documentation & Resources")
    print("-" * 40)
    print("📚 Course Materials:")
    print("   • Start with notebooks in '00-course-setup/'")
    print("   • Progress through numbered directories")
    print("   • Complete hands-on projects")
    
    print("\n🌐 Online Resources:")
    print("   • AutoGen Docs: https://microsoft.github.io/autogen/stable/")
    print("   • GitHub: https://github.com/microsoft/autogen")
    print("   • Course: https://www.udemy.com/course/build-intelligent-multi-agent-applications-with-autogen/")
    
    print("\n📁 Project Structure:")
    print("   • 00-course-setup/ - Initial setup and configuration")
    print("   • 01 - Models/ - Model setup (OpenAI, Azure, LLaMA)")
    print("   • 02-important-autogen-concepts/ - Core AutoGen concepts")
    print("   • 03 - Project 1/ - Code explainer application")
    print("   • 04 - Team - A group of Agents/ - Team dynamics")
    print("   • 05 - Project2/ - Multi-agent chatbot")
    print("   • 06 - Advanced Concepts/ - Advanced features")

def main():
    """Main function."""
    print_banner()
    
    # Check environment
    if not check_environment():
        print("\n🔧 To fix this:")
        print("1. Copy env_template.txt to .env")
        print("2. Edit .env and add your API keys")
        print("3. Run this script again")
        return
    
    while True:
        show_menu()
        
        try:
            choice = input("\nEnter your choice (1-6): ").strip()
            
            if choice == "1":
                open_notebooks()
            elif choice == "2":
                run_project1()
            elif choice == "3":
                run_project2()
            elif choice == "4":
                run_setup()
            elif choice == "5":
                show_documentation()
            elif choice == "6":
                print("\n👋 Goodbye! Happy coding with AutoGen! 🎉")
                break
            else:
                print("❌ Invalid choice. Please enter 1-6.")
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Happy coding with AutoGen! 🎉")
            break
        except Exception as e:
            print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    main()

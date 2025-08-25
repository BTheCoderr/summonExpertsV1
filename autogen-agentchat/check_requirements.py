#!/usr/bin/env python3
"""
Requirements Checker for AutoGen Multi-Agent Applications
This script checks if all requirements are met and provides guidance.
"""

import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check Python version."""
    print("🐍 Checking Python version...")
    
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"  ✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"  ❌ Python {version.major}.{version.minor}.{version.micro} - Requires Python 3.8+")
        return False

def check_pip():
    """Check if pip is available."""
    print("\n📦 Checking pip...")
    
    try:
        result = subprocess.run([sys.executable, "-m", "pip", "--version"], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✅ pip available: {result.stdout.strip()}")
            return True
        else:
            print("  ❌ pip not available")
            return False
    except Exception as e:
        print(f"  ❌ pip check failed: {e}")
        return False

def check_virtual_environment():
    """Check if virtual environment is activated."""
    print("\n🔧 Checking virtual environment...")
    
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("  ✅ Virtual environment is activated")
        return True
    else:
        print("  ⚠️  Virtual environment not detected")
        print("     Consider creating one: python3 -m venv venv")
        return False

def check_dependencies():
    """Check if required packages are installed."""
    print("\n📚 Checking dependencies...")
    
    required_packages = [
        ('autogen_core', 'autogen-core'),
        ('autogen_agentchat', 'autogen-agentchat'),
        ('autogen_ext', 'autogen-ext'),
        ('streamlit', 'streamlit'),
        ('fastapi', 'fastapi'),
        ('uvicorn', 'uvicorn'),
        ('ipykernel', 'ipykernel')
    ]
    
    all_installed = True
    for import_name, package_name in required_packages:
        try:
            __import__(import_name)
            print(f"  ✅ {package_name}")
        except ImportError:
            print(f"  ❌ {package_name} - Not installed")
            all_installed = False
    
    return all_installed

def check_environment_file():
    """Check environment configuration."""
    print("\n🔑 Checking environment configuration...")
    
    env_file = Path('.env')
    if env_file.exists():
        with open(env_file, 'r') as f:
            content = f.read()
            if 'your_openai_api_key_here' in content:
                print("  ⚠️  .env file exists but contains placeholder values")
                print("     Update with real API keys to use the projects")
                return False
            else:
                print("  ✅ .env file configured with API keys")
                return True
    else:
        print("  ❌ .env file not found")
        print("     Copy env_template.txt to .env and add your API keys")
        return False

def check_project_files():
    """Check if project files are present."""
    print("\n📁 Checking project files...")
    
    required_files = [
        "requirements.txt",
        "README.md",
        "03 - Project 1: Explain and optimize code/app.py",
        "03 - Project 1: Explain and optimize code/agent.py",
        "05 - Project2-Multi-AgentAIChatbotForCustomerSupport/app.py",
        "05 - Project2-Multi-AgentAIChatbotForCustomerSupport/teams.py"
    ]
    
    all_present = True
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} - Missing")
            all_present = False
    
    return all_present

def provide_guidance():
    """Provide guidance based on check results."""
    print("\n" + "=" * 60)
    print("📋 SETUP GUIDANCE")
    print("=" * 60)
    
    print("\n🎯 To get started:")
    print("1. Ensure Python 3.8+ is installed")
    print("2. Create and activate a virtual environment:")
    print("   python3 -m venv venv")
    print("   source venv/bin/activate  # macOS/Linux")
    print("   venv\\Scripts\\activate     # Windows")
    
    print("\n3. Install dependencies:")
    print("   pip install -r requirements.txt")
    
    print("\n4. Configure environment:")
    print("   cp env_template.txt .env")
    print("   # Edit .env and add your API keys")
    
    print("\n5. Test the setup:")
    print("   python test_basic_setup.py")
    
    print("\n6. Run the quick start:")
    print("   python quick_start.py")
    
    print("\n📚 Learning path:")
    print("   • Start with notebooks in '00-course-setup/'")
    print("   • Progress through numbered directories")
    print("   • Complete hands-on projects")
    print("   • Build your own multi-agent systems")

def main():
    """Main function."""
    print("🔍 AutoGen Multi-Agent Applications - Requirements Check")
    print("=" * 60)
    
    # Run all checks
    python_ok = check_python_version()
    pip_ok = check_pip()
    venv_ok = check_virtual_environment()
    deps_ok = check_dependencies()
    env_ok = check_environment_file()
    files_ok = check_project_files()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 CHECK SUMMARY")
    print("=" * 60)
    
    checks = [
        ("Python Version", python_ok),
        ("pip", pip_ok),
        ("Virtual Environment", venv_ok),
        ("Dependencies", deps_ok),
        ("Environment Config", env_ok),
        ("Project Files", files_ok)
    ]
    
    all_passed = True
    for check_name, passed in checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{check_name:20} {status}")
        if not passed:
            all_passed = False
    
    if all_passed:
        print("\n🎉 All requirements met! Your setup is ready.")
        print("🚀 Run 'python quick_start.py' to get started!")
    else:
        print("\n⚠️  Some requirements are not met. See guidance below.")
        provide_guidance()

if __name__ == "__main__":
    main()

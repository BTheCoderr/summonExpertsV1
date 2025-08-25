#!/usr/bin/env python3
"""
Basic setup test script for AutoGen Multi-Agent Applications
This script tests the basic installation without requiring API keys.
"""

import sys
from pathlib import Path

def test_imports():
    """Test if all required packages can be imported."""
    print("🧪 Testing package imports...")
    
    packages = [
        'autogen_core',
        'autogen_agentchat',
        'autogen_ext',
        'streamlit',
        'fastapi',
        'uvicorn',
        'ipykernel'
    ]
    
    all_good = True
    for package in packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"  ✅ {package}")
        except ImportError as e:
            print(f"  ❌ {package}: {e}")
            all_good = False
    
    return all_good

def test_project_structure():
    """Test if project directories and files exist."""
    print("\n📁 Testing project structure...")
    
    required_dirs = [
        "00-course-setup",
        "01 - Models", 
        "02-important-autogen-concepts",
        "03 - Project 1: Explain and optimize code",
        "04 - Team - A group of Agents",
        "05 - Project2-Multi-AgentAIChatbotForCustomerSupport",
        "06 - Advanced Concepts"
    ]
    
    all_good = True
    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists():
            print(f"  ✅ {dir_name}/")
        else:
            print(f"  ❌ {dir_name}/ (missing)")
            all_good = False
    
    return all_good

def test_project_files():
    """Test if key project files exist."""
    print("\n📄 Testing project files...")
    
    required_files = [
        "03 - Project 1: Explain and optimize code/app.py",
        "03 - Project 1: Explain and optimize code/agent.py",
        "05 - Project2-Multi-AgentAIChatbotForCustomerSupport/app.py",
        "05 - Project2-Multi-AgentAIChatbotForCustomerSupport/team_api.py",
        "05 - Project2-Multi-AgentAIChatbotForCustomerSupport/teams.py",
        "requirements.txt",
        "README.md"
    ]
    
    all_good = True
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path} (missing)")
            all_good = False
    
    return all_good

def test_environment():
    """Test environment configuration."""
    print("\n🔧 Testing environment configuration...")
    
    env_file = Path('.env')
    if env_file.exists():
        print("  ✅ .env file exists")
        
        # Check if it has placeholder values
        with open(env_file, 'r') as f:
            content = f.read()
            if 'your_openai_api_key_here' in content:
                print("  ⚠️  .env file contains placeholder values - update with real API keys")
            else:
                print("  ✅ .env file appears to be configured")
    else:
        print("  ❌ .env file missing")
        return False
    
    return True

def main():
    """Main test function."""
    print("🚀 AutoGen Multi-Agent Applications - Basic Setup Test")
    print("=" * 60)
    
    # Test imports
    imports_ok = test_imports()
    
    # Test project structure
    structure_ok = test_project_structure()
    
    # Test project files
    files_ok = test_project_files()
    
    # Test environment
    env_ok = test_environment()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    print(f"Package Imports: {'✅ PASS' if imports_ok else '❌ FAIL'}")
    print(f"Project Structure: {'✅ PASS' if structure_ok else '❌ FAIL'}")
    print(f"Project Files: {'✅ PASS' if files_ok else '❌ FAIL'}")
    print(f"Environment Config: {'✅ PASS' if env_ok else '❌ FAIL'}")
    
    if all([imports_ok, structure_ok, files_ok, env_ok]):
        print("\n🎉 All basic tests passed! Your setup is ready.")
        print("\n📝 Next steps:")
        print("1. Update your .env file with real API keys")
        print("2. Run 'python setup.py' to test the full setup")
        print("3. Start with the notebooks in '00-course-setup/'")
    else:
        print("\n❌ Some tests failed. Please check the issues above.")
        print("\n🔧 To fix:")
        print("1. Ensure virtual environment is activated")
        print("2. Run 'pip install -r requirements.txt'")
        print("3. Check if all project files are present")

if __name__ == "__main__":
    main()

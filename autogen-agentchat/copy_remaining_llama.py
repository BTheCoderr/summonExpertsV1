#!/usr/bin/env python3
"""
Script to create the remaining Llama notebook content
"""

import json
from pathlib import Path

def create_llama_notebook(title, cells_content):
    """Create a Jupyter notebook with the given content."""
    notebook = {
        "cells": [],
        "metadata": {
            "kernelspec": {
                "display_name": "AutoGen (venv)",
                "language": "python",
                "name": "autogen-venv"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.13.3"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    # Add markdown cell for title
    notebook["cells"].append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [f"# {title}\n\nThis is a Llama version of the AutoGen concept notebook."]
    })
    
    # Add content cells
    for content in cells_content:
        if content.strip().startswith('#'):
            # Markdown cell
            notebook["cells"].append({
                "cell_type": "markdown",
                "metadata": {},
                "source": [content]
            })
        else:
            # Code cell
            notebook["cells"].append({
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [content]
            })
    
    return notebook

def main():
    """Main function to create remaining Llama notebooks."""
    print("🦙 Creating remaining Llama notebook content...")
    
    # Notebook 2: AssistantAgent
    assistant_cells = [
        "## AssistantAgent with Llama\n\nThis notebook demonstrates how to use AutoGen's AssistantAgent with Llama running locally on your machine.",
        "from autogen_ext.models.ollama import OllamaChatCompletionClient\nfrom autogen_agentchat.agents import AssistantAgent\nfrom autogen_agentchat.messages import TextMessage\nfrom autogen_core import CancellationToken\n\nprint('✅ All modules imported successfully!')",
        "llama_client = OllamaChatCompletionClient(\n    model='llama3.2:3b'\n)\n\nprint('🦙 Llama client ready!')",
        "assistant = AssistantAgent(\n    name='LlamaAssistant',\n    system_message='You are a helpful AI assistant. Answer questions clearly and concisely.',\n    model_client=llama_client\n)\n\nprint('🤖 Assistant agent created successfully!')",
        "message = TextMessage(content='Explain what AutoGen is in one sentence.', source='user')\nresponse = await assistant.on_messages([message], cancellation_token=CancellationToken())\n\nprint('📝 Question:', message.content)\nprint('🤖 Response:', response.chat_message.content)"
    ]
    
    # Notebook 3: AssistantAgent Part 2
    assistant_part2_cells = [
        "## Advanced AssistantAgent Features with Llama\n\nThis notebook shows advanced features of AssistantAgent using your local Llama model.",
        "from autogen_ext.models.ollama import OllamaChatCompletionClient\nfrom autogen_agentchat.agents import AssistantAgent\nfrom autogen_agentchat.messages import TextMessage\nfrom autogen_core import CancellationToken\n\nllama_client = OllamaChatCompletionClient(\n    model='llama3.2:3b'\n)\n\nprint('✅ Llama client ready!')",
        "coding_expert = AssistantAgent(\n    name='CodingExpert',\n    system_message='You are an expert Python programmer. Provide clear, well-documented code examples.',\n    model_client=llama_client\n)\n\nmath_tutor = AssistantAgent(\n    name='MathTutor',\n    system_message='You are a patient math tutor. Explain concepts step by step.',\n    model_client=llama_client\n)\n\nprint('🤖 Specialized agents created!')",
        "code_question = TextMessage(\n    content='Write a Python function to calculate fibonacci numbers with memoization.',\n    source='user'\n)\n\ncode_response = await coding_expert.on_messages([code_question], cancellation_token=CancellationToken())\nprint('✅ Code explanation successful!')\nprint(f'Explanation: {code_response.chat_message.content[:200]}...')",
        "math_question = TextMessage(\n    content='Explain how to solve quadratic equations step by step.',\n    source='user'\n)\n\nmath_response = await math_tutor.on_messages([math_question], cancellation_token=CancellationToken())\nprint('✅ Code optimization successful!')\nprint(f'Optimization: {math_response.chat_message.content[:200]}...')",
        "same_question = TextMessage(\n    content='What is recursion?',\n    source='user'\n)\n\ncoding_response = await coding_expert.on_messages([same_question], cancellation_token=CancellationToken())\nmath_response = await math_tutor.on_messages([same_question], cancellation_token=CancellationToken())\n\nprint('🤖 Coding Expert on Recursion:')\nprint(coding_response.chat_message.content)\nprint('\\n' + '='*50 + '\\n')\nprint('🧮 Math Tutor on Recursion:')\nprint(math_response.chat_message.content)"
    ]
    
    # Create the notebooks
    notebooks = {
        "2. AssistantAgent - Llama.ipynb": ("AssistantAgent - Llama Version", assistant_cells),
        "3. AssistantAgent Part 2 - Llama.ipynb": ("AssistantAgent Part 2 - Llama Version", assistant_part2_cells)
    }
    
    concepts_dir = Path("02-important-autogen-concepts")
    
    for filename, (title, cells) in notebooks.items():
        filepath = concepts_dir / filename
        notebook = create_llama_notebook(title, cells)
        
        with open(filepath, 'w') as f:
            json.dump(notebook, f, indent=1)
        
        print(f"✅ Created {filename}")
    
    print("\n🎉 All remaining Llama notebooks created successfully!")
    print("📝 You now have complete Llama versions of all concept notebooks!")

if __name__ == "__main__":
    main()

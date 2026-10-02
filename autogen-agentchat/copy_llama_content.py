#!/usr/bin/env python3
"""
Script to copy Llama notebook content into empty .ipynb files
"""

import json
import os
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
    for i, content in enumerate(cells_content):
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
    """Main function to create all Llama notebooks."""
    print("🦙 Creating Llama notebook content...")
    
    # Notebook 4: UserProxyAgent
    userproxy_cells = [
        "## UserProxyAgent with Llama\n\nThis notebook demonstrates how to use AutoGen's UserProxyAgent with Llama for automated conversations.",
        "from autogen_ext.models.ollama import OllamaChatCompletionClient\nfrom autogen_agentchat.agents import UserProxyAgent, AssistantAgent\nfrom autogen_agentchat.messages import TextMessage\nfrom autogen_core import CancellationToken\n\nprint('✅ All modules imported successfully!')",
        "llama_client = OllamaChatCompletionClient(\n    model='llama3.2:3b'\n)\n\nprint('🦙 Llama client ready!')",
        "assistant = AssistantAgent(\n    name='LlamaAssistant',\n    system_message='You are a helpful AI assistant. Answer questions clearly and concisely.',\n    model_client=llama_client\n)\n\nuser_proxy = UserProxyAgent(\n    name='UserProxy',\n    human_input_mode='NEVER',\n    max_consecutive_auto_reply=2\n)\n\nprint('🤖 Both agents created successfully!')",
        "message = TextMessage(content='Hello! Can you help me with a math problem?', source='user')\nresponse = await user_proxy.initiate_chat(\n    assistant,\n    message=message,\n    cancellation_token=CancellationToken()\n)\n\nprint('💬 Conversation started!')\nprint('📝 Initial message:', message.content)"
    ]
    
    # Notebook 5: Multi Model
    multimodel_cells = [
        "## Multi-Model Support with Llama\n\nThis notebook demonstrates how to work with multiple models and agents using Llama.",
        "from autogen_ext.models.ollama import OllamaChatCompletionClient\nfrom autogen_agentchat.agents import AssistantAgent\nfrom autogen_agentchat.messages import TextMessage\nfrom autogen_core import CancellationToken\n\nprint('✅ All modules imported successfully!')",
        "llama_client_1 = OllamaChatCompletionClient(model='llama3.2:3b')\nllama_client_2 = OllamaChatCompletionClient(model='llama3.2:3b')\n\nprint('🦙 Multiple Llama clients created!')",
        "coding_expert = AssistantAgent(\n    name='CodingExpert',\n    system_message='You are an expert Python programmer. Focus on clean, efficient code.',\n    model_client=llama_client_1\n)\n\ndebugging_expert = AssistantAgent(\n    name='DebuggingExpert',\n    system_message='You are an expert at debugging Python code. Help identify and fix issues.',\n    model_client=llama_client_2\n)\n\nprint('🤖 Specialized agents created!')",
        "code_question = TextMessage(\n    content='Write a function to sort a list of dictionaries by a specific key.',\n    source='user'\n)\n\ncode_response = await coding_expert.on_messages([code_question], cancellation_token=CancellationToken())\nprint('💻 Coding Expert Response:')\nprint(code_response.chat_message.content)"
    ]
    
    # Notebook 6: Streaming Messages
    streaming_cells = [
        "## Streaming Messages with Llama\n\nThis notebook demonstrates streaming message capabilities with your local Llama model.",
        "from autogen_ext.models.ollama import OllamaChatCompletionClient\nfrom autogen_agentchat.agents import AssistantAgent\nfrom autogen_agentchat.messages import TextMessage\nfrom autogen_core import CancellationToken\nimport asyncio\n\nprint('✅ All modules imported successfully!')",
        "llama_client = OllamaChatCompletionClient(\n    model='llama3.2:3b'\n)\n\nprint('🦙 Llama client ready!')",
        "streaming_agent = AssistantAgent(\n    name='StreamingAgent',\n    system_message='You are a helpful AI assistant. Provide detailed, step-by-step explanations.',\n    model_client=llama_client\n)\n\nprint('🤖 Streaming agent created!')",
        "message = TextMessage(\n    content='Explain how machine learning works in simple terms.',\n    source='user'\n)\n\nprint('📝 Sending message...')\nprint('🔄 Response will stream in real-time...')\n\nresponse = await streaming_agent.on_messages([message], cancellation_token=CancellationToken())\nprint('\\n✅ Complete response received:')\nprint(response.chat_message.content)"
    ]
    
    # Create the notebooks
    notebooks = {
        "4. UserProxyAgent - Llama.ipynb": ("UserProxyAgent - Llama Version", userproxy_cells),
        "5. Multi Model - Llama.ipynb": ("Multi Model - Llama Version", multimodel_cells),
        "6. Streaming Messages - Llama.ipynb": ("Streaming Messages - Llama Version", streaming_cells)
    }
    
    concepts_dir = Path("02-important-autogen-concepts")
    
    for filename, (title, cells) in notebooks.items():
        filepath = concepts_dir / filename
        notebook = create_llama_notebook(title, cells)
        
        with open(filepath, 'w') as f:
            json.dump(notebook, f, indent=1)
        
        print(f"✅ Created {filename}")
    
    print("\n🎉 All Llama notebooks created successfully!")
    print("📝 You can now open them in VS Code and run the cells!")

if __name__ == "__main__":
    main()

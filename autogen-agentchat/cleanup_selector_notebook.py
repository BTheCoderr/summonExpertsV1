#!/usr/bin/env python3
"""
Clean up the SelectorGroupChat notebook by removing duplicates and creating a clean structure
"""

import json

def cleanup_notebook():
    notebook_path = "04 - Team - A group of Agents/5 - SelectorGroupChat - Llama.ipynb"
    
    # Read the notebook
    with open(notebook_path, 'r') as f:
        notebook = json.load(f)
    
    print("🧹 Cleaning up SelectorGroupChat notebook...")
    print("🗑️  Removing duplicate cells and organizing structure...")
    
    # Create a clean, organized notebook structure
    clean_cells = []
    
    # Cell 1: Title and description
    clean_cells.append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "# Selector Group Chat - Ultra-Tiny Llama Version\n\n",
            "`SelectorGroupChat` is a dynamic team-based chat system where participants take turns broadcasting messages to all other members. Unlike traditional round-robin approaches, it leverages a generative model to intelligently select the next speaker based on the ongoing conversation.\n\n",
            "## 🚀 Why Ultra-Tiny Llama Models?\n\n",
            "- **qwen2.5:0.5b (397MB)**: Lightning fast for planning and coordination\n",
            "- **tinyllama:1.1b (637MB)**: Fast for specialized tasks\n",
            "- **gemma2:2b (1.6GB)**: Fast for quality responses\n",
            "- **All local** - no API costs or internet needed\n",
            "- **Expected speed**: 5-20 seconds instead of minutes!"
        ]
    })
    
    # Cell 2: How it works
    clean_cells.append({
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "## 🎯 How SelectorGroupChat Works\n\n",
            "1. **Intelligent Speaker Selection** – A model-driven approach determines the most relevant next speaker\n",
            "2. **Configurable Roles & Descriptions** – Define unique roles and attributes for each participant\n",
            "3. **Turn Management** – Prevents consecutive turns by the same speaker (optional)\n",
            "4. **Flexible Selection Process** – Customize the selection prompt and override the model's decision\n\n",
            "The system evaluates conversation history and participant attributes to select the most suitable next speaker."
        ]
    })
    
    # Cell 3: Imports
    clean_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Import required libraries for Llama SelectorGroupChat\n",
            "from autogen_agentchat.agents import AssistantAgent\n",
            "from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination\n",
            "from autogen_agentchat.messages import AgentEvent, ChatMessage\n",
            "from autogen_agentchat.teams import SelectorGroupChat\n",
            "from autogen_agentchat.ui import Console\n",
            "from autogen_ext.models.ollama import OllamaChatCompletionClient\n",
            "\n",
            "print('✅ All libraries imported successfully!')\n",
            "print('🚀 Ready to create ultra-tiny Llama SelectorGroupChat!')"
        ]
    })
    
    # Cell 4: Utility tools
    clean_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Define utility tools for the agents\n",
            "print('🔧 Setting up utility tools for the agents...')\n",
            "\n",
            "def weather_check_tool(city: str) -> str:\n",
            "    weather_data = {\n",
            "        \"Dubai\": \"Sunny, 35°C\",\n",
            "        \"New York\": \"Cloudy, 22°C\",\n",
            "        \"London\": \"Rainy, 18°C\",\n",
            "        \"Tokyo\": \"Clear, 26°C\"\n",
            "    }\n",
            "    return weather_data.get(city, \"Weather data not available.\")\n",
            "\n",
            "def currency_exchange_tool(amount: float, from_currency: str, to_currency: str) -> str:\n",
            "    exchange_rates = {\n",
            "        (\"USD\", \"EUR\"): 0.92,\n",
            "        (\"EUR\", \"USD\"): 1.08,\n",
            "        (\"USD\", \"AED\"): 3.67,\n",
            "        (\"AED\", \"USD\"): 0.27\n",
            "    }\n",
            "    rate = exchange_rates.get((from_currency, to_currency), None)\n",
            "    if rate:\n",
            "        converted_amount = amount * rate\n",
            "        return f\"{amount} {from_currency} is equal to {converted_amount:.2f} {to_currency}.\"\n",
            "    return f\"Exchange rate not available for {from_currency} to {to_currency}.\"\n",
            "\n",
            "print('✅ Utility tools created successfully!')"
        ]
    })
    
    # Cell 5: Model setup
    clean_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Create ultra-tiny Llama model clients\n",
            "print('🦙 Creating ultra-tiny Llama model clients...')\n",
            "print('🎯 Each model has different strengths and thinking styles!')\n",
            "\n",
            "# Model 1: Ultra-tiny, lightning fast for planning (397MB)\n",
            "planning_model = OllamaChatCompletionClient(\n",
            "    model='qwen2.5:0.5b'  # Ultra-tiny, only 397MB model\n",
            ")\n",
            "\n",
            "# Model 2: Super tiny, fast for weather tasks (637MB)\n",
            "weather_model = OllamaChatCompletionClient(\n",
            "    model='tinyllama:1.1b'  # Super tiny, only 637MB model\n",
            ")\n",
            "\n",
            "# Model 3: Tiny, fast for currency tasks (1.6GB)\n",
            "currency_model = OllamaChatCompletionClient(\n",
            "    model='gemma2:2b'  # Tiny, only 1.6GB model\n",
            ")\n",
            "\n",
            "print('✅ Three different ultra-tiny Llama models created!')\n",
            "print('   - Planning model: qwen2.5:0.5b (397MB)')\n",
            "print('   - Weather model: tinyllama:1.1b (637MB)')\n",
            "print('   - Currency model: gemma2:2b (1.6GB)')"
        ]
    })
    
    # Cell 6: Agent creation
    clean_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Create specialized agents with ultra-tiny Llama models\n",
            "print('🤖 Creating specialized agents with ultra-tiny Llama models...')\n",
            "\n",
            "# Planning Agent - coordinates and delegates tasks\n",
            "planning_agent = AssistantAgent(\n",
            "    name=\"PlanningAgent\",\n",
            "    description=\"An agent for planning tasks. It should break down tasks and delegate them to the appropriate agents.\",\n",
            "    model_client=planning_model,\n",
            "    system_message=\"\"\"\n",
            "    You are a planning agent using qwen2.5:0.5b.\n",
            "    Your job is to break down complex tasks into smaller, manageable subtasks.\n",
            "    Your team members are:\n",
            "        WeatherAgent: Checks weather conditions\n",
            "        CurrencyAgent: Handles currency conversion\n",
            "    \n",
            "    When given a task, analyze it and delegate appropriate parts to your team members.\n",
            "    Be concise and focused in your planning.\n",
            "    \"\"\"\n",
            ")\n",
            "\n",
            "# Create the Weather Agent\n",
            "weather_agent = AssistantAgent(\n",
            "    name=\"WeatherAgent\",\n",
            "    description=\"An agent that checks weather conditions for cities.\",\n",
            "    model_client=weather_model,\n",
            "    system_message=\"\"\"\n",
            "    You are a weather agent using tinyllama:1.1b.\n",
            "    Your job is to check weather conditions for cities using the weather_check_tool.\n",
            "    When asked about weather, use the tool to get current conditions.\n",
            "    Keep responses concise and focused on weather information.\n",
            "    \"\"\"\n",
            ")\n",
            "\n",
            "# Create the Currency Agent\n",
            "currency_agent = AssistantAgent(\n",
            "    name=\"CurrencyAgent\",\n",
            "    description=\"An agent that handles currency conversion.\",\n",
            "    model_client=currency_model,\n",
            "    system_message=\"\"\"\n",
            "    You are a currency agent using gemma2:2b.\n",
            "    Your job is to handle currency conversion using the currency_exchange_tool.\n",
            "    When asked about currency conversion, use the tool to get exchange rates.\n",
            "    Keep responses concise and focused on currency information.\n",
            "    \"\"\"\n",
            ")\n",
            "\n",
            "print('✅ Three specialized agents created successfully!')\n",
            "print('   - PlanningAgent: Uses qwen2.5:0.5b for coordination')\n",
            "print('   - WeatherAgent: Uses tinyllama:1.1b for weather tasks')\n",
            "print('   - CurrencyAgent: Uses gemma2:2b for currency tasks')"
        ]
    })
    
    # Cell 7: Team setup
    clean_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Set up the SelectorGroupChat team with termination conditions\n",
            "print('🔧 Setting up the SelectorGroupChat team...')\n",
            "\n",
            "# Create termination conditions\n",
            "max_msg_termination = MaxMessageTermination(max_messages=8)\n",
            "text_termination = TextMentionTermination(\"COMPLETE\")\n",
            "\n",
            "# Combine conditions using OR (|)\n",
            "combined_termination = max_msg_termination | text_termination\n",
            "\n",
            "# Create the SelectorGroupChat team\n",
            "selector_team = SelectorGroupChat(\n",
            "    [planning_agent, weather_agent, currency_agent],\n",
            "    model_client=planning_model,  # Uses planning model for speaker selection\n",
            "    termination_condition=combined_termination,\n",
            "    allow_repeated_speaker=False\n",
            ")\n",
            "\n",
            "print('✅ SelectorGroupChat team created successfully!')\n",
            "print('   - Three specialized agents with different Llama models')\n",
            "print('   - Intelligent speaker selection based on context')\n",
            "print('   - Termination: Max 8 messages OR \"COMPLETE\" keyword')\n",
            "print('   - Ready to test intelligent agent selection!')"
        ]
    })
    
    # Cell 8: Test the team
    clean_cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [
            "# Test the SelectorGroupChat team with a complex task\n",
            "print('🧪 Testing the SelectorGroupChat team...')\n",
            "print('📝 Task: Plan a business trip with weather and currency considerations')\n",
            "print('⏱️  Expected time: 10-30 seconds')\n",
            "print('🎯 Watch how the 3 different models collaborate intelligently!')\n",
            "\n",
            "# Run the team\n",
            "await Console(selector_team.run_stream(\n",
            "    task=\"Plan a business trip from New York to Dubai. Check the weather in Dubai and convert $5000 USD to AED. Provide a complete travel plan.\"\n",
            "))"
        ]
    })
    
    # Update the notebook with clean cells
    notebook['cells'] = clean_cells
    
    # Write the cleaned notebook
    with open(notebook_path, 'w') as f:
        json.dump(notebook, f, indent=1)
    
    print(f"✅ Notebook cleaned up successfully!")
    print(f"📊 Before: {len(notebook['cells'])} cells (many duplicates)")
    print(f"📊 After: {len(clean_cells)} clean, organized cells")
    print("🚀 Your SelectorGroupChat notebook is now clean and ready to use!")

if __name__ == "__main__":
    cleanup_notebook()

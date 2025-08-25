#!/usr/bin/env python3
"""
AutoGen Learning Lab - Study different patterns and configurations
"""
import os
import asyncio
import json
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import AutoGen components
try:
    from autogen_agentchat.agents import AssistantAgent, UserProxyAgent
    from autogen_agentchat.teams import RoundRobinGroupChat, SelectorGroupChat
    from autogen_agentchat.conditions import TextMentionTermination, MaxTurnTermination
    from autogen_ext.models.openai import OpenAIChatCompletionClient
    from autogen_ext.models.anthropic import AnthropicCompletionClient
    print("✅ AutoGen imports successful")
except ImportError as e:
    print(f"❌ AutoGen import failed: {e}")
    print("Please install requirements: pip install -r requirements.txt")
    exit(1)

class AutoGenLearningLab:
    """Learning lab to study different AutoGen patterns"""
    
    def __init__(self):
        # Initialize model clients
        self.gpt = OpenAIChatCompletionClient(
            model=os.getenv("OPENAI_MODEL", "gpt-4o")
        )
        self.claude = AnthropicCompletionClient(
            model=os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet")
        )
        
        print(f"🤖 Models initialized:")
        print(f"   OpenAI: {os.getenv('OPENAI_MODEL', 'gpt-4o')}")
        print(f"   Anthropic: {os.getenv('ANTHROPIC_MODEL', 'claude-3-5-sonnet')}")
    
    def create_basic_team(self) -> RoundRobinGroupChat:
        """Pattern 1: Basic Round Robin Team"""
        print("\n🔍 Studying Pattern 1: Basic Round Robin Team")
        
        planner = AssistantAgent(
            name="Planner",
            model_client=self.gpt,
            system_message="You are a strategic planner. Break down complex problems into clear steps."
        )
        
        executor = AssistantAgent(
            name="Executor", 
            model_client=self.claude,
            system_message="You are an execution specialist. Take plans and turn them into actionable items."
        )
        
        team = RoundRobinGroupChat(
            participants=[planner, executor],
            max_turns=4
        )
        
        print("   ✅ Created basic round-robin team")
        print("   📝 Pattern: Simple back-and-forth between agents")
        return team
    
    def create_termination_team(self) -> RoundRobinGroupChat:
        """Pattern 2: Team with Termination Conditions"""
        print("\n🔍 Studying Pattern 2: Termination Conditions")
        
        researcher = AssistantAgent(
            name="Researcher",
            model_client=self.gpt,
            system_message="Research topics thoroughly. End with 'RESEARCH_COMPLETE' when done."
        )
        
        summarizer = AssistantAgent(
            name="Summarizer",
            model_client=self.claude,
            system_message="Summarize research findings concisely. End with 'SUMMARY_DONE' when complete."
        )
        
        # Multiple termination conditions
        term_conditions = [
            TextMentionTermination("RESEARCH_COMPLETE", must_be_complete_sentence=False),
            TextMentionTermination("SUMMARY_DONE", must_be_complete_sentence=False),
            MaxTurnTermination(6)
        ]
        
        team = RoundRobinGroupChat(
            participants=[researcher, summarizer],
            termination_conditions=term_conditions
        )
        
        print("   ✅ Created termination-based team")
        print("   📝 Pattern: Multiple ways to end conversation")
        return team
    
    def create_selector_team(self) -> SelectorGroupChat:
        """Pattern 3: Selector Group Chat (Agent Selection)"""
        print("\n🔍 Studying Pattern 3: Selector Group Chat")
        
        coordinator = AssistantAgent(
            name="Coordinator",
            model_client=self.gpt,
            system_message="You coordinate work by selecting the best agent for each task."
        )
        
        coder = AssistantAgent(
            name="Coder",
            model_client=self.gpt,
            system_message="You write code and solve technical problems."
        )
        
        writer = AssistantAgent(
            name="Writer",
            model_client=self.claude,
            system_message="You write documentation and explanations."
        )
        
        team = SelectorGroupChat(
            participants=[coordinator, coder, writer],
            selector=coordinator,
            max_turns=8
        )
        
        print("   ✅ Created selector-based team")
        print("   📝 Pattern: Coordinator selects which agent responds")
        return team
    
    def create_human_in_loop_team(self) -> RoundRobinGroupChat:
        """Pattern 4: Human in the Loop"""
        print("\n🔍 Studying Pattern 4: Human in the Loop")
        
        analyst = AssistantAgent(
            name="Analyst",
            model_client=self.gpt,
            system_message="Analyze data and provide insights. Ask for human input when needed."
        )
        
        human = UserProxyAgent(
            name="Human",
            human_input_mode="ALWAYS"  # Always ask for human input
        )
        
        team = RoundRobinGroupChat(
            participants=[analyst, human],
            max_turns=10
        )
        
        print("   ✅ Created human-in-loop team")
        print("   📝 Pattern: Human participates in agent conversations")
        return team
    
    async def study_team_behavior(self, team, task: str, pattern_name: str):
        """Study how a team behaves with a given task"""
        print(f"\n🧪 Testing {pattern_name}")
        print(f"   Task: {task}")
        print(f"   Team Type: {team.__class__.__name__}")
        print(f"   Participants: {[p.name for p in team.participants]}")
        print(f"   Max Turns: {getattr(team, 'max_turns', 'Unlimited')}")
        
        try:
            print("\n   📡 Starting conversation...")
            async for event in team.run_stream(task=task):
                event_type = getattr(event, 'type', event.__class__.__name__)
                source = getattr(event, 'source', 'Unknown')
                content = getattr(event, 'content', '')
                
                print(f"      🔄 {source}: {event_type}")
                if content and len(content) > 100:
                    print(f"         Content: {content[:100]}...")
                elif content:
                    print(f"         Content: {content}")
            
            print("   ✅ Conversation completed")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    async def run_learning_experiments(self):
        """Run all learning experiments"""
        print("🚀 AutoGen Learning Lab - Starting Experiments")
        print("=" * 60)
        
        # Test different team patterns
        experiments = [
            (self.create_basic_team(), 
             "Plan a weekend trip to New York City", 
             "Basic Round Robin"),
            
            (self.create_termination_team(), 
             "Research the history of artificial intelligence", 
             "Termination Conditions"),
            
            (self.create_selector_team(), 
             "Create a Python web scraper with documentation", 
             "Selector Group Chat"),
        ]
        
        for team, task, pattern_name in experiments:
            await self.study_team_behavior(team, task, pattern_name)
            print("\n" + "-" * 40)
        
        print("\n🎓 Learning Complete!")
        print("\n📚 Key Patterns Studied:")
        print("   1. Round Robin: Simple agent rotation")
        print("   2. Termination: Multiple ways to end conversations")
        print("   3. Selector: Smart agent selection")
        print("   4. Human-in-Loop: Human participation")
        
        print("\n💡 Next Steps:")
        print("   - Study the code patterns in each team creation")
        print("   - Experiment with different agent personalities")
        print("   - Try different termination conditions")
        print("   - Build your own patterns in Next.js!")

async def main():
    """Main learning lab function"""
    lab = AutoGenLearningLab()
    await lab.run_learning_experiments()

if __name__ == "__main__":
    # Check environment variables
    required_vars = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\nPlease set these in your .env file")
        exit(1)
    
    # Run learning lab
    asyncio.run(main())

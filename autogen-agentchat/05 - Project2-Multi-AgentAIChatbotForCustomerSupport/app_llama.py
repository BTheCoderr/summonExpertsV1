import streamlit as st
import requests

# Streamlit UI Configuration
st.set_page_config(page_title="AI Chatbot - ULTRA-TINY LLAMA VERSION", layout="wide")

st.title("💬 Multi-Agent AI Chatbot for Customer Support - **ULTRA-TINY LLAMA VERSION** 🦙")

# Add Llama version info
st.markdown("""
**🦙 Powered by 3 Ultra-Tiny Local Llama Models:**
- **qwen2.5:0.5b (397MB)** - Lightning fast planning & coordination
- **tinyllama:1.1b (637MB)** - Fast product & order operations  
- **gemma2:2b (1.6GB)** - Quality customer service responses

**⚡ Benefits:** Local execution, no API costs, 3 different AI perspectives!
""")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input field
if user_input := st.chat_input("Type your customer support query here..."):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    # Process user query with chatbot
    with st.spinner("🦙 Processing with ultra-tiny Llama models..."):
        try:
            response = requests.post(
                "http://127.0.0.1:8000/chat/", 
                json={"query": user_input},  # Ensure correct JSON format
                headers={"Content-Type": "application/json"},  # Explicitly set header
                timeout=30  # Increased timeout for Llama models
            )

            if response.status_code == 200:
                bot_response = response.json()["response"]
            else:
                bot_response = f"Error: {response.status_code} - {response.text}"

        except requests.exceptions.RequestException as e:
            bot_response = f"Error: Unable to connect to the Llama-powered chatbot server.\n{str(e)}"

        # Add bot response to chat history
        st.session_state.messages.append({"role": "assistant", "content": bot_response})
        with st.chat_message("assistant"):
            st.markdown(bot_response)

# Add footer with Llama info
st.markdown("---")
st.markdown("""
**🚀 This customer support chatbot is powered by 3 ultra-tiny local Llama models working together!**
- **No internet required** - all AI processing happens locally
- **3 different thinking styles** - diverse perspectives on every customer query
- **Lightning fast** - ultra-tiny models for quick responses
- **Privacy focused** - all customer data stays on your machine
""")

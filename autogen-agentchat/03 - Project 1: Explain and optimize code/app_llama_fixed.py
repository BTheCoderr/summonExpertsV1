import streamlit as st
import asyncio
from agent_llama import get_code_explanation, get_code_optimization

# Streamlit UI
st.title("💡 AI Code Explainer & Debugger (Powered by Llama)")
st.write("Upload a Python file or paste your code below to get AI-powered explanations and debugging insights using Llama.")

# File Upload or Text Input
uploaded_file = st.file_uploader("Upload a Python file", type=["py"])
code_input = st.text_area("Or paste your Python code here:", height=200, 
                         value="""# Example Python code
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))""")

# Initialize session state
if 'explanation' not in st.session_state:
    st.session_state.explanation = None
if 'optimization' not in st.session_state:
    st.session_state.optimization = None

# Process when "Send" button is clicked
if st.button("🚀 Send"):
    if uploaded_file:
        code = uploaded_file.read().decode("utf-8")
    elif code_input:
        code = code_input
    else:
        st.warning("⚠️ Please upload a file or enter code before clicking 'Send'.")
        st.stop()

    # Show the code that will be analyzed
    st.subheader("📝 Code to Analyze")
    st.code(code, language="python")
    
    # Create columns for better layout
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📖 Code Explanation")
        with st.spinner("🔍 Analyzing code with Llama... Please wait."):
            try:
                # Run the async function properly
                explanation = asyncio.run(get_code_explanation(code))
                st.session_state.explanation = explanation
                st.success("✅ Analysis complete!")
            except Exception as e:
                st.error(f"❌ Error during analysis: {str(e)}")
                st.session_state.explanation = None

    with col2:
        st.subheader("🚀 Optimization Suggestions")
        with st.spinner("✨ Optimizing code with Llama... Please wait."):
            try:
                # Run the async function properly
                optimized_code = asyncio.run(get_code_optimization(code))
                st.session_state.optimization = optimized_code
                st.success("✅ Optimization complete!")
            except Exception as e:
                st.error(f"❌ Error during optimization: {str(e)}")
                st.session_state.optimization = None

# Display results if they exist
if st.session_state.explanation:
    st.subheader("📖 Code Explanation Results")
    st.markdown(st.session_state.explanation)

if st.session_state.optimization:
    st.subheader("🚀 Optimization Results")
    st.markdown(st.session_state.optimization)

# Add a reset button
if st.button("🔄 Reset Results"):
    st.session_state.explanation = None
    st.session_state.optimization = None
    st.rerun()

# Add helpful information
st.markdown("---")
st.markdown("""
### 💡 How to use:
1. **Upload a Python file** or **paste your code** in the text area above
2. Click the **🚀 Send** button to analyze your code
3. Wait for both the explanation and optimization to complete
4. View the results below

### 🔧 What this app does:
- **Code Explanation**: Analyzes your Python code and explains what it does
- **Optimization**: Suggests improvements for better performance and readability
- **Powered by**: Llama 3.2:3b running locally via Ollama

### 🚨 Troubleshooting:
- Make sure Ollama is running (`ollama list` should show your models)
- If you get errors, try refreshing the page and running again
- The app uses your local Llama model, so no API keys needed!
""")

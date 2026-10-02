#!/usr/bin/env python3
"""
Configuration file for Summon Experts Multi-Agent Service
"""

import os
from typing import List

class Config:
    """Configuration class for the service"""
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,http://localhost:8501,https://summonexperts.com"
    ).split(",")
    
    # AutoGen Configuration
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    # OpenAI Configuration (if using OpenAI models)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # Anthropic Configuration (if using Claude models)
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-3-sonnet-20240229")
    
    # Session Management
    SESSION_TIMEOUT_HOURS: int = int(os.getenv("SESSION_TIMEOUT_HOURS", "24"))
    MAX_SESSIONS_PER_USER: int = int(os.getenv("MAX_SESSIONS_PER_USER", "10"))
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = os.getenv("LOG_FILE", "summon_experts.log")
    
    @classmethod
    def get_cors_origins(cls) -> List[str]:
        """Get CORS origins as a list"""
        return [origin.strip() for origin in cls.ALLOWED_ORIGINS if origin.strip()]
    
    @classmethod
    def is_openai_enabled(cls) -> bool:
        """Check if OpenAI is configured"""
        return bool(cls.OPENAI_API_KEY)
    
    @classmethod
    def is_anthropic_enabled(cls) -> bool:
        """Check if Anthropic is configured"""
        return bool(cls.ANTHROPIC_API_KEY)
    
    @classmethod
    def is_ollama_enabled(cls) -> bool:
        """Check if Ollama is configured (default)"""
        return True  # Always enabled as fallback

# Global config instance
config = Config()

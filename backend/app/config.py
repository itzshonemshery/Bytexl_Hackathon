import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "Healthiecure"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "healthiecure-secure-dev-jwt-key-2026-altrix")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Storage
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "storage", "uploads")
    PROCESSED_DIR: str = os.path.join(BASE_DIR, "storage", "processed")
    SAMPLES_DIR: str = os.path.join(BASE_DIR, "storage", "samples")
    DB_PATH: str = os.path.join(BASE_DIR, "health_copilot.db")
    
    # AI / LLM Configuration (Optional integration with graceful grounded fallback)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "deterministic_grounded") # 'gemini', 'openai', or 'deterministic_grounded'
    
    # ABHA Sandbox Mock
    ABHA_SANDBOX_URL: str = "https://sandbox.abdm.gov.in/v1"
    
settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.PROCESSED_DIR, exist_ok=True)
os.makedirs(settings.SAMPLES_DIR, exist_ok=True)

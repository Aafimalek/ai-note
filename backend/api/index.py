import os
import sys
from pathlib import Path

# Add parent directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from dotenv import load_dotenv
load_dotenv()

from mangum import Mangum
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ai, security

app = FastAPI()

# Get allowed origins from environment or use defaults
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    # Default origins - add your Vercel frontend URL here
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://ai-notez.fun",
        "https://ai-notes-snowy-delta.vercel.app",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)
app.include_router(security.router)

@app.get("/")
def read_root():
    return {"message": "AI Notes Backend is running"}

# Handler for Vercel
handler = Mangum(app, lifespan="off")


import os
import sys
from pathlib import Path

# Add parent directory to Python path
backend_dir = Path(__file__).parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional

from mangum import Mangum
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers after path is set
try:
    from routers import ai, security
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Python path: {sys.path}")
    raise

# Create FastAPI app
app = FastAPI(title="AI Notes Backend API")

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
        "https://www.ai-notez.fun"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai.router)
app.include_router(security.router)

@app.get("/")
def read_root():
    return {"message": "AI Notes Backend is running", "status": "ok"}

# Handler for Vercel - must be named 'handler'
handler = Mangum(app, lifespan="off")


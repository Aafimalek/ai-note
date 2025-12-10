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
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# Import routers after path is set
try:
    from routers import ai, security
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Python path: {sys.path}")
    raise

# Allowed origins - use wildcard for simplicity since credentials aren't strictly needed
ALLOWED_ORIGINS = ["*"]

# Custom CORS middleware that properly handles preflight
class CORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")
        
        # Handle preflight OPTIONS request
        if request.method == "OPTIONS":
            response = JSONResponse(content={}, status_code=200)
        else:
            response = await call_next(request)
        
        # Set CORS headers for all responses
        if origin in ALLOWED_ORIGINS or "*" in ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin if origin else "*"
        else:
            # Allow the request but with the first allowed origin
            response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "*"
        
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Origin"
        response.headers["Access-Control-Max-Age"] = "86400"
        
        return response

# Create FastAPI app
app = FastAPI(title="AI Notes Backend API")

# Add custom CORS middleware
app.add_middleware(CORSMiddleware)

# Include routers
app.include_router(ai.router)
app.include_router(security.router)

@app.get("/")
def read_root():
    return {"message": "AI Notes Backend is running", "status": "ok"}

# Explicit OPTIONS handlers for all AI routes
@app.options("/ai/{path:path}")
async def options_ai():
    return JSONResponse(content={}, status_code=200)

@app.options("/security/{path:path}")
async def options_security():
    return JSONResponse(content={}, status_code=200)

@app.options("/")
async def options_root():
    return JSONResponse(content={}, status_code=200)

# Handler for Vercel - must be named 'handler'
handler = Mangum(app, lifespan="off")

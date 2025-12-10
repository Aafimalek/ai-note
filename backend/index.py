from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ai, security
import os

app = FastAPI()

origins = [
    # "http://localhost:3000",
    # "http://127.0.0.1:3000",
    # "https://ai-notez.fun",
    # "https://www.ai-notez.fun"
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router)
app.include_router(security.router)

@app.get("/")
def read_root():
    return {"message": "AI Notes Backend is running"}

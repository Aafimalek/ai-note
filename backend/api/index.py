# api/index.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from mangum import Mangum

app = FastAPI()

@app.get("/")
def home():
    return {"message": "FastAPI running on Vercel!"}

handler = Mangum(app)

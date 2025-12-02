from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services import groq_service

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

class TextRequest(BaseModel):
    text: str

class TranslateRequest(BaseModel):
    text: str
    target_language: str

@router.post("/glossary")
def get_glossary(request: TextRequest):
    try:
        glossary = groq_service.extract_glossary(request.text)
        return glossary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summary")
def get_summary(request: TextRequest):
    try:
        summary = groq_service.summarize_note(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tags")
def get_tags(request: TextRequest):
    try:
        tags = groq_service.suggest_tags(request.text)
        return {"tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/grammar")
def check_grammar(request: TextRequest):
    try:
        corrected_text = groq_service.check_grammar(request.text)
        return {"corrected_text": corrected_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/translate")
def translate_text(request: TranslateRequest):
    try:
        translation = groq_service.translate_note(request.text, request.target_language)
        return {"translation": translation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

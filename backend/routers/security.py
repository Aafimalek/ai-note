from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services import encryption_service

router = APIRouter(
    prefix="/security",
    tags=["security"],
)

class TextRequest(BaseModel):
    text: str

@router.post("/encrypt")
def encrypt_note(request: TextRequest):
    try:
        encrypted_text = encryption_service.encrypt_text(request.text)
        return {"encrypted_text": encrypted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decrypt")
def decrypt_note(request: TextRequest):
    try:
        decrypted_text = encryption_service.decrypt_text(request.text)
        return {"decrypted_text": decrypted_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

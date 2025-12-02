from cryptography.fernet import Fernet
import os

# Load key from environment variable
key = os.environ.get("ENCRYPTION_KEY")
if not key:
    raise ValueError("ENCRYPTION_KEY not found in environment variables")

cipher_suite = Fernet(key.encode())

def encrypt_text(text: str) -> str:
    if not text:
        return ""
    encrypted_text = cipher_suite.encrypt(text.encode())
    return encrypted_text.decode()

def decrypt_text(encrypted_text: str) -> str:
    if not encrypted_text:
        return ""
    decrypted_text = cipher_suite.decrypt(encrypted_text.encode())
    return decrypted_text.decode()

from cryptography.fernet import Fernet
import os

# Load key from environment variable
key = os.environ.get("ENCRYPTION_KEY")
if not key:
    # Generate a default key for development (not secure for production)
    # In production, ENCRYPTION_KEY must be set
    key = Fernet.generate_key().decode()
    print("WARNING: ENCRYPTION_KEY not set. Using generated key (not secure for production)")

try:
    cipher_suite = Fernet(key.encode())
except Exception as e:
    # Fallback: create a new key if the provided one is invalid
    print(f"Error initializing cipher: {e}")
    new_key = Fernet.generate_key()
    cipher_suite = Fernet(new_key)

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

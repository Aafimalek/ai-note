from cryptography.fernet import Fernet
import os

# Lazy initialization to avoid errors at import time
_cipher_suite = None

def _get_cipher_suite():
    """Get or create cipher suite (lazy initialization)"""
    global _cipher_suite
    if _cipher_suite is not None:
        return _cipher_suite
    
    key = os.environ.get("ENCRYPTION_KEY")
    if not key:
        # Generate a default key for development (not secure for production)
        # In production, ENCRYPTION_KEY must be set
        key = Fernet.generate_key().decode()
        print("WARNING: ENCRYPTION_KEY not set. Using generated key (not secure for production)")
    
    try:
        # Try to use the provided key
        if isinstance(key, str):
            _cipher_suite = Fernet(key.encode())
        else:
            _cipher_suite = Fernet(key)
    except Exception as e:
        # Fallback: create a new key if the provided one is invalid
        print(f"Error initializing cipher: {e}")
        new_key = Fernet.generate_key()
        _cipher_suite = Fernet(new_key)
        print("Using generated fallback key")
    
    return _cipher_suite

def encrypt_text(text: str) -> str:
    if not text:
        return ""
    cipher = _get_cipher_suite()
    encrypted_text = cipher.encrypt(text.encode())
    return encrypted_text.decode()

def decrypt_text(encrypted_text: str) -> str:
    if not encrypted_text:
        return ""
    cipher = _get_cipher_suite()
    decrypted_text = cipher.decrypt(encrypted_text.encode())
    return decrypted_text.decode()

import os
from groq import Groq
import json

MODEL = "moonshotai/kimi-k2-instruct-0905"

def get_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)

def get_completion(prompt):
    client = get_client()
    if not client:
        return "Error: GROQ_API_KEY not set. Please set it in backend/.env"
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=MODEL,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Error calling Groq API: {str(e)}"

def extract_glossary(text):
    prompt = f"""
    Identify important terms, concepts, entities, and key phrases in the following text and provide a brief definition for each.
    Be comprehensive and extract as many relevant terms as possible, including proper nouns, technical terms, and significant vocabulary.
    Return the result as a JSON object where keys are the terms and values are the definitions.
    
    Text:
    {text}
    
    JSON Output:
    """
    response = get_completion(prompt)
    try:
        # Attempt to parse JSON, handling potential markdown code blocks
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0]
        elif "```" in response:
            response = response.split("```")[1].split("```")[0]
        return json.loads(response)
    except json.JSONDecodeError:
        return {"error": "Failed to parse glossary", "raw_response": response}

def summarize_note(text):
    prompt = f"""
    Provide a concise summary of the following note.
    
    Note:
    {text}
    
    Summary:
    """
    return get_completion(prompt)

def suggest_tags(text):
    prompt = f"""
    Suggest 3-5 relevant tags for the following note.
    Return the result as a JSON list of strings.
    
    Note:
    {text}
    
    Tags (JSON list):
    """
    response = get_completion(prompt)
    try:
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0]
        elif "```" in response:
            response = response.split("```")[1].split("```")[0]
        return json.loads(response)
    except json.JSONDecodeError:
        return []

def check_grammar(text):
    prompt = f"""
    The following text contains HTML. Check the grammar of the content within the tags.
    Do not modify the HTML tags themselves.
    
    Return the result as a JSON object with two keys:
    - "corrected": boolean (true if errors were found and fixed, false otherwise)
    - "text": string (the corrected text if errors were found, or the original text if no errors)
    
    Do not include any other text or conversational preamble.
    
    Text:
    {text}
    
    JSON Output:
    """
    response = get_completion(prompt)
    try:
        # Attempt to parse JSON, handling potential markdown code blocks
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0]
        elif "```" in response:
            response = response.split("```")[1].split("```")[0]
        
        data = json.loads(response)
        # If corrected is false, ensure we return the original text (or the one from JSON if it's identical)
        # But to be safe against hallucination, if corrected is False, we might want to return original text.
        # However, the prompt asks for text in JSON. Let's trust the JSON 'text' field but prioritize 'corrected' flag if needed.
        # Actually, let's just return the text from JSON.
        return data.get("text", text)
    except json.JSONDecodeError:
        # Fallback: if JSON parsing fails, return original text to be safe, or the raw response?
        # Returning raw response caused the issue. Let's return original text if we can't parse.
        return text

def translate_note(text, target_language):
    prompt = f"""
    Translate the following text to {target_language}.
    
    Text:
    {text}
    
    Translation:
    """
    return get_completion(prompt)

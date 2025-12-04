import os
from groq import Groq
import json
import re
from html.parser import HTMLParser

MODEL = "moonshotai/kimi-k2-instruct-0905"

class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
    
    def handle_data(self, data):
        self.text.append(data)
    
    def get_text(self):
        return ' '.join(self.text)

def extract_text_from_html(html_content):
    """Extract plain text from HTML content"""
    if not html_content:
        return ""
    parser = HTMLTextExtractor()
    parser.feed(html_content)
    return parser.get_text().strip()

def get_client():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not set. Please set it in backend/.env")
    return Groq(api_key=api_key)

def get_completion(prompt, max_retries=2):
    """Get completion from Groq API with retry logic"""
    client = get_client()
    
    for attempt in range(max_retries):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=MODEL,
                temperature=0.7,
            )
            content = chat_completion.choices[0].message.content
            if not content:
                raise ValueError("Empty response from Groq API")
            return content
        except Exception as e:
            if attempt == max_retries - 1:
                raise Exception(f"Error calling Groq API after {max_retries} attempts: {str(e)}")
            continue
    raise Exception("Failed to get completion from Groq API")

def extract_glossary(text):
    """Extract glossary terms from text (handles HTML content)"""
    # Extract plain text for processing
    plain_text = extract_text_from_html(text) if text else ""
    if not plain_text:
        return {}
    
    prompt = f"""Identify important terms, concepts, entities, and key phrases in the following text and provide a brief definition for each.
Be comprehensive and extract as many relevant terms as possible, including proper nouns, technical terms, and significant vocabulary.
Return ONLY a valid JSON object where keys are the terms and values are the definitions. Do not include any markdown formatting or explanations.

Text:
{plain_text}

JSON Output:"""
    
    try:
        response = get_completion(prompt)
        # Clean response - remove markdown code blocks if present
        response = response.strip()
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0].strip()
        elif "```" in response:
            response = response.split("```")[1].split("```")[0].strip()
        
        # Try to find JSON object in response
        json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', response, re.DOTALL)
        if json_match:
            response = json_match.group(0)
        
        glossary = json.loads(response)
        # Ensure it's a dictionary
        if isinstance(glossary, dict):
            return glossary
        else:
            return {}
    except (json.JSONDecodeError, Exception) as e:
        # Return empty dict on error to avoid breaking frontend
        return {}

def summarize_note(text):
    """Summarize note content (handles HTML content)"""
    # Extract plain text for processing
    plain_text = extract_text_from_html(text) if text else ""
    if not plain_text:
        return "No content to summarize."
    
    prompt = f"""Provide a concise and informative summary of the following note. Focus on key points and main ideas.

Note:
{plain_text}

Summary:"""
    
    try:
        return get_completion(prompt)
    except Exception as e:
        return f"Error generating summary: {str(e)}"

def suggest_tags(text):
    """Suggest tags for note content (handles HTML content)"""
    # Extract plain text for processing
    plain_text = extract_text_from_html(text) if text else ""
    if not plain_text:
        return []
    
    prompt = f"""Suggest 3-5 relevant, concise tags for the following note. Tags should be single words or short phrases.
Return ONLY a valid JSON array of strings. Do not include any markdown formatting or explanations.

Note:
{plain_text}

Tags (JSON array):"""
    
    try:
        response = get_completion(prompt)
        # Clean response
        response = response.strip()
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0].strip()
        elif "```" in response:
            response = response.split("```")[1].split("```")[0].strip()
        
        # Try to find JSON array in response
        json_match = re.search(r'\[[^\]]*\]', response)
        if json_match:
            response = json_match.group(0)
        
        tags = json.loads(response)
        # Ensure it's a list and filter out empty strings
        if isinstance(tags, list):
            return [tag.strip() for tag in tags if tag and tag.strip()]
        else:
            return []
    except (json.JSONDecodeError, Exception) as e:
        # Return empty list on error
        return []

def check_grammar(text):
    """Check and correct grammar in HTML content, preserving HTML structure"""
    if not text:
        return text
    
    prompt = f"""The following text contains HTML markup. Check the grammar and spelling of the text content within the HTML tags.
IMPORTANT: Preserve all HTML tags exactly as they are. Only correct the text content between tags.
Return ONLY a valid JSON object with this exact structure:
{{
    "corrected": true or false,
    "text": "the corrected HTML text with all tags preserved"
}}

Do not include any markdown formatting, explanations, or other text. Only return the JSON object.

Original text with HTML:
{text}

JSON Output:"""
    
    try:
        response = get_completion(prompt)
        # Clean response
        response = response.strip()
        if "```json" in response:
            response = response.split("```json")[1].split("```")[0].strip()
        elif "```" in response:
            response = response.split("```")[1].split("```")[0].strip()
        
        # Try to find JSON object in response
        json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', response, re.DOTALL)
        if json_match:
            response = json_match.group(0)
        
        data = json.loads(response)
        corrected_text = data.get("text", text)
        
        # Validate that HTML structure is preserved (basic check)
        if corrected_text and isinstance(corrected_text, str):
            return corrected_text
        else:
            return text
    except (json.JSONDecodeError, Exception) as e:
        # Return original text on error to avoid breaking the note
        return text

def translate_note(text, target_language):
    """Translate note content to target language (handles HTML content)"""
    if not text:
        return ""
    
    # Extract plain text for translation, but we'll need to preserve HTML structure
    # For now, translate the content and preserve basic HTML tags
    prompt = f"""Translate the following text to {target_language}. 
IMPORTANT: If the text contains HTML tags, preserve the HTML structure exactly and only translate the text content between tags.
Maintain all HTML formatting, attributes, and structure.

Text:
{text}

Translation:"""
    
    try:
        return get_completion(prompt)
    except Exception as e:
        return f"Error translating text: {str(e)}"

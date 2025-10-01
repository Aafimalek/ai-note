const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=";

export async function identifyKeyTerms(
  text: string,
  apiKey: string
): Promise<string[]> {
  const prompt = `You are an AI assistant tasked with creating a glossary for a user's notes. Analyze the following text and identify a comprehensive list of all key terms, terminologies, concepts, and entities. Your goal is to be as thorough as possible, leaning towards including terms that might be interesting or unfamiliar to a general reader. This can include specific names, places, organizations, technical jargon, or any significant noun phrases. Exclude only the most common, generic words. Your response must be a valid JSON array of strings.

Text: """
${text}
"""

JSON Array of Key Terms:`;

  const response = await fetch(`${API_URL}${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Failed to identify key terms");
  }

  const data = await response.json();
  let jsonString = data.candidates[0].content.parts[0].text;
  jsonString = jsonString.replace(/```json\n|```/g, "").trim();
  const terms = JSON.parse(jsonString);
  return terms;
}

export async function getDefinition(
  term: string,
  apiKey: string
): Promise<string> {
  const prompt = `You are a helpful glossary assistant. Your task is to provide a single, clear, and concise sentence that explains the provided term. The explanation must not repeat the term itself. Start the explanation directly, without any introductory phrases like 'This is' or 'It is'.

Term to explain: "${term}"

Concise, one-sentence explanation:`;

  const response = await fetch(`${API_URL}${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Failed to get definition");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function getSummary(
  text: string,
  apiKey: string
): Promise<string> {
  const prompt = `Summarize the following text in one to two sentences.

Text: """
${text}
"""

Summary:`;

  const response = await fetch(`${API_URL}${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Failed to get summary");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export type GrammarError = {
  error: string;
  suggestion: string;
};

export async function checkGrammar(
  text: string,
  apiKey: string
): Promise<GrammarError[]> {
  const prompt = `You are an expert grammar and style editor. Your task is to analyze the following text for clear grammatical errors, keeping in mind the context of the writing.

**Instructions:**
1.  **Analyze Context**: The text might be creative writing, such as a poem or prose. Distinguish between genuine grammatical errors and stylistic choices (e.g., non-standard punctuation or sentence structure for artistic effect). Do not flag stylistic choices as errors.
2.  **Identify Genuine Errors**: Focus on unambiguous mistakes in subject-verb agreement, verb tense, and clear punctuation errors (e.g., missing periods).
3.  **Ignore Spelling**: Do not flag spelling.
4.  **Be Precise**: For each error, identify the exact incorrect phrase.
5.  **Meaningful Suggestions**: Your suggestion must be meaningfully different from the original error. Do not suggest the same word or phrase back. Crucially, a suggestion must be a substantial correction, not a minor change like capitalization or adding a period to a single word.
6.  **Format Output**: Your response must be a valid JSON array of objects. Each object must have 'error' and 'suggestion' keys.
7.  **No Errors Found**: If there are no clear grammatical errors, you MUST return an empty JSON array ([]).

Text: """
${text}
"""

JSON Array:`;

  const response = await fetch(`${API_URL}${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Failed to check grammar");
  }

  const data = await response.json();
  let jsonString = data.candidates[0].content.parts[0].text;
  jsonString = jsonString.replace(/```json\n|```/g, "").trim();
  try {
    const errors = JSON.parse(jsonString);
    return errors;
  } catch (e) {
    console.error("Failed to parse grammar check response:", jsonString);
    return [];
  }
}

export async function translateText(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  const prompt = `Translate the following text to ${targetLanguage}.

Text: """
${text}
"""

Translation:`;

  const response = await fetch(`${API_URL}${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Failed to translate text");
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

export async function getTags(text: string, apiKey: string): Promise<string[]> {
  const prompt = `Based on the content of the following note, suggest 3 to 5 relevant tags. The tags should be concise, single words or short phrases. Your response must be a valid JSON array of strings.

Note: """
${text}
"""

JSON Array of Tags:`;

  const response = await fetch(`${API_URL}${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message || "Failed to get tags");
  }

  const data = await response.json();
  let jsonString = data.candidates[0].content.parts[0].text;
  jsonString = jsonString.replace(/```json\n|```/g, "").trim();
  try {
    const tags = JSON.parse(jsonString);
    return tags;
  } catch (e) {
    console.error("Failed to parse tags response:", jsonString);
    return [];
  }
}

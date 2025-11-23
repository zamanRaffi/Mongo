// node-fetch is likely needed if not on Node v18+
// import fetch from 'node-fetch';

const API_KEY = process.env.GEMINI_API_KEY;
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || 'gemini-pro';
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'embedding-001';

if (!API_KEY) {
  console.warn('GEMINI_API_KEY not set in environment. Gemini AI will not work.');
}

// MODIFIED: Now accepts headers and doesn't take the API key in the URL
async function requestWithRetries(url, headers, body, retries = 3, backoff = 500) {
  let lastErr;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers // Include custom headers (like API key)
        },
        body: JSON.stringify(body),
      });

      const txt = await res.text();
      if (!res.ok) {
        // Google sometimes returns detailed JSON errors even on failures
        let errorDetails = txt;
        try {
             const jsonErr = JSON.parse(txt);
             errorDetails = jsonErr.error?.message || txt;
        } catch(e) { /* ignore */ }

        const err = new Error(`Gemini API error ${res.status}: ${errorDetails}`);
        lastErr = err;
        // Retry on server errors (5xx) or rate limits (429)
        if (res.status >= 500 || res.status === 429) {
          console.log(`Retrying Gemini request due to ${res.status}. Attempt ${attempt + 1}`);
          await new Promise(r => setTimeout(r, backoff * Math.pow(2, attempt)));
          continue;
        }
        throw err;
      }

      try {
        return JSON.parse(txt);
      } catch (e) {
        throw new Error(`Invalid JSON response from Gemini API: ${txt.substring(0, 200)}...`);
      }

    } catch (err) {
      lastErr = err;
      // Also retry on network connection errors (like offline/DNS issues)
      console.log(`Retrying Gemini request due to network error. Attempt ${attempt + 1}`);
      await new Promise(r => setTimeout(r, backoff * Math.pow(2, attempt)));
    }
  }
  throw lastErr || new Error('Gemini request failed after retries');
}

function getCommonHeaders() {
    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');
    // SECURITY FIX: Pass key in header instead of URL
    return {
        'x-goog-api-key': API_KEY
    };
}

// Get embedding vector for text
export async function getEmbedding(text) {
  // UPDATE: Using v1beta endpoint for embeddings
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`;

  const body = {
    content: {
        parts: [{ text: text }]
    }
  };
  
  const data = await requestWithRetries(endpoint, getCommonHeaders(), body);

  // UPDATE: Correct response path for v1beta
  if (data?.embedding?.values) return data.embedding.values;
  throw new Error('Unexpected embedding response format from Gemini API');
}


/**
 * Chat response from Gemini
 * @param {Array<{role: 'user'|'model', parts: Array<{text: string}>}>} contents - Structured history
 * @param {string} model
 */


// Chat response from Gemini
// NOTE: The 'messages' argument here is likely coming in as [{role: 'user', content: 'hi'}, {role: 'system', ...}]
export async function chatResponse(messages, model = CHAT_MODEL) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  // === THE FIX FOR ROLES IS HERE ===

  // We format the incoming messages and validate the roles.
  const formattedContents = messages.map((msg, index) => {
    let role = msg.role ? msg.role.toLowerCase() : 'user';

    // --- ROLE MAPPING ---
    // Gemini ONLY accepts 'user' and 'model'.
    // 1. Map OpenAI's 'assistant' to Gemini's 'model'
    if (role === 'assistant') {
        role = 'model';
    }
    // 2. Map 'system' roles to 'user'.
    // (Gemini doesn't have a separate system role yet; treating it as user input usually works)
    else if (role === 'system') {
        role = 'user';
         // Optional: You might want to log this to know it's happening
         // console.log("Mapping system role to user role for Gemini compatibility.");
    }
    // 3. Final safety catch for any other weird roles
    else if (role !== 'user' && role !== 'model') {
        console.warn(`Warning: Unknown role '${msg.role}' found at index ${index}. Defaulting to 'user'.`);
        role = 'user';
    }

    // Handle content extraction (same as previous fix)
    let textContent = '';
    if (typeof msg.content === 'string') {
        textContent = msg.content;
    } else if (Array.isArray(msg.content) && msg.content[0]?.text) {
        textContent = msg.content[0].text;
    }

    // Return the structure Gemini requires: { role, parts: [{ text }] }
    return {
      role: role,
      parts: [{ text: textContent || " " }] // Ensure text isn't empty string, or API might complain
    };
  });

  // Filter out any messages that ended up empty after processing
  const legitimateContents = formattedContents.filter(c => c.parts[0].text.trim() !== '');

  // Ensure we have at least one message to send
  if (legitimateContents.length === 0) {
      throw new Error("No valid messages to send to Gemini after formatting.");
  }

  const body = {
      contents: legitimateContents,
      // Optional settings:
      // generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
  };

  // === FIX ENDS ===

  // Assuming requestWithRetries and getCommonHeaders are defined as before
  const data = await requestWithRetries(endpoint, getCommonHeaders(), body);

  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
  }

  if (data?.promptFeedback?.blockReason) {
      throw new Error(`Gemini blocked response: ${data.promptFeedback.blockReason}`);
  }

  console.error("Unexpected Gemini Response structure found:", JSON.stringify(data, null, 2));
  throw new Error('Unexpected chat response format from Gemini API');
}
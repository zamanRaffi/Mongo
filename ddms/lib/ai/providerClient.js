// Provider selector (Gemini-only): this project is configured to use Gemini
// for embeddings and chat. If `GEMINI_API_KEY` is not set, calls will throw
// with a clear error message.

import * as gemini from './geminiClient.js';

export const getEmbedding = gemini.getEmbedding;
export const chatResponse = gemini.chatResponse;

export default { getEmbedding, chatResponse };

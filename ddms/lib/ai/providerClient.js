import * as gemini from './geminiClient.js';

export const getEmbedding = gemini.getEmbedding;
export const chatResponse = gemini.chatResponse;

export default { getEmbedding, chatResponse };

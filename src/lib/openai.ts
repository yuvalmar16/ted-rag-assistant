import OpenAI from 'openai';

if (!process.env.LLMOD_API_KEY) {
  throw new Error('Missing LLMOD_API_KEY environment variable');
}


const baseURL = process.env.LLMOD_BASE_URL;

export const openai = new OpenAI({
  apiKey: process.env.LLMOD_API_KEY,
  baseURL: baseURL, 
});
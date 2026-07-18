import 'dotenv/config';

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(required('PORT', '5000')),
  clientOrigin: required('CLIENT_ORIGIN', 'http://localhost:5173'),
  mongoUri: process.env.MONGODB_URI || '',
  aiProvider: process.env.AI_PROVIDER || 'disabled',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gpt-5-mini',
});

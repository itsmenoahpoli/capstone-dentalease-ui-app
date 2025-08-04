export const OPENAI_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  BASE_URL:
    process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "https://api.openai.com/v1",
  TIMEOUT: 5000,
};

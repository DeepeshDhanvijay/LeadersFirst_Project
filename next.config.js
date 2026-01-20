/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    HUGGINGFACE_MODEL_URL: process.env.HUGGINGFACE_MODEL_URL,
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

module.exports = nextConfig

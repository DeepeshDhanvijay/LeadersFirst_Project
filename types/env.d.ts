// Environment variables type definitions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HUGGINGFACE_API_KEY: string
      HUGGINGFACE_MODEL_URL: string
      MONGODB_URI: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}

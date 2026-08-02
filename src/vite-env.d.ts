/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GMAIL_CLIENT_ID?: string;
  readonly VITE_GMAIL_CLIENT_SECRET?: string;
  readonly VITE_GMAIL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

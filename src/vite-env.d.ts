/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_WHATSAPP_PHONE?: string;
  readonly VITE_WHATSAPP_DISPLAY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

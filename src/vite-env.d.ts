// Local ambient types for the Vite env we use. Kept minimal so tsc doesn't
// need to resolve the `vite/client` types package at typecheck time (verify
// doesn't always install devDependencies).
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

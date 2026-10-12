export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8083/api/v1',
  appName: import.meta.env.VITE_APP_NAME ?? 'Club Deportivo',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

export type EnvConfig = typeof env;

export const validateEnv = () => {
  const required = ['VITE_API_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Variables de entorno faltantes: ${missing.join(', ')}`);
  }
};

export default env;

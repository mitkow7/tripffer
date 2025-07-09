export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  APP_NAME: 'Tripffer',
  DEFAULT_CURRENCY: 'USD',
  ITEMS_PER_PAGE: 12,
} as const;
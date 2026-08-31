export const brand = {
  brandName: 'BF360',
  consultantName: 'Mattia Cosimo Saracino',
  consultantEmail: process.env.CONSULTANT_EMAIL ?? 'mattia.saracino@example.com',
  consultantPhone: '[TELEFONO]',
  logoUrl: '[LOGO]',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  privacyUrl: 'https://example.com/privacy',
  dataRetentionDays: 365 * 2,
  colors: {
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    secondary: '#334155',
    accent: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    muted: '#f1f5f9',
  },
  assessment: {
    estimatedMinutes: 10,
    maxQuestionsPerScreen: 8,
    activeThresholdMs: 5 * 60 * 1000, // 5 minuti
    minActiveMs: 3 * 60 * 1000,
    maxActiveMsForFast: 5 * 60 * 1000,
    reliabilityUniformThreshold: 0.85,
  },
} as const;

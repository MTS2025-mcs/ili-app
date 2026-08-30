export const scoring = {
  areas: {
    HR: { name: 'Gestione delle risorse umane', weight: 0.25 },
    SE: { name: 'Gestione di sé e del tono emotivo', weight: 0.20 },
    FI: { name: 'Gestione finanziaria', weight: 0.20 },
    MK: { name: 'Marketing strategico e social', weight: 0.15 },
    TI: { name: 'Gestione del tempo', weight: 0.20 },
  },
  thresholds: {
    area: {
      critical: 50,
      consolidate: 65,
      functional: 80,
    },
    ili: [
      { max: 34.9, label: 'Azienda fortemente dipendente dal titolare' },
      { max: 49.9, label: 'Dipendenza elevata' },
      { max: 64.9, label: 'Libertà fragile' },
      { max: 79.9, label: 'Autonomia in costruzione' },
      { max: 100, label: 'Azienda progressivamente autonoma' },
    ],
    iar: [
      { max: 64.9, label: 'Attendibilità bassa' },
      { max: 79.9, label: 'Attendibilità media' },
      { max: 100, label: 'Attendibilità alta' },
    ],
  },
  iar: {
    maxCoherence: 50,
    maxAttention: 15,
    maxPlausibility: 15,
    maxProcess: 10,
    maxAccuracy: 10,
    maxTotal: 100,
  },
} as const;

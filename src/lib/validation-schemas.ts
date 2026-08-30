import { z } from 'zod';

export const demographicSchema = z.object({
  firstName: z.string().min(1, 'Nome obbligatorio'),
  lastName: z.string().min(1, 'Cognome obbligatorio'),
  companyName: z.string().min(1, 'Ragione sociale obbligatoria'),
  role: z.string().min(1, 'Ruolo obbligatorio'),
  sector: z.string().min(1, 'Settore obbligatorio'),
  city: z.string().min(1, 'Città obbligatoria'),
  province: z.string().min(1, 'Provincia obbligatoria'),
  email: z.string().email('Email non valida'),
  phone: z.string().min(6, 'Telefono obbligatorio'),
  yearsInBusiness: z.string().min(1, 'Anni di attività obbligatori'),
  employees: z.string().min(1, 'Numero collaboratori obbligatorio'),
  revenueBand: z.string().min(1, 'Fascia fatturato obbligatoria'),
  referringConsultant: z.string().optional(),
  privacyConsent: z.boolean().refine((v) => v === true, {
    message: 'Il consenso privacy è obbligatorio',
  }),
  marketingConsent: z.boolean().default(false),
});

export const answerSchema = z.record(z.string(), z.union([z.number().int().min(1).max(5), z.string().max(500)]));

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

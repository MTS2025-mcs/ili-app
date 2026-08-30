import { Resend } from 'resend';

export async function sendConsultantNotification(assessment: {
  id: string;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  ili: number | null;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY non impostata: email non inviata.');
    return;
  }

  const resend = new Resend(resendApiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
  const to = process.env.CONSULTANT_EMAIL ?? 'mattia.saracino@example.com';

  const { error } = await resend.emails.send({
    from: `ILI <${from}>`,
    to,
    subject: 'Nuovo assessment ILI completato',
    html: `
      <p>È stato completato un nuovo assessment.</p>
      <p><strong>Azienda:</strong> ${assessment.company_name}</p>
      <p><strong>Nome:</strong> ${assessment.first_name} ${assessment.last_name}</p>
      <p><strong>ILI:</strong> ${assessment.ili}</p>
      <p><a href="${siteUrl}/admin/assessments/${assessment.id}">Apri scheda</a></p>
    `,
  });

  if (error) {
    console.error('Errore invio email Resend:', error);
  }
}

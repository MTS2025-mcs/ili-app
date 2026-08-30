import { Resend } from 'resend';

export async function sendConsultantNotification(assessment: {
  id: string;
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  ili: number | null;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  await resend.emails.send({
    from: 'ILI <no-reply@example.com>',
    to: process.env.CONSULTANT_EMAIL ?? 'mattia.saracino@example.com',
    subject: 'Nuovo assessment ILI completato',
    html: `
      <p>È stato completato un nuovo assessment.</p>
      <p><strong>Azienda:</strong> ${assessment.company_name}</p>
      <p><strong>Nome:</strong> ${assessment.first_name} ${assessment.last_name}</p>
      <p><strong>ILI:</strong> ${assessment.ili}</p>
      <p><a href="${siteUrl}/admin/assessments/${assessment.id}">Apri scheda</a></p>
    `,
  });
}

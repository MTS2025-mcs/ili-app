# Indice di Libertà Imprenditoriale (ILI)

Web app professionale, mobile-first e in italiano, per la raccolta dell'assessment ILI, il calcolo automatico di punteggi e indice di attendibilità, e la restituzione tramite dashboard e PDF riservati al consulente.

## Stack

- Next.js 15+ con App Router
- TypeScript strict
- Tailwind CSS
- Supabase (PostgreSQL, Auth, RLS)
- React Hook Form + Zod
- Recharts per grafici
- Resend per email
- Vitest per test

## Requisiti

- Node.js 22+ consigliato
- Account Supabase
- Account Resend

## Setup locale

1. Clona o naviga nella cartella `ili-app`.
2. Copia `.env.example` in `.env.local` e compila le variabili:

```bash
cp .env.example .env.local
```

3. Installa le dipendenze:

```bash
npm install
```

4. Crea un progetto Supabase e carica le migrazioni in `supabase/migrations/`.
5. Crea un utente admin in Supabase Auth e inseriscilo in `profiles`.
6. Avvia in locale:

```bash
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build
```

## Eseguire tutte le verifiche

```bash
npm run all
```

Questo comando esegue in sequenza lint, test e build.

## Deploy su Vercel

1. Connetti la repo a Vercel.
2. Imposta le variabili d'ambiente dal pannello Vercel.
3. Esegui il deploy con `git push`.

## Note legali

La configurazione definita di informativa privacy, durata di conservazione e basi giuridiche deve essere validata da un professionista privacy prima della pubblicazione.

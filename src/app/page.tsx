import Link from 'next/link';
import { brand } from '@/config/brand';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">
          {brand.brandName}
        </h1>
        <p className="text-lg text-slate-600">
          In circa {brand.assessment.estimatedMinutes} minuti scoprirai quali aree stanno rendendo l&apos;azienda autonoma e quali dipendono ancora troppo dalla tua presenza. Il risultato sarà analizzato personalmente dal consulente e condiviso con te durante un incontro dedicato.
        </p>
        <ul className="space-y-2 text-left text-slate-700">
          <li>• Durata stimata: 8-12 minuti</li>
          <li>• Cinque aree analizzate</li>
          <li>• Non esistono risposte giuste o sbagliate</li>
          <li>• Rispondi pensando agli ultimi 90 giorni</li>
        </ul>
        <Link
          href="/assessment"
          className="inline-block rounded-full bg-slate-900 px-8 py-4 text-lg font-medium text-white hover:bg-slate-800"
        >
          Inizia l&apos;analisi
        </Link>
      </div>
    </main>
  );
}

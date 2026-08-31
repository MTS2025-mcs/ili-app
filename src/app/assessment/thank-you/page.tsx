import { brand } from '@/config/brand';

export default function ThankYou() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-bold">Grazie per aver completato l&apos;analisi</h1>
        <p className="text-slate-700">
          Il tuo risultato verrà analizzato personalmente da {brand.consultantName} e condiviso con te durante un incontro dedicato.
        </p>
        <img
          src={brand.logoUrl}
          alt={brand.brandName}
          className="mx-auto h-24 w-auto"
        />
      </div>
    </main>
  );
}

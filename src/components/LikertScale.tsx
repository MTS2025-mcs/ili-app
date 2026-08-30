const labels = [
  'Mai / per nulla vero',
  'Raramente',
  'A volte',
  'Spesso',
  'Sempre / del tutto vero',
];

export function LikertScale({
  question,
  selected,
  onSelect,
}: {
  question: string;
  selected: number;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="font-medium text-slate-800">{question}</p>
      <div className="grid gap-2 sm:grid-cols-5">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onSelect(v)}
            className={`rounded-lg border px-3 py-4 text-sm font-medium transition ${
              selected === v
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
            }`}
          >
            <span className="block text-base font-bold">{v}</span>
            <span className="block text-xs mt-1 leading-tight">{labels[v - 1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

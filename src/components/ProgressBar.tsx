export function ProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-slate-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

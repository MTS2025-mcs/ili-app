import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { AreaCode } from '@/types/scoring';

const areaNames: Record<AreaCode, string> = {
  HR: 'Risorse umane',
  SE: 'Lucidità sotto pressione',
  FI: 'Finanza',
  MK: 'Marketing',
  TI: 'Tempo',
};

export function ILIRadar({ areaScores }: { areaScores: Record<AreaCode, number> }) {
  const data = (Object.keys(areaScores) as AreaCode[]).map((code) => ({
    area: areaNames[code],
    score: areaScores[code],
    fullMark: 100,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="area" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar dataKey="score" stroke="#0f172a" fill="#0f172a" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ILIBarChart({ areaScores }: { areaScores: Record<AreaCode, number> }) {
  const data = (Object.keys(areaScores) as AreaCode[])
    .map((code) => ({ area: areaNames[code], score: areaScores[code] }))
    .sort((a, b) => a.score - b.score);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="area" width={150} />
          <Tooltip />
          <Bar dataKey="score" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

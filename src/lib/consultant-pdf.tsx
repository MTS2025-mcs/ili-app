import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { scoring } from '@/config/scoring';
import { classifyArea } from '@/lib/scoring-engine';
import type { AreaCode } from '@/types/scoring';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 20, marginBottom: 14, fontFamily: 'Helvetica-Bold' },
  section: { fontSize: 14, marginTop: 16, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  score: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '50%', marginBottom: 6, paddingRight: 8 },
  label: { fontSize: 8, color: '#64748b', marginBottom: 1 },
  value: { fontSize: 10, color: '#0f172a' },
  note: { fontSize: 9, color: '#64748b', marginTop: 4 },
  bottleneckNote: { fontSize: 8, color: '#64748b', marginTop: 3 },
  chartRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  chartLabel: { width: 120, fontSize: 8, paddingRight: 4 },
  chartTrack: { flex: 1, height: 12, backgroundColor: '#e2e8f0', borderRadius: 3 },
  chartValue: { width: 30, fontSize: 9, textAlign: 'right', marginLeft: 4 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  subLabel: { fontSize: 8, color: '#334155' },
  subValue: { fontSize: 8, color: '#0f172a' },
});

const areaColors: Record<ReturnType<typeof classifyArea>, string> = {
  critical: '#ef4444',
  consolidate: '#f59e0b',
  functional: '#3b82f6',
  strength: '#22c55e',
};

interface AssessmentRow {
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  sector: string | null;
  city: string | null;
  province: string | null;
  years_in_business: string | null;
  employees: string | null;
  revenue_band: string | null;
  referring_consultant: string | null;
  privacy_consent: boolean | null;
  marketing_consent: boolean | null;
  active_ms: number | null;
  completed_at: string | null;
  ili: number | string | null;
  dependency_index: number | string | null;
  iar: number | string | null;
  bottleneck: string | null;
}

interface ConsultantPDFProps {
  assessment: AssessmentRow;
  areaScores: Record<AreaCode, number>;
  subdimensionScores: { area: string; subdimension: string; score: number }[];
}

export function createConsultantPDFDocument({
  assessment,
  areaScores,
  subdimensionScores,
}: ConsultantPDFProps) {
  const durationMin = Math.round((assessment.active_ms ?? 0) / 1000 / 60);
  const groupedSubs = subdimensionScores.reduce<Record<string, { subdimension: string; score: number }[]>>((acc, s) => {
    if (!acc[s.area]) acc[s.area] = [];
    acc[s.area].push(s);
    return acc;
  }, {});

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Scheda consulente — {assessment.company_name}</Text>

        <Text style={styles.section}>Dati anagrafici</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Nome e cognome</Text>
            <Text style={styles.value}>{assessment.first_name} {assessment.last_name}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{assessment.email}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Telefono</Text>
            <Text style={styles.value}>{assessment.phone}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Ruolo</Text>
            <Text style={styles.value}>{assessment.role}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Settore</Text>
            <Text style={styles.value}>{assessment.sector}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Località</Text>
            <Text style={styles.value}>{assessment.city} ({assessment.province})</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Anni di attività</Text>
            <Text style={styles.value}>{assessment.years_in_business}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Collaboratori</Text>
            <Text style={styles.value}>{assessment.employees}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Fascia fatturato</Text>
            <Text style={styles.value}>{assessment.revenue_band}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Consulente di riferimento</Text>
            <Text style={styles.value}>{assessment.referring_consultant || '—'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Consenso privacy</Text>
            <Text style={styles.value}>{assessment.privacy_consent ? 'Sì' : 'No'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Consenso marketing</Text>
            <Text style={styles.value}>{assessment.marketing_consent ? 'Sì' : 'No'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Durata compilazione</Text>
            <Text style={styles.value}>{durationMin} min</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Completato il</Text>
            <Text style={styles.value}>
              {assessment.completed_at ? new Date(assessment.completed_at).toLocaleString('it-IT') : '—'}
            </Text>
          </View>
        </View>

        <Text style={styles.section}>Punteggi principali</Text>
        <View style={styles.row}>
          <Text>Indice di Libertà</Text>
          <Text style={styles.score}>{Number(assessment.ili).toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Indice di Dipendenza</Text>
          <Text style={styles.score}>{Number(assessment.dependency_index).toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Indice di Attendibilità Risposte</Text>
          <Text style={styles.score}>{Number(assessment.iar).toFixed(1)}</Text>
        </View>

        <Text style={styles.section}>Collo di bottiglia</Text>
        <View style={styles.row}>
          <Text style={styles.value}>
            {assessment.bottleneck
              ? `${scoring.areas[assessment.bottleneck as AreaCode].name} — ${Number(areaScores[assessment.bottleneck as AreaCode]).toFixed(1)}/100`
              : '—'}
          </Text>
        </View>
        {assessment.bottleneck && (
          <Text style={styles.bottleneckNote}>
            Questa &egrave; l&apos;area con il punteggio pi&ugrave; basso e potrebbe essere quella che oggi limita maggiormente la libert&agrave; dell&apos;imprenditore.
          </Text>
        )}

        <Text style={styles.section}>Profilo delle aree</Text>
        {Object.entries(areaScores)
          .sort(([, a], [, b]) => b - a)
          .map(([area, score]) => {
            const level = classifyArea(score);
            return (
              <View key={area} style={styles.chartRow}>
                <Text style={styles.chartLabel}>{scoring.areas[area as AreaCode].name}</Text>
                <View style={styles.chartTrack}>
                  <View
                    style={{
                      width: `${score}%`,
                      height: 12,
                      backgroundColor: areaColors[level],
                      borderRadius: 3,
                    }}
                  />
                </View>
                <Text style={styles.chartValue}>{score.toFixed(1)}</Text>
              </View>
            );
          })}

        <Text style={styles.section}>Sottodimensioni</Text>
        {Object.entries(groupedSubs)
          .sort(([a], [b]) => (areaScores[b as AreaCode] ?? 0) - (areaScores[a as AreaCode] ?? 0))
          .map(([area, subs]) => (
            <View key={area} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 3 }}>
                {scoring.areas[area as AreaCode].name}
              </Text>
              {subs.map((s) => (
                <View key={s.subdimension} style={styles.subRow}>
                  <Text style={styles.subLabel}>{s.subdimension}</Text>
                  <Text style={styles.subValue}>{Number(s.score).toFixed(1)}</Text>
                </View>
              ))}
            </View>
          ))}

        <Text style={styles.note}>
          Scheda riservata al consulente. I dati servono a preparare il colloquio e non sostituiscono la diagnosi diretta.
        </Text>
      </Page>
    </Document>
  );
}

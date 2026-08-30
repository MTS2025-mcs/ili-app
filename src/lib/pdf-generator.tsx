import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { scoring } from '@/config/scoring';
import { classifyArea } from '@/lib/scoring-engine';
import type { AreaCode } from '@/types/scoring';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20, fontFamily: 'Helvetica-Bold' },
  heading: { fontSize: 16, marginTop: 20, marginBottom: 10, fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  score: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  note: { fontSize: 10, color: '#64748b', marginTop: 20 },
  bottleneckNote: { fontSize: 11, color: '#64748b', marginTop: 6 },
  chartRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  chartLabel: { width: 130, fontSize: 9, paddingRight: 6 },
  chartTrack: { flex: 1, height: 16, backgroundColor: '#e2e8f0', borderRadius: 4 },
  chartValue: { width: 34, fontSize: 10, textAlign: 'right', marginLeft: 6 },
});

const areaColors: Record<ReturnType<typeof classifyArea>, string> = {
  critical: '#ef4444',
  consolidate: '#f59e0b',
  functional: '#3b82f6',
  strength: '#22c55e',
};

export function createILIPDFDocument({
  firstName,
  lastName,
  company,
  ili,
  iar,
  dependency,
  bottleneck,
  areaScores,
}: {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  ili: number | null;
  iar: number | null;
  dependency: number | null;
  bottleneck: AreaCode | null;
  areaScores: Record<AreaCode, number>;
}) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Report Indice di Libertà Imprenditoriale</Text>
        <View>
          <Text>{firstName} {lastName}</Text>
          <Text>{company}</Text>
        </View>
        <View style={styles.row}>
          <Text>Indice di Libertà</Text>
          <Text style={styles.score}>{ili?.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Indice di Dipendenza</Text>
          <Text style={styles.score}>{dependency?.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Indice di Attendibilità Risposte</Text>
          <Text style={styles.score}>{iar?.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Collo di bottiglia</Text>
          <Text style={styles.score}>
            {bottleneck ? `${scoring.areas[bottleneck].name} — ${areaScores[bottleneck].toFixed(1)}/100` : '—'}
          </Text>
        </View>
        {bottleneck && (
          <Text style={styles.bottleneckNote}>
            Questa &egrave; l&apos;area con il punteggio pi&ugrave; basso e potrebbe essere quella che oggi limita maggiormente la libert&agrave; dell&apos;imprenditore.
          </Text>
        )}
        <Text style={styles.heading}>Profilo delle aree</Text>
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
                      height: 16,
                      backgroundColor: areaColors[level],
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text style={styles.chartValue}>{score.toFixed(1)}</Text>
              </View>
            );
          })}
        <Text style={styles.heading}>Nota metodologica</Text>
        <Text style={styles.note}>
          Questa analisi è un&apos;autovalutazione direzionale e non una diagnosi clinica, finanziaria o psicologica. I risultati vanno verificati durante il colloquio e attraverso dati aziendali.
        </Text>
      </Page>
    </Document>
  );
}

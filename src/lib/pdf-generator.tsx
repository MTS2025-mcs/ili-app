import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { AreaCode } from '@/types/scoring';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 20, fontFamily: 'Helvetica-Bold' },
  heading: { fontSize: 16, marginTop: 20, marginBottom: 10, fontFamily: 'Helvetica-Bold' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  score: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  note: { fontSize: 10, color: '#64748b', marginTop: 20 },
});

export function createILIPDFDocument({
  firstName,
  lastName,
  company,
  ili,
  iar,
  dependency,
  bottleneck,
}: {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  ili: number | null;
  iar: number | null;
  dependency: number | null;
  bottleneck: AreaCode | null;
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
          <Text style={styles.score}>{bottleneck}</Text>
        </View>
        <Text style={styles.heading}>Nota metodologica</Text>
        <Text style={styles.note}>
          Questa analisi è un&apos;autovalutazione direzionale e non una diagnosi clinica, finanziaria o psicologica. I risultati vanno verificati durante il colloquio e attraverso dati aziendali.
        </Text>
      </Page>
    </Document>
  );
}

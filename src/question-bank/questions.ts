import type { DiagnosticQuestion, ContextQuestion, ReliabilityQuestion } from '@/types/scoring';

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // Gestione risorse umane - HR
  { id: 'HR01', text: 'Ogni collaboratore conosce con chiarezza il proprio ruolo, le responsabilità e il risultato atteso.', area: 'HR', subdimension: 'Ruoli e standard', direction: 'positive', type: 'diagnostic' },
  { id: 'HR02', text: 'Il team prende le normali decisioni operative senza dover chiedere continuamente il mio intervento.', area: 'HR', subdimension: 'Delega', direction: 'positive', type: 'diagnostic' },
  { id: 'HR03', text: 'Valutiamo il lavoro delle persone attraverso dati, obiettivi o indicatori osservabili.', area: 'HR', subdimension: 'Ruoli e standard', direction: 'positive', type: 'diagnostic' },
  { id: 'HR04', text: 'Formazione, affiancamento e feedback avvengono con regolarità, non solo quando nasce un problema.', area: 'HR', subdimension: 'Sviluppo', direction: 'positive', type: 'diagnostic' },
  { id: 'HR05', text: 'Gli stessi problemi delle persone tornano più volte e finiscono quasi sempre sulla mia scrivania.', area: 'HR', subdimension: 'Continuità', direction: 'reverse', type: 'diagnostic' },
  { id: 'HR06', text: 'Ferie, assenze o imprevisti di un collaboratore non bloccano il normale funzionamento dell\'azienda.', area: 'HR', subdimension: 'Continuità', direction: 'positive', type: 'diagnostic' },
  { id: 'HR07', text: 'Dedico ancora molto tempo ad attività che potrebbero essere svolte da altri con una procedura chiara.', area: 'HR', subdimension: 'Delega', direction: 'reverse', type: 'diagnostic' },
  { id: 'HR08', text: 'L\'azienda può lavorare per sette giorni senza un mio intervento operativo diretto.', area: 'HR', subdimension: 'Continuità', direction: 'positive', type: 'diagnostic' },

  // Gestione di sé e tono emotivo - SE
  { id: 'SE01', text: 'Di fronte a un imprevisto riesco a rimanere lucido prima di decidere.', area: 'SE', subdimension: 'Lucidità', direction: 'positive', type: 'diagnostic' },
  { id: 'SE02', text: 'Anche sotto pressione distinguo i fatti dalle interpretazioni e dalle paure.', area: 'SE', subdimension: 'Lucidità', direction: 'positive', type: 'diagnostic' },
  { id: 'SE03', text: 'Quando sono stressato comunico comunque in modo chiaro e rispettoso con il team.', area: 'SE', subdimension: 'Comunicazione', direction: 'positive', type: 'diagnostic' },
  { id: 'SE04', text: 'Dopo una giornata difficile recupero energia senza trascinare lo stress per molti giorni.', area: 'SE', subdimension: 'Recupero', direction: 'positive', type: 'diagnostic' },
  { id: 'SE05', text: 'La mia tensione si riversa sul clima del team o sulla vita personale.', area: 'SE', subdimension: 'Comunicazione', direction: 'reverse', type: 'diagnostic' },
  { id: 'SE06', text: 'Quando temo che qualcosa vada male, riprendo in mano attività che avevo delegato.', area: 'SE', subdimension: 'Fiducia e controllo', direction: 'reverse', type: 'diagnostic' },
  { id: 'SE07', text: 'Riesco a dire no o a rimandare richieste che non sono davvero prioritarie.', area: 'SE', subdimension: 'Fiducia e controllo', direction: 'positive', type: 'diagnostic' },
  { id: 'SE08', text: 'Anche quando non sto lavorando, la mia mente rimane quasi sempre occupata dai problemi aziendali.', area: 'SE', subdimension: 'Recupero', direction: 'reverse', type: 'diagnostic' },

  // Gestione finanziaria - FI
  { id: 'FI01', text: 'Conosco con regolarità la liquidità disponibile e gli impegni finanziari delle prossime settimane.', area: 'FI', subdimension: 'Controllo', direction: 'positive', type: 'diagnostic' },
  { id: 'FI02', text: 'Conosco il margine reale dei principali prodotti, servizi o commesse.', area: 'FI', subdimension: 'Redditività', direction: 'positive', type: 'diagnostic' },
  { id: 'FI03', text: 'Utilizzo un budget o una previsione finanziaria aggiornata almeno sui prossimi 90 giorni.', area: 'FI', subdimension: 'Pianificazione', direction: 'positive', type: 'diagnostic' },
  { id: 'FI04', text: 'Accantono in modo programmato imposte, contributi e riserve per gli imprevisti.', area: 'FI', subdimension: 'Pianificazione', direction: 'positive', type: 'diagnostic' },
  { id: 'FI05', text: 'Incassi, scadenze, crediti e pagamenti sono monitorati con un sistema preciso.', area: 'FI', subdimension: 'Controllo', direction: 'positive', type: 'diagnostic' },
  { id: 'FI06', text: 'Le finanze personali e quelle aziendali sono separate e leggibili.', area: 'FI', subdimension: 'Sistema', direction: 'positive', type: 'diagnostic' },
  { id: 'FI07', text: 'Le decisioni economiche importanti partono dai numeri e non soltanto dalla sensazione del momento.', area: 'FI', subdimension: 'Redditività', direction: 'positive', type: 'diagnostic' },
  { id: 'FI08', text: 'Pagamenti, incassi e controllo amministrativo possono proseguire anche se io sono assente.', area: 'FI', subdimension: 'Sistema', direction: 'positive', type: 'diagnostic' },

  // Marketing - MK
  { id: 'MK01', text: 'Abbiamo definito con precisione il cliente ideale e i suoi bisogni prioritari.', area: 'MK', subdimension: 'Strategia', direction: 'positive', type: 'diagnostic' },
  { id: 'MK02', text: 'Il mercato può capire con chiarezza perché scegliere noi invece di un concorrente.', area: 'MK', subdimension: 'Strategia', direction: 'positive', type: 'diagnostic' },
  { id: 'MK03', text: 'Esiste un piano marketing operativo per almeno i prossimi 90 giorni.', area: 'MK', subdimension: 'Strategia', direction: 'positive', type: 'diagnostic' },
  { id: 'MK04', text: 'Sappiamo quali canali generano contatti, appuntamenti e vendite.', area: 'MK', subdimension: 'Misurazione', direction: 'positive', type: 'diagnostic' },
  { id: 'MK05', text: 'L\'acquisizione di nuovi clienti non dipende esclusivamente dalla mia presenza personale o dalle mie relazioni.', area: 'MK', subdimension: 'Indipendenza dal titolare', direction: 'positive', type: 'diagnostic' },
  { id: 'MK06', text: 'I social vengono gestiti con continuità attraverso un piano e responsabilità definite.', area: 'MK', subdimension: 'Indipendenza dal titolare', direction: 'positive', type: 'diagnostic' },
  { id: 'MK07', text: 'Misuriamo almeno contatti generati, conversioni e costo di acquisizione.', area: 'MK', subdimension: 'Misurazione', direction: 'positive', type: 'diagnostic' },
  { id: 'MK08', text: 'Utilizziamo esperienze, community, referral o fidelizzazione per far tornare e parlare i clienti.', area: 'MK', subdimension: 'Esperienza e community', direction: 'positive', type: 'diagnostic' },

  // Tempo - TI
  { id: 'TI01', text: 'La mia agenda contiene tempo protetto per attività strategiche, non solo urgenze operative.', area: 'TI', subdimension: 'Agenda', direction: 'positive', type: 'diagnostic' },
  { id: 'TI02', text: 'Riesco ad avere almeno un giorno intero libero alla settimana senza dover intervenire.', area: 'TI', subdimension: 'Confini', direction: 'positive', type: 'diagnostic' },
  { id: 'TI03', text: 'Durante ferie o giorni liberi posso disconnettermi senza controllare continuamente l\'azienda.', area: 'TI', subdimension: 'Assenza', direction: 'positive', type: 'diagnostic' },
  { id: 'TI04', text: 'Chiamate e messaggi aziendali invadono frequentemente serate, weekend o momenti personali.', area: 'TI', subdimension: 'Confini', direction: 'reverse', type: 'diagnostic' },
  { id: 'TI05', text: 'Nella maggior parte delle settimane termino il lavoro entro l\'orario che avevo pianificato.', area: 'TI', subdimension: 'Agenda', direction: 'positive', type: 'diagnostic' },
  { id: 'TI06', text: 'Dedico con continuità tempo ed energia a salute, famiglia, relazioni o interessi personali.', area: 'TI', subdimension: 'Confini', direction: 'positive', type: 'diagnostic' },
  { id: 'TI07', text: 'Ogni settimana devo intervenire personalmente su emergenze che altri non riescono a gestire.', area: 'TI', subdimension: 'Emergenze', direction: 'reverse', type: 'diagnostic' },
  { id: 'TI08', text: 'Se necessario, posso restare lontano dall\'azienda per sette giorni senza comprometterne i risultati essenziali.', area: 'TI', subdimension: 'Assenza', direction: 'positive', type: 'diagnostic' },
];

export const contextQuestions: ContextQuestion[] = [
  {
    id: 'CTX01',
    text: 'Quante ore lavori mediamente ogni settimana per l\'azienda?',
    type: 'context',
    options: [
      { value: 1, label: 'Fino a 30' },
      { value: 2, label: '31-40' },
      { value: 3, label: '41-50' },
      { value: 4, label: '51-60' },
      { value: 5, label: 'Oltre 60' },
    ],
  },
  {
    id: 'CTX02',
    text: 'Quanti giorni interi completamente liberi hai avuto nell\'ultimo mese?',
    type: 'context',
    options: [
      { value: 1, label: '0' },
      { value: 2, label: '1-2' },
      { value: 3, label: '3-4' },
      { value: 4, label: '5-7' },
      { value: 5, label: 'Oltre 7' },
    ],
  },
  {
    id: 'CTX03',
    text: 'Qual è stato il periodo più lungo in cui sei stato assente dall\'azienda negli ultimi 12 mesi?',
    type: 'context',
    options: [
      { value: 1, label: 'Nessun giorno' },
      { value: 2, label: '1-3 giorni' },
      { value: 3, label: '4-7' },
      { value: 4, label: '8-14' },
      { value: 5, label: 'Oltre 14' },
    ],
  },
  {
    id: 'CTX04',
    text: 'Quando sei fuori dall\'orario di lavoro, con quale frequenza ricevi richieste aziendali che richiedono una tua decisione?',
    type: 'context',
    options: [
      { value: 1, label: 'Mai' },
      { value: 2, label: '1-2 al mese' },
      { value: 3, label: '1-2 a settimana' },
      { value: 4, label: '3-5 a settimana' },
      { value: 5, label: 'Ogni giorno' },
    ],
  },
  {
    id: 'CTX05',
    text: 'Se domani fossi irraggiungibile per sette giorni, cosa si fermerebbe per primo?',
    type: 'context',
    options: [],
    allowText: true,
    maxLength: 500,
  },
  {
    id: 'CTX06',
    text: 'Qual è oggi la tua principale fonte di stress in azienda?',
    type: 'context',
    options: [],
    allowText: true,
    maxLength: 500,
  },
];

export const reliabilityQuestions: ReliabilityQuestion[] = [
  // Coppie di coerenza
  { id: 'VA01', text: 'Se sono irraggiungibile, molte normali decisioni operative restano in attesa del mio ritorno.', compareWith: 'HR02', direction: 'reverse', category: 'coherence', type: 'reliability' },
  { id: 'VA02', text: 'Quando la pressione aumenta, mi capita di reagire prima di avere verificato i fatti.', compareWith: 'SE01', direction: 'reverse', category: 'coherence', type: 'reliability' },
  { id: 'VA03', text: 'Per sapere con precisione cosa potrò pagare nei prossimi 30 giorni devo ricostruire i dati ogni volta.', compareWith: 'FI01', direction: 'reverse', category: 'coherence', type: 'reliability' },
  { id: 'VA04', text: 'Se smetto di apparire o di attivarmi personalmente, l\'arrivo di nuovi clienti rallenta nettamente.', compareWith: 'MK05', direction: 'reverse', category: 'coherence', type: 'reliability' },
  { id: 'VA05', text: 'Anche nei giorni di assenza ho bisogno di sentire quotidianamente l\'azienda.', compareWith: 'TI03', direction: 'reverse', category: 'coherence', type: 'reliability' },

  // Plausibilità
  { id: 'VA06', text: 'Negli ultimi 12 mesi non ho mai preso una decisione aziendale sbagliata.', direction: 'positive', category: 'plausibility', type: 'reliability' },
  { id: 'VA07', text: 'Tutti i miei collaboratori comprendono sempre le mie indicazioni al primo tentativo.', direction: 'positive', category: 'plausibility', type: 'reliability' },

  // Controllo attenzione
  { id: 'VA08', text: 'Per confermare che stai leggendo con attenzione, seleziona la risposta 2 - Raramente.', direction: 'positive', category: 'attention', type: 'reliability' },

  // Accuratezza dichiarata
  { id: 'VA09', text: 'Ho risposto pensando a ciò che è accaduto davvero negli ultimi 90 giorni, non a come vorrei che fosse.', direction: 'positive', category: 'accuracy', type: 'reliability' },
  {
    id: 'VA10',
    text: 'Per quante domande hai dovuto rispondere soprattutto a sensazione perché non disponevi di dati o esempi concreti?',
    direction: 'positive',
    category: 'accuracy',
    type: 'reliability',
    options: [
      { value: 1, label: '0-2' },
      { value: 2, label: '3-5' },
      { value: 3, label: '6-10' },
      { value: 4, label: 'Oltre 10' },
    ],
  },
];

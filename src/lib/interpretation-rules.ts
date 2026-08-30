import type { AreaCode } from '@/types/scoring';

export interface InterpretationRule {
  items: string[];
  message: string;
  verification: string;
  evidence: string;
}

export const interpretationRules: Record<AreaCode, InterpretationRule[]> = {
  HR: [
    {
      items: ['HR02', 'HR07'],
      message: 'La delega appare incompleta: molte decisioni e attività tornano ancora al titolare.',
      verification: 'Quali sono le tre richieste che ricevi più spesso dal team?',
      evidence: 'Elenco interruzioni di una settimana.',
    },
    {
      items: ['HR01', 'HR03'],
      message: 'Ruoli e risultati attesi non sembrano abbastanza visibili o misurati.',
      verification: 'Chi nel team sa esattamente come viene valutato il proprio lavoro?',
      evidence: 'Organigramma, mansionari e indicatori.',
    },
    {
      items: ['HR04', 'HR06', 'HR08'],
      message: 'Continuità e sviluppo del team appaiono fragili.',
      verification: 'Quanto spesso formi e lasci lavorare autonomamente il team?',
      evidence: 'Piano formazione e registri ferie.',
    },
  ],
  SE: [
    {
      items: ['SE01', 'SE02'],
      message: 'Sotto pressione la qualità della decisione rischia di dipendere dal tono del momento.',
      verification: 'Ricostruire un imprevisto recente distinguendo fatti e reazioni.',
      evidence: 'Diario decisionale di una settimana.',
    },
    {
      items: ['SE03', 'SE05'],
      message: 'La tensione può influenzare il clima del team.',
      verification: 'Come si percepisce il clima durante le giornate più difficili?',
      evidence: 'Feedback anonimi recenti.',
    },
    {
      items: ['SE04', 'SE08'],
      message: 'Il recupero energetico appare limitato, con mente ancora sull\'azienda.',
      verification: 'Quanti giorni all\'anno si disconnette davvero?',
      evidence: 'Calendario ferie e weekend senza dispositivi.',
    },
    {
      items: ['SE06', 'SE07'],
      message: 'Fiducia e controllo nelle deleghe sono in equilibrio instabile.',
      verification: 'Quando si è ripreso in mano un compito delegato?',
      evidence: 'Elenco task ripresi nell\'ultimo mese.',
    },
  ],
  FI: [
    {
      items: ['FI01', 'FI03'],
      message: 'La finanza sembra letta soprattutto sul presente, con poca visibilità prospettica.',
      verification: 'Quanto tempo serve per sapere cosa si può pagare nei prossimi 30 giorni?',
      evidence: 'Scadenzario e previsione di cassa a 13 settimane.',
    },
    {
      items: ['FI02', 'FI07'],
      message: 'Le decisioni commerciali possono non riflettere la redditività reale.',
      verification: 'Qual è il margine per prodotto, servizio o commessa?',
      evidence: 'Foglio margini per voce.',
    },
    {
      items: ['FI04', 'FI06', 'FI08'],
      message: 'Il sistema finanziario non è ancora indipendente dalla presenza del titolare.',
      verification: 'Chi potrebbe pagare le fatture e incassare in assenza del titolare?',
      evidence: 'Procedure e deleghe amministrative.',
    },
  ],
  MK: [
    {
      items: ['MK01', 'MK02', 'MK03'],
      message: 'Il marketing appare più esecutivo che strategico.',
      verification: 'Chi è il cliente ideale e perché sceglie noi?',
      evidence: 'Cliente ideale, posizionamento e piano 90 giorni.',
    },
    {
      items: ['MK05', 'MK06'],
      message: 'La generazione di attenzione e clienti dipende ancora troppo dal volto o dall\'azione del titolare.',
      verification: 'Quanti lead arrivano senza la presenza del titolare?',
      evidence: 'Calendario, responsabilità e lead per fonte.',
    },
    {
      items: ['MK04', 'MK07', 'MK08'],
      message: 'La misurazione e la fidelizzazione non sono ancora strutturate.',
      verification: 'Quali numeri decide il budget marketing?',
      evidence: 'Dashboard metriche.',
    },
  ],
  TI: [
    {
      items: ['TI02', 'TI03', 'TI08'],
      message: 'Il tempo libero non è ancora protetto da un sistema aziendale capace di reggere l\'assenza.',
      verification: 'Quanti giorni realmente disconnessi si sono avuti negli ultimi 3 mesi?',
      evidence: 'Giorni realmente disconnessi e richieste ricevute.',
    },
    {
      items: ['TI04', 'TI07'],
      message: 'Le urgenze invadono con frequenza lo spazio personale.',
      verification: 'Quante interruzioni personali arrivano fuori orario?',
      evidence: 'Registro di chiamate e interruzioni per sette giorni.',
    },
    {
      items: ['TI01', 'TI05'],
      message: 'L\'agenda è ancora dominata dalle urgenze operative.',
      verification: 'Quanto tempo strategico è bloccato in agenda?',
      evidence: 'Agenda delle ultime due settimane.',
    },
  ],
};

import type { Strings } from './en';

export const it: Strings = {
  tabs: {
    today: 'Oggi',
    history: 'Cronologia',
    settings: 'Impostazioni',
  },

  home: {
    remindersOff: 'Promemoria disattivati',
    doneForToday: 'Fatto per oggi — niente più promemoria',
    nextReminder: (time: string) => `Prossimo promemoria verso le ${time}`,
    noneTonight: 'Niente più promemoria stasera — a domani',
  },

  bottle: {
    goalReached: 'Obiettivo raggiunto! 🎉',
    ofGoal: (goal: string) => `su ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} su ${goal}`,
  },

  log: {
    custom: 'Altro…',
    undoLast: 'Annulla',
    customTitle: 'Quantità personalizzata',
    cancel: 'Annulla',
    submit: 'Aggiungi',
    amountInMl: 'Quantità in millilitri',
    amountInOz: 'Quantità in once',
    logAmountA11y: (amount: string) => `Aggiungi ${amount}`,
    customA11y: 'Aggiungi una quantità personalizzata',
    undoA11y: 'Annulla l’ultima bevuta',
    closeCustomA11y: 'Chiudi quantità personalizzata',
    submitA11y: 'Aggiungi quantità personalizzata',
  },

  history: {
    title: 'Cronologia',
    streak: (days: number) =>
      days === 1 ? '🔥 1 giorno di fila' : `🔥 ${days} giorni di fila`,
    noStreak: 'Inizia la tua serie oggi',
    sectionWeek: 'ULTIMI 7 GIORNI',
    sectionAll: 'TUTTA LA CRONOLOGIA',
    emptyWeek: 'Nessuna bevuta registrata questa settimana',
    emptyAll: 'Ancora niente. I tuoi giorni compariranno qui.',
    legend: (goal: string) => `Verde = obiettivo di ${goal} raggiunto`,
    showEarlier: (hidden: number) => `Mostra giorni precedenti (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1 ? 'Mostra i giorni precedenti, ancora 1 giorno' : `Mostra i giorni precedenti, altri ${hidden} giorni`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', oggi' : ''}: ${amount}${met ? ', obiettivo raggiunto' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', obiettivo raggiunto' : ''}`,
  },

  onboarding: {
    title: 'Fissiamo il tuo obiettivo giornaliero',
    subtitle: 'Pochi dati e puoi iniziare a bere.',
    suggestedGoal: 'Obiettivo giornaliero consigliato',
    changeBelow: 'Cambialo qui sotto se preferisci un obiettivo tuo.',
    enterWeight: 'Inserisci il tuo peso per vedere un consiglio.',
    goalLabel: (units: string) => `Obiettivo giornaliero (${units})`,
    goalA11y: (unitName: string) => `Obiettivo giornaliero in ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Inserisci un obiettivo tra ${min} e ${max} ${units}`,
    unitsLabel: 'Unità',
    start: 'Inizia',
    permissionNote:
      'Ti chiederemo il permesso per le notifiche, così i promemoria potranno raggiungerti.',
  },

  settings: {
    title: 'Impostazioni',
    sectionGoal: 'OBIETTIVO GIORNALIERO',
    sectionUnits: 'UNITÀ',
    sectionSchedule: 'ORARI',
    sectionCups: 'BICCHIERI',
    sectionReminders: 'PROMEMORIA',
    sectionAbout: 'INFORMAZIONI',
    suggested: 'Consigliato',
    useSuggested: 'Usa il suggerimento',
    useSuggestedA11y: 'Usa l’obiettivo consigliato',
    goalLabel: 'Obiettivo giornaliero (ml)',
    goalA11y: 'Obiettivo giornaliero in millilitri',
    goalRange: (min: string, max: string) =>
      `Inserisci un obiettivo tra ${min} e ${max} ml`,
    unitsNote: 'Cambia solo come vengono mostrate le quantità. Tutto è salvato in ml.',
    presetSizes: 'Misure predefinite (ml)',
    cupA11y: (index: number) => `Misura del bicchiere ${index} in millilitri`,
    defaultCup: 'Bicchiere predefinito',
    defaultCupA11y: (amount: string) => `Bicchiere predefinito ${amount}`,
    cupNote: 'Viene aggiunto quando tocchi il pulsante rapido in un promemoria.',
    reminders: 'Promemoria',
    enableInIosSettings: 'Attiva le notifiche nelle Impostazioni di iOS',
    version: (version: string) => `Versione ${version}`,
    privacyNote: 'I tuoi dati non lasciano mai questo dispositivo.',
    rate: 'Valuta Sip',
    rateA11y: 'Valuta Sip sull’App Store',
  },

  fields: {
    weightLabel: 'Il tuo peso (kg)',
    weightA11y: 'Il tuo peso in chilogrammi',
    activityLabel: 'Livello di attività',
    sedentary: 'Sedentario',
    moderate: 'Moderato',
    active: 'Attivo',
    wakeLabel: 'Mi sveglio verso le',
    sleepLabel: 'Vado a dormire verso le',
    wakeA11y: (time: string) => `Sveglia alle ${time}`,
    sleepA11y: (time: string) => `A dormire alle ${time}`,
    showMl: 'Mostra in millilitri',
    showOz: 'Mostra in once',
    unitNameMl: 'millilitri',
    unitNameOz: 'once',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Mancano ${amount}`,
    done: 'Obiettivo raggiunto',
  },

  notice: {
    paceTitle: 'Rallenta un po’',
    paceBody: (limit: string) =>
      `Sono più di ${limit} nell’ultima ora. I reni ne smaltiscono più o meno solo questa quantità all’ora, e bere più in fretta diluisce il sodio nel sangue. Meglio bere con calma che tutto d’un fiato.`,
    paceTail: 'Mal di testa, nausea o confusione? Parlane con un medico.',
    dailyTitle: 'Oggi hai bevuto tanto',
    dailyBody: (total: string, low: string, high: string) =>
      `Oltre ${total} registrati oggi. La maggior parte delle indicazioni sta tra ${low} e ${high} al giorno, cibo compreso — di più va bene se hai sudato molto. Da qui in poi, lasciati guidare dalla sete.`,
    learnMore: 'Perché è importante',
    learnMoreA11y: 'Perché è importante — apre una pagina web',
  },

  notifications: {
    quickLog: (amount: string) => `Aggiungi ${amount}`,
    snooze: 'Non ora (1 h)',
    messages: [
      ['È l’ora dell’acqua 💧', 'Un bicchiere adesso e resti in pari.'],
      ['Come va l’idratazione?', 'Il tuo corpo ti ringrazierà per un sorso.'],
      ['Pausa acqua', 'Piccoli sorsi, grande differenza.'],
      ['Hai sete?', 'Un bicchiere d’acqua ci sta proprio bene adesso.'],
      ['Continua così', 'Sei più vicino all’obiettivo di quanto pensi.'],
      ['Un sorso?', 'Prenditi un attimo per bere un po’ d’acqua.'],
      ['È ora di bere', 'Un bicchiere ora è meglio che recuperare dopo.'],
      ['Resta fresco', 'Basta un po’ d’acqua per fare la differenza.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['Ci sentiamo più tardi', 'Quando hai un momento, un bicchiere d’acqua.'],
      ['Nessuna fretta', 'Bevi quando ti va. Restiamo in silenzio.'],
      ['Siamo qui', 'Un po’ d’acqua, quando vuoi.'],
      ['Un promemoria leggero', 'Giornata piena? Diraderemo gli avvisi.'],
    ] as Array<[string, string]>,
  },
};

import type { Strings } from './en';

export const de: Strings = {
  tabs: {
    today: 'Heute',
    history: 'Verlauf',
    settings: 'Einstellungen',
  },

  home: {
    remindersOff: 'Erinnerungen sind aus',
    doneForToday: 'Fertig für heute – keine Erinnerungen mehr',
    nextReminder: (time: string) => `Nächste Erinnerung gegen ${time}`,
    noneTonight: 'Heute Abend keine Erinnerungen mehr – morgen geht’s weiter',
  },

  bottle: {
    goalReached: 'Ziel erreicht! 🎉',
    ofGoal: (goal: string) => `von ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} von ${goal}`,
  },

  log: {
    custom: 'Andere…',
    undoLast: 'Rückgängig',
    customTitle: 'Eigene Menge',
    cancel: 'Abbrechen',
    submit: 'Eintragen',
    amountInMl: 'Menge in Millilitern',
    amountInOz: 'Menge in Unzen',
    logAmountA11y: (amount: string) => `${amount} eintragen`,
    customA11y: 'Eigene Menge eintragen',
    undoA11y: 'Letztes Getränk rückgängig machen',
    closeCustomA11y: 'Eigene Menge schließen',
    submitA11y: 'Eigene Menge eintragen',
  },

  history: {
    title: 'Verlauf',
    streak: (days: number) =>
      days === 1 ? '🔥 1 Tag in Folge' : `🔥 ${days} Tage in Folge`,
    noStreak: 'Starte heute deine Serie',
    sectionWeek: 'LETZTE 7 TAGE',
    sectionAll: 'GESAMTER VERLAUF',
    emptyWeek: 'Diese Woche noch nichts eingetragen',
    emptyAll: 'Noch nichts eingetragen. Deine Tage erscheinen hier.',
    legend: (goal: string) => `Grün = Tagesziel ${goal} erreicht`,
    showEarlier: (hidden: number) => `Frühere Tage anzeigen (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1 ? 'Frühere Tage anzeigen, noch 1 Tag' : `Frühere Tage anzeigen, noch ${hidden} Tage`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', heute' : ''}: ${amount}${met ? ', Ziel erreicht' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', Ziel erreicht' : ''}`,
  },

  onboarding: {
    title: 'Lass uns dein Tagesziel festlegen',
    subtitle: 'Ein paar Angaben, und du kannst loslegen.',
    suggestedGoal: 'Vorgeschlagenes Tagesziel',
    changeBelow: 'Du kannst es unten nach Belieben ändern.',
    enterWeight: 'Gib dein Gewicht ein, um einen Vorschlag zu sehen.',
    goalLabel: (units: string) => `Tagesziel (${units})`,
    goalA11y: (unitName: string) => `Tagesziel in ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Gib ein Ziel zwischen ${min} und ${max} ${units} ein`,
    unitsLabel: 'Einheiten',
    start: 'Los geht’s',
    permissionNote:
      'Wir fragen nach der Erlaubnis für Mitteilungen, damit dich Erinnerungen erreichen.',
  },

  settings: {
    title: 'Einstellungen',
    sectionGoal: 'TAGESZIEL',
    sectionUnits: 'EINHEITEN',
    sectionSchedule: 'ZEITPLAN',
    sectionCups: 'GLÄSER',
    sectionReminders: 'ERINNERUNGEN',
    sectionAbout: 'INFO',
    suggested: 'Vorschlag',
    useSuggested: 'Vorschlag nutzen',
    useSuggestedA11y: 'Vorgeschlagenes Ziel übernehmen',
    goalLabel: 'Tagesziel (ml)',
    goalA11y: 'Tagesziel in Millilitern',
    goalRange: (min: string, max: string) =>
      `Gib ein Ziel zwischen ${min} und ${max} ml ein`,
    unitsNote: 'Ändert nur die Anzeige. Gespeichert wird alles in ml.',
    presetSizes: 'Glasgrößen (ml)',
    cupA11y: (index: number) => `Größe von Glas ${index} in Millilitern`,
    defaultCup: 'Standardglas',
    defaultCupA11y: (amount: string) => `Standardglas ${amount}`,
    cupNote: 'Wird eingetragen, wenn du in einer Erinnerung auf „Eintragen“ tippst.',
    reminders: 'Erinnerungen',
    enableInIosSettings: 'Mitteilungen in den iOS-Einstellungen aktivieren',
    version: (version: string) => `Version ${version}`,
    privacyNote: 'Deine Daten verlassen nie dieses Gerät.',
    rate: 'Sip bewerten',
    rateA11y: 'Sip im App Store bewerten',
  },

  fields: {
    weightLabel: 'Dein Gewicht (kg)',
    weightA11y: 'Dein Gewicht in Kilogramm',
    activityLabel: 'Aktivität',
    sedentary: 'Wenig',
    moderate: 'Mittel',
    active: 'Viel',
    wakeLabel: 'Aufstehen gegen',
    sleepLabel: 'Schlafen gehen gegen',
    wakeA11y: (time: string) => `Aufstehen um ${time}`,
    sleepA11y: (time: string) => `Schlafen gehen um ${time}`,
    showMl: 'Mengen in Millilitern anzeigen',
    showOz: 'Mengen in Unzen anzeigen',
    unitNameMl: 'Millilitern',
    unitNameOz: 'Unzen',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Noch ${amount}`,
    done: 'Ziel erreicht',
  },

  notice: {
    paceTitle: 'Mach etwas langsamer',
    paceBody: (limit: string) =>
      `Das sind mehr als ${limit} in der letzten Stunde. Die Nieren scheiden pro Stunde nur etwa so viel aus, und wer schneller trinkt, verdünnt das Natrium im Blut. Gleichmäßig trinken ist besser als hastig.`,
    paceTail: 'Hast du Kopfschmerzen, ist dir übel oder bist du benommen? Sprich mit einer Ärztin oder einem Arzt.',
    dailyTitle: 'Das ist heute viel',
    dailyBody: (total: string, low: string, high: string) =>
      `Heute schon über ${total} eingetragen. Die meisten Empfehlungen liegen bei ${low} bis ${high} am Tag, Essen eingerechnet – wer stark geschwitzt hat, darf mehr. Lass dich ab jetzt vom Durst leiten.`,
    learnMore: 'Warum das wichtig ist',
    learnMoreA11y: 'Warum das wichtig ist – öffnet eine Webseite',
  },

  notifications: {
    quickLog: (amount: string) => `${amount} eintragen`,
    snooze: 'Nicht jetzt (1 Std.)',
    messages: [
      ['Zeit für Wasser 💧', 'Ein Glas jetzt, und du bleibst im Plan.'],
      ['Trink-Check', 'Dein Körper freut sich über einen Schluck.'],
      ['Wasserpause', 'Kleine Schlucke, große Wirkung.'],
      ['Schon Durst?', 'Ein Glas Wasser wäre jetzt genau richtig.'],
      ['Weiter so', 'Du bist näher an deinem Tagesziel, als du denkst.'],
      ['Kleiner Schluck gefällig?', 'Nimm dir kurz Zeit für etwas Wasser.'],
      ['Wasser marsch!', 'Ein Glas jetzt ist leichter als Aufholen später.'],
      ['Bleib frisch', 'Schon ein bisschen Wasser macht viel aus.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['Wir melden uns später', 'Wenn du kurz Zeit hast: ein Glas Wasser.'],
      ['Keine Eile', 'Trink, wann es dir passt. Wir bleiben leise.'],
      ['Noch da', 'Ein wenig Wasser, wann immer du so weit bist.'],
      ['Sanfter Hinweis', 'Viel los heute? Wir melden uns seltener.'],
    ] as Array<[string, string]>,
  },
};

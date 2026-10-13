import type { Strings } from './en';

/** Dutch, informal (je). */
export const nl: Strings = {
  tabs: {
    today: 'Vandaag',
    history: 'Geschiedenis',
    settings: 'Instellingen',
  },

  home: {
    remindersOff: 'Herinneringen staan uit',
    doneForToday: 'Klaar voor vandaag — geen herinneringen meer',
    nextReminder: (time: string) => `Volgende herinnering rond ${time}`,
    noneTonight: 'Vanavond geen herinneringen meer — morgen weer',
  },

  bottle: {
    goalReached: 'Doel gehaald! 🎉',
    ofGoal: (goal: string) => `van ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} van ${goal}`,
  },

  log: {
    custom: 'Anders…',
    undoLast: 'Ongedaan maken',
    customTitle: 'Eigen hoeveelheid',
    cancel: 'Annuleer',
    submit: 'Noteer',
    amountInMl: 'Hoeveelheid in milliliter',
    amountInOz: 'Hoeveelheid in ounces',
    logAmountA11y: (amount: string) => `${amount} noteren`,
    customA11y: 'Eigen hoeveelheid noteren',
    undoA11y: 'Laatste drankje ongedaan maken',
    closeCustomA11y: 'Eigen hoeveelheid sluiten',
    submitA11y: 'Eigen hoeveelheid noteren',
  },

  history: {
    title: 'Geschiedenis',
    streak: (days: number) =>
      days === 1 ? `🔥 Reeks van 1 dag` : `🔥 Reeks van ${days} dagen`,
    noStreak: 'Begin vandaag aan je reeks',
    sectionWeek: 'AFGELOPEN 7 DAGEN',
    sectionAll: 'VOLLEDIGE GESCHIEDENIS',
    emptyWeek: 'Deze week nog niets genoteerd',
    emptyAll: 'Nog niets genoteerd. Je dagen verschijnen hier.',
    legend: (goal: string) => `Groen = dagdoel van ${goal} gehaald`,
    showEarlier: (hidden: number) => `Eerdere dagen tonen (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1
        ? `Eerdere dagen tonen, nog 1 dag`
        : `Eerdere dagen tonen, nog ${hidden} dagen`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', vandaag' : ''}: ${amount}${met ? ', doel gehaald' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', doel gehaald' : ''}`,
  },

  onboarding: {
    title: 'Stel je dagdoel in',
    subtitle: 'Een paar gegevens en je kunt beginnen.',
    suggestedGoal: 'Voorgesteld dagdoel',
    changeBelow: 'Wil je liever je eigen doel? Pas het hieronder aan.',
    enterWeight: 'Vul je gewicht in voor een voorstel.',
    goalLabel: (units: string) => `Dagdoel (${units})`,
    goalA11y: (unitName: string) => `Dagdoel in ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Kies een doel tussen ${min} en ${max} ${units}`,
    unitsLabel: 'Eenheden',
    start: 'Start',
    permissionNote:
      'We vragen toestemming voor meldingen, zodat de herinneringen je bereiken.',
  },

  settings: {
    title: 'Instellingen',
    sectionGoal: 'DAGDOEL',
    sectionUnits: 'EENHEDEN',
    sectionSchedule: 'DAGRITME',
    sectionCups: 'GLAZEN',
    sectionReminders: 'HERINNERINGEN',
    sectionAbout: 'OVER',
    suggested: 'Voorgesteld',
    useSuggested: 'Voorstel gebruiken',
    useSuggestedA11y: 'Voorgesteld doel gebruiken',
    goalLabel: 'Dagdoel (ml)',
    goalA11y: 'Dagdoel in milliliter',
    goalRange: (min: string, max: string) =>
      `Kies een doel tussen ${min} en ${max} ml`,
    unitsNote: 'Bepaalt hoe hoeveelheden worden getoond. Alles wordt in ml opgeslagen.',
    presetSizes: 'Vaste maten (ml)',
    cupA11y: (index: number) => `Glas ${index}, maat in milliliter`,
    defaultCup: 'Standaardglas',
    defaultCupA11y: (amount: string) => `Standaardglas ${amount}`,
    cupNote: 'Wordt genoteerd als je in een herinnering op de snelknop tikt.',
    reminders: 'Herinneringen',
    enableInIosSettings: 'Zet meldingen aan in de iOS-instellingen',
    version: (version: string) => `Versie ${version}`,
    privacyNote: 'Je gegevens verlaten dit apparaat nooit.',
    rate: 'Beoordeel Sip',
    rateA11y: 'Beoordeel Sip in de App Store',
  },

  fields: {
    weightLabel: 'Je gewicht (kg)',
    weightA11y: 'Je gewicht in kilogram',
    activityLabel: 'Activiteitsniveau',
    sedentary: 'Weinig',
    moderate: 'Gemiddeld',
    active: 'Actief',
    wakeLabel: 'Ik word wakker rond',
    sleepLabel: 'Ik ga slapen rond',
    wakeA11y: (time: string) => `Wakker worden om ${time}`,
    sleepA11y: (time: string) => `Gaan slapen om ${time}`,
    showMl: 'Hoeveelheden in milliliter tonen',
    showOz: 'Hoeveelheden in ounces tonen',
    unitNameMl: 'milliliter',
    unitNameOz: 'ounces',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Nog ${amount}`,
    done: 'Doel gehaald',
  },

  notice: {
    paceTitle: 'Doe het iets rustiger aan',
    paceBody: (limit: string) =>
      `Dat is meer dan ${limit} in het afgelopen uur. Je nieren kunnen per uur maar ongeveer zoveel water uitscheiden; sneller drinken verdunt het natrium in je bloed. Kleine slokjes verspreid over de tijd zijn beter dan veel ineens drinken.`,
    paceTail: 'Hoofdpijn, misselijk of suf? Neem contact op met een arts.',
    dailyTitle: 'Dat is veel voor één dag',
    dailyBody: (total: string, low: string, high: string) =>
      `Vandaag al meer dan ${total} genoteerd. De meeste adviezen liggen tussen ${low} en ${high} per dag, eten meegerekend — meer is prima als je flink hebt gezweet. Laat vanaf nu je dorst de weg wijzen.`,
    learnMore: 'Waarom dit belangrijk is',
    learnMoreA11y: 'Waarom dit belangrijk is — opent een webpagina',
  },

  notifications: {
    quickLog: (amount: string) => `${amount} noteren`,
    snooze: 'Nu niet (1 u)',
    messages: [
      ['Tijd voor water 💧', 'Nu even een glas, dan blijf je op schema.'],
      ['Even checken', 'Je lichaam is je dankbaar voor een slokje.'],
      ['Waterpauze', 'Kleine slokjes, groot verschil.'],
      ['Al dorst?', 'Een glas water klinkt nu best goed.'],
      ['Lekker bezig', 'Je bent dichter bij je doel dan je denkt.'],
      ['Sip-herinnering', 'Neem even een moment voor wat water.'],
      ['Glaasje water?', 'Nu een glas is makkelijker dan straks inhalen.'],
      ['Blijf fris', 'Een beetje water doet al veel.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['We kijken later nog even', 'Heb je even tijd? Een glas water.'],
      ['Geen haast', 'Drink wanneer het je uitkomt. Wij houden ons stil.'],
      ['Nog steeds hier', 'Een beetje water, wanneer jij er klaar voor bent.'],
      ['Klein seintje', 'Drukke dag? We laten meer tijd tussen de herinneringen.'],
    ] as Array<[string, string]>,
  },
};

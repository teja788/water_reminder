import type { Strings } from './en';

/** Polish, informal (ty). "dzień" is the only singular; 2+ is always "dni". */
export const pl: Strings = {
  tabs: {
    today: 'Dziś',
    history: 'Historia',
    settings: 'Ustawienia',
  },

  home: {
    remindersOff: 'Przypomnienia są wyłączone',
    doneForToday: 'Na dziś koniec — bez kolejnych przypomnień',
    nextReminder: (time: string) => `Następne przypomnienie około ${time}`,
    noneTonight: 'Dziś już bez przypomnień — wracamy jutro',
  },

  bottle: {
    goalReached: 'Cel osiągnięty! 🎉',
    ofGoal: (goal: string) => `z ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} z ${goal}`,
  },

  log: {
    custom: 'Inna…',
    undoLast: 'Cofnij',
    customTitle: 'Własna ilość',
    cancel: 'Anuluj',
    submit: 'Zapisz',
    amountInMl: 'Ilość w mililitrach',
    amountInOz: 'Ilość w uncjach',
    logAmountA11y: (amount: string) => `Zapisz ${amount}`,
    customA11y: 'Zapisz własną ilość',
    undoA11y: 'Cofnij ostatni napój',
    closeCustomA11y: 'Zamknij własną ilość',
    submitA11y: 'Zapisz własną ilość',
  },

  history: {
    title: 'Historia',
    streak: (days: number) =>
      days === 1 ? `🔥 Seria: 1 dzień` : `🔥 Seria: ${days} dni`,
    noStreak: 'Zacznij swoją serię już dziś',
    sectionWeek: 'OSTATNIE 7 DNI',
    sectionAll: 'CAŁA HISTORIA',
    emptyWeek: 'W tym tygodniu nic nie zapisano',
    emptyAll: 'Jeszcze nic nie zapisano. Twoje dni pojawią się tutaj.',
    legend: (goal: string) => `Zielony = dzienny cel ${goal} osiągnięty`,
    showEarlier: (hidden: number) => `Pokaż wcześniejsze dni (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1
        ? `Pokaż wcześniejsze dni, jeszcze 1 dzień`
        : `Pokaż wcześniejsze dni, jeszcze ${hidden} dni`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', dziś' : ''}: ${amount}${met ? ', cel osiągnięty' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', cel osiągnięty' : ''}`,
  },

  onboarding: {
    title: 'Ustalmy twój dzienny cel',
    subtitle: 'Kilka szczegółów i możesz zaczynać.',
    suggestedGoal: 'Sugerowany dzienny cel',
    changeBelow: 'Jeśli wolisz własny cel, zmień go poniżej.',
    enterWeight: 'Podaj swoją wagę, aby zobaczyć propozycję.',
    goalLabel: (units: string) => `Dzienny cel (${units})`,
    goalA11y: (unitName: string) => `Dzienny cel w ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Podaj cel od ${min} do ${max} ${units}`,
    unitsLabel: 'Jednostki',
    start: 'Start',
    permissionNote:
      'Poprosimy o zgodę na powiadomienia, żeby przypomnienia mogły do ciebie docierać.',
  },

  settings: {
    title: 'Ustawienia',
    sectionGoal: 'DZIENNY CEL',
    sectionUnits: 'JEDNOSTKI',
    sectionSchedule: 'PLAN DNIA',
    sectionCups: 'SZKLANKI',
    sectionReminders: 'PRZYPOMNIENIA',
    sectionAbout: 'INFORMACJE',
    suggested: 'Sugerowany',
    useSuggested: 'Użyj sugerowanego',
    useSuggestedA11y: 'Użyj sugerowanego celu',
    goalLabel: 'Dzienny cel (ml / L)',
    goalA11y: 'Dzienny cel w mililitrach',
    goalRange: (min: string, max: string) =>
      `Podaj cel od ${min} do ${max} ml`,
    unitsNote: 'Zmienia sposób wyświetlania ilości. Wszystko jest zapisywane w ml.',
    presetSizes: 'Gotowe rozmiary (ml)',
    cupA11y: (index: number) => `Rozmiar szklanki ${index} w mililitrach`,
    defaultCup: 'Domyślna szklanka',
    defaultCupA11y: (amount: string) => `Domyślna szklanka ${amount}`,
    cupNote: 'Zapisywana, gdy stukniesz przycisk szybkiego zapisu w przypomnieniu.',
    reminders: 'Przypomnienia',
    enableInIosSettings: 'Włącz powiadomienia w Ustawieniach iOS',
    version: (version: string) => `Wersja ${version}`,
    privacyNote: 'Twoje dane nigdy nie opuszczają tego urządzenia.',
    rate: 'Oceń Sip',
    rateA11y: 'Oceń Sip w App Store',
  },

  fields: {
    weightLabel: 'Twoja waga (kg)',
    weightA11y: 'Twoja waga w kilogramach',
    activityLabel: 'Poziom aktywności',
    sedentary: 'Niski',
    moderate: 'Średni',
    active: 'Wysoki',
    wakeLabel: 'Wstaję około',
    sleepLabel: 'Kładę się spać około',
    wakeA11y: (time: string) => `Pobudka o ${time}`,
    sleepA11y: (time: string) => `Sen o ${time}`,
    showMl: 'Pokazuj ilości w mililitrach',
    showOz: 'Pokazuj ilości w uncjach',
    unitNameMl: 'mililitrach',
    unitNameOz: 'uncjach',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Zostało ${amount}`,
    done: 'Cel osiągnięty',
  },

  notice: {
    paceTitle: 'Zwolnij trochę',
    paceBody: (limit: string) =>
      `To ponad ${limit} w ciągu ostatniej godziny. Nerki usuwają mniej więcej tyle na godzinę, a szybsze picie rozrzedza sód we krwi. Lepiej pić małymi łykami niż duszkiem.`,
    paceTail: 'Boli cię głowa, masz mdłości lub czujesz otępienie? Skontaktuj się z lekarzem.',
    dailyTitle: 'To spory dzień',
    dailyBody: (total: string, low: string, high: string) =>
      `Dziś zapisano już ponad ${total}. Większość zaleceń mieści się między ${low} a ${high} dziennie, wliczając wodę z jedzenia — większa ilość może być odpowiednia po intensywnym wysiłku i obfitym poceniu. Od teraz kieruj się pragnieniem.`,
    learnMore: 'Dlaczego to ważne',
    learnMoreA11y: 'Dlaczego to ważne — otwiera stronę internetową',
  },

  notifications: {
    quickLog: (amount: string) => `Zapisz ${amount}`,
    snooze: 'Nie teraz (1 h)',
    messages: [
      ['Czas na wodę 💧', 'Szklanka teraz i trzymasz tempo.'],
      ['Jak z nawodnieniem?', 'Twoje ciało podziękuje ci za łyk.'],
      ['Przerwa na wodę', 'Małe łyki, duża różnica.'],
      ['Chce ci się pić?', 'Szklanka wody to teraz dobry pomysł.'],
      ['Tak trzymaj', 'Jesteś bliżej dzisiejszego celu, niż myślisz.'],
      ['Przypomnienie od Sip', 'Zrób sobie chwilę przerwy na wodę.'],
      ['Pora na szklankę', 'Lepiej szklanka teraz niż nadrabianie później.'],
      ['Odśwież się', 'Odrobina wody robi wiele.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['Odezwiemy się później', 'Gdy znajdziesz chwilę, szklanka wody.'],
      ['Bez pośpiechu', 'Pij, kiedy ci pasuje. Będziemy cicho.'],
      ['Wciąż tu jesteśmy', 'Trochę wody, kiedy tylko zechcesz.'],
      ['Delikatne przypomnienie', 'Pracowity dzień? Będziemy pisać rzadziej.'],
    ] as Array<[string, string]>,
  },
};

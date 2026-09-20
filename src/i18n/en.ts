/**
 * Every user-visible string in the app. Anything a person can read or hear
 * (VoiceOver included) belongs here and nowhere else.
 *
 * Values that interpolate take arguments instead of being assembled at the
 * call site, so a translator can move the pieces around — word order and
 * punctuation differ by language, and `${a} of ${b}` is not reorderable once
 * it has been split into fragments.
 */
export const en = {
  tabs: {
    today: 'Today',
    history: 'History',
    settings: 'Settings',
  },

  home: {
    remindersOff: 'Reminders are off',
    doneForToday: 'Done for today — no more reminders',
    nextReminder: (time: string) => `Next reminder around ${time}`,
    noneTonight: 'No more reminders tonight — back tomorrow',
  },

  bottle: {
    goalReached: 'Goal reached! 🎉',
    ofGoal: (goal: string) => `of ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} of ${goal}`,
  },

  log: {
    custom: 'Custom…',
    undoLast: 'Undo last',
    customTitle: 'Custom amount',
    cancel: 'Cancel',
    submit: 'Log',
    amountInMl: 'Amount in millilitres',
    amountInOz: 'Amount in ounces',
    logAmountA11y: (amount: string) => `Log ${amount}`,
    customA11y: 'Log a custom amount',
    undoA11y: 'Undo last drink',
    closeCustomA11y: 'Close custom amount',
    submitA11y: 'Log custom amount',
  },

  history: {
    title: 'History',
    streak: (days: number) => `🔥 ${days}-day streak`,
    noStreak: 'Start your streak today',
    sectionWeek: 'LAST 7 DAYS',
    sectionAll: 'ALL HISTORY',
    emptyWeek: 'No drinks logged this week',
    emptyAll: 'Nothing logged yet. Your days will show up here.',
    legend: (goal: string) => `Green = daily goal ${goal} met`,
    showEarlier: (hidden: number) => `Show earlier days (${hidden})`,
    showEarlierA11y: (hidden: number) => `Show earlier days, ${hidden} more`,
    // Both take the flags rather than pre-joined fragments: a leading ", today"
    // is not translatable on its own.
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', today' : ''}: ${amount}${met ? ', goal met' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', goal met' : ''}`,
  },

  onboarding: {
    title: "Let's set your daily goal",
    subtitle: "A few details and you're ready to drink.",
    suggestedGoal: 'Suggested daily goal',
    changeBelow: 'Change it below if you prefer your own target.',
    enterWeight: 'Enter your weight to see a suggestion.',
    goalLabel: (units: string) => `Daily goal (${units})`,
    goalA11y: (unitName: string) => `Daily goal in ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Enter a goal between ${min} and ${max} ${units}`,
    unitsLabel: 'Units',
    start: 'Start',
    permissionNote:
      "We'll ask for notification permission so reminders can reach you.",
  },

  settings: {
    title: 'Settings',
    sectionGoal: 'DAILY GOAL',
    sectionUnits: 'UNITS',
    sectionSchedule: 'SCHEDULE',
    sectionCups: 'CUPS',
    sectionReminders: 'REMINDERS',
    sectionAbout: 'ABOUT',
    suggested: 'Suggested',
    useSuggested: 'Use suggested',
    useSuggestedA11y: 'Use suggested goal',
    goalLabel: 'Daily goal (ml)',
    goalA11y: 'Daily goal in millilitres',
    goalRange: (min: string, max: string) =>
      `Enter a goal between ${min} and ${max} ml`,
    unitsNote: 'Changes how amounts are shown. Everything is stored in ml.',
    presetSizes: 'Preset sizes (ml)',
    cupA11y: (index: number) => `Cup ${index} size in millilitres`,
    defaultCup: 'Default cup',
    defaultCupA11y: (amount: string) => `Default cup ${amount}`,
    cupNote: 'Logged when you tap the quick-log button on a reminder.',
    reminders: 'Reminders',
    enableInIosSettings: 'Enable notifications in iOS Settings',
    version: (version: string) => `Version ${version}`,
    privacyNote: 'Your data never leaves this device.',
    rate: 'Rate Sip',
    rateA11y: 'Rate Sip on the App Store',
  },

  /** Shared between onboarding and settings. */
  fields: {
    weightLabel: 'Your weight (kg)',
    weightA11y: 'Your weight in kilograms',
    activityLabel: 'Activity level',
    sedentary: 'Sedentary',
    moderate: 'Moderate',
    active: 'Active',
    wakeLabel: 'I wake up around',
    sleepLabel: 'I go to sleep around',
    wakeA11y: (time: string) => `Wake up at ${time}`,
    sleepA11y: (time: string) => `Go to sleep at ${time}`,
    showMl: 'Show amounts in millilitres',
    showOz: 'Show amounts in ounces',
    unitNameMl: 'millilitres',
    unitNameOz: 'ounces',
  },

  /**
   * Health copy. Translate this with more care than the rest — a clumsy
   * rendering of medical guidance is worse than a clumsy button label.
   */
  notice: {
    paceTitle: 'Ease off a little',
    paceBody: (limit: string) =>
      `That's over ${limit} in the past hour. Kidneys clear only about that much an hour, and drinking faster thins the sodium in your blood. Sipping steadily is kinder than gulping.`,
    paceTail: 'Feeling headachy, queasy or foggy? Talk to a doctor.',
    dailyTitle: "That's a big day",
    dailyBody: (total: string, low: string, high: string) =>
      `Over ${total} logged today. Most guidance lands between ${low} and ${high} a day, food included — more is fine if you have been sweating hard. From here, let thirst lead.`,
    learnMore: 'Why this matters',
    learnMoreA11y: 'Why this matters — opens a web page',
  },

  notifications: {
    quickLog: (amount: string) => `Log ${amount}`,
    /**
     * Idiomatic on purpose — these are the app's voice. Rewrite them for each
     * language rather than translating them literally; "Water o'clock" has no
     * word-for-word equivalent anywhere.
     */
    messages: [
      ['Time for water 💧', 'A quick glass now keeps you on track.'],
      ['Hydration check', 'Your body will thank you for a sip.'],
      ['Water break', 'Small sips, big difference.'],
      ['Thirsty yet?', 'A glass of water sounds good right about now.'],
      ['Keep it flowing', "You're closer to today's goal than you think."],
      ['Sip reminder', 'Take a moment — have some water.'],
      ["Water o'clock", 'One glass now beats catching up later.'],
      ['Stay refreshed', 'A little water goes a long way.'],
    ] as Array<[string, string]>,
  },
};

/** Shape every other locale must match. TypeScript then refuses a catalog with
 *  a missing key, a typo, or an interpolation whose arguments changed. */
export type Strings = typeof en;

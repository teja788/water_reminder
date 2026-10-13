import type { Strings } from './en';

export const fr: Strings = {
  tabs: {
    today: 'Aujourd’hui',
    history: 'Historique',
    settings: 'Réglages',
  },

  home: {
    remindersOff: 'Rappels désactivés',
    doneForToday: 'Terminé pour aujourd’hui — plus de rappels',
    nextReminder: (time: string) => `Prochain rappel vers ${time}`,
    noneTonight: 'Plus de rappels ce soir — à demain',
  },

  bottle: {
    goalReached: 'Objectif atteint ! 🎉',
    ofGoal: (goal: string) => `sur ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} sur ${goal}`,
  },

  log: {
    custom: 'Autre…',
    undoLast: 'Annuler',
    customTitle: 'Quantité personnalisée',
    cancel: 'Annuler',
    submit: 'Ajouter',
    amountInMl: 'Quantité en millilitres',
    amountInOz: 'Quantité en onces',
    logAmountA11y: (amount: string) => `Ajouter ${amount}`,
    customA11y: 'Ajouter une quantité personnalisée',
    undoA11y: 'Annuler la dernière boisson',
    closeCustomA11y: 'Fermer la quantité personnalisée',
    submitA11y: 'Ajouter la quantité personnalisée',
  },

  history: {
    title: 'Historique',
    streak: (days: number) =>
      days === 1 ? '🔥 1 jour d’affilée' : `🔥 ${days} jours d’affilée`,
    noStreak: 'Lance ta série aujourd’hui',
    sectionWeek: '7 DERNIERS JOURS',
    sectionAll: 'TOUT L’HISTORIQUE',
    emptyWeek: 'Aucune boisson cette semaine',
    emptyAll: 'Rien pour l’instant. Tes journées apparaîtront ici.',
    legend: (goal: string) => `Vert = objectif de ${goal} atteint`,
    showEarlier: (hidden: number) => `Voir les jours précédents (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1 ? 'Voir les jours précédents, encore 1 jour' : `Voir les jours précédents, encore ${hidden} jours`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', aujourd’hui' : ''} : ${amount}${met ? ', objectif atteint' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date} : ${amount}${met ? ', objectif atteint' : ''}`,
  },

  onboarding: {
    title: 'Fixons ton objectif du jour',
    subtitle: 'Quelques infos et c’est parti.',
    suggestedGoal: 'Objectif suggéré',
    changeBelow: 'Modifie-le ci-dessous si tu préfères ton propre objectif.',
    enterWeight: 'Indique ton poids pour voir une suggestion.',
    goalLabel: (units: string) => `Objectif du jour (${units})`,
    goalA11y: (unitName: string) => `Objectif du jour en ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Indique un objectif entre ${min} et ${max} ${units}`,
    unitsLabel: 'Unités',
    start: 'C’est parti',
    permissionNote:
      'Nous allons demander l’autorisation d’envoyer des notifications pour que les rappels te parviennent.',
  },

  settings: {
    title: 'Réglages',
    sectionGoal: 'OBJECTIF DU JOUR',
    sectionUnits: 'UNITÉS',
    sectionSchedule: 'HORAIRES',
    sectionCups: 'VERRES',
    sectionReminders: 'RAPPELS',
    sectionAbout: 'À PROPOS',
    suggested: 'Suggéré',
    useSuggested: 'Utiliser la suggestion',
    useSuggestedA11y: 'Utiliser l’objectif suggéré',
    goalLabel: 'Objectif du jour (ml)',
    goalA11y: 'Objectif du jour en millilitres',
    goalRange: (min: string, max: string) =>
      `Indique un objectif entre ${min} et ${max} ml`,
    unitsNote: 'Change seulement l’affichage. Tout est enregistré en ml.',
    presetSizes: 'Tailles prédéfinies (ml)',
    cupA11y: (index: number) => `Taille du verre ${index} en millilitres`,
    defaultCup: 'Verre par défaut',
    defaultCupA11y: (amount: string) => `Verre par défaut ${amount}`,
    cupNote: 'Ajouté quand tu touches le bouton d’ajout rapide d’un rappel.',
    reminders: 'Rappels',
    enableInIosSettings: 'Active les notifications dans les Réglages d’iOS',
    version: (version: string) => `Version ${version}`,
    privacyNote: 'Tes données ne quittent jamais cet appareil.',
    rate: 'Noter Sip',
    rateA11y: 'Noter Sip sur l’App Store',
  },

  fields: {
    weightLabel: 'Ton poids (kg)',
    weightA11y: 'Ton poids en kilogrammes',
    activityLabel: 'Niveau d’activité',
    sedentary: 'Sédentaire',
    moderate: 'Modéré',
    active: 'Actif',
    wakeLabel: 'Je me lève vers',
    sleepLabel: 'Je me couche vers',
    wakeA11y: (time: string) => `Lever à ${time}`,
    sleepA11y: (time: string) => `Coucher à ${time}`,
    showMl: 'Afficher en millilitres',
    showOz: 'Afficher en onces',
    unitNameMl: 'millilitres',
    unitNameOz: 'onces',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Encore ${amount}`,
    done: 'Objectif atteint',
  },

  notice: {
    paceTitle: 'Ralentis un peu',
    paceBody: (limit: string) =>
      `Plus de ${limit} en une heure. Les reins n’en éliminent qu’environ autant par heure, et boire plus vite dilue le sodium dans le sang. Mieux vaut boire régulièrement que d’un trait.`,
    paceTail: 'Tu as mal à la tête, des nausées ou l’esprit embrumé ? Parles-en à un médecin.',
    dailyTitle: 'Grosse journée',
    dailyBody: (total: string, low: string, high: string) =>
      `Plus de ${total} aujourd’hui. La plupart des recommandations se situent entre ${low} et ${high} par jour, alimentation comprise — davantage si tu as beaucoup transpiré. À partir de maintenant, fie-toi à ta soif.`,
    learnMore: 'Pourquoi c’est important',
    learnMoreA11y: 'Pourquoi c’est important — ouvre une page web',
  },

  notifications: {
    quickLog: (amount: string) => `Ajouter ${amount}`,
    snooze: 'Pas maintenant (1 h)',
    messages: [
      ['L’heure de boire 💧', 'Un petit verre maintenant et tu restes sur la bonne voie.'],
      ['Petit point hydratation', 'Ton corps te dira merci pour une gorgée.'],
      ['Pause eau', 'Petites gorgées, grande différence.'],
      ['Un peu soif ?', 'Un verre d’eau, ça tombe bien maintenant.'],
      ['Continue comme ça', 'Tu es plus près de ton objectif que tu ne le crois.'],
      ['Une gorgée ?', 'Prends un instant pour boire un peu d’eau.'],
      ['C’est l’heure de l’eau', 'Un verre maintenant vaut mieux que rattraper ce soir.'],
      ['Pense à t’hydrater', 'Un peu d’eau, ça change tout.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['On repassera plus tard', 'Quand tu as un moment, un verre d’eau.'],
      ['Rien ne presse', 'Bois quand ça t’arrange. On se fait discrets.'],
      ['Toujours là', 'Un peu d’eau, quand tu veux.'],
      ['Petit rappel tout doux', 'Journée chargée ? On espace les rappels.'],
    ] as Array<[string, string]>,
  },
};

import type { Strings } from './en';

export const es: Strings = {
  tabs: {
    today: 'Hoy',
    history: 'Historial',
    settings: 'Ajustes',
  },

  home: {
    remindersOff: 'Recordatorios desactivados',
    doneForToday: 'Por hoy has terminado — no habrá más recordatorios',
    nextReminder: (time: string) => `Próximo recordatorio: ${time} aprox.`,
    noneTonight: 'No hay más recordatorios esta noche — hasta mañana',
  },

  bottle: {
    goalReached: '¡Meta alcanzada! 🎉',
    ofGoal: (goal: string) => `de ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} de ${goal}`,
  },

  log: {
    custom: 'Otra…',
    undoLast: 'Deshacer',
    customTitle: 'Cantidad personalizada',
    cancel: 'Cancelar',
    submit: 'Añadir',
    amountInMl: 'Cantidad en mililitros',
    amountInOz: 'Cantidad en onzas',
    logAmountA11y: (amount: string) => `Añadir ${amount}`,
    customA11y: 'Añadir una cantidad personalizada',
    undoA11y: 'Deshacer la última bebida',
    closeCustomA11y: 'Cerrar cantidad personalizada',
    submitA11y: 'Añadir cantidad personalizada',
  },

  history: {
    title: 'Historial',
    streak: (days: number) =>
      days === 1 ? '🔥 Racha de 1 día' : `🔥 Racha de ${days} días`,
    noStreak: 'Empieza tu racha hoy',
    sectionWeek: 'ÚLTIMOS 7 DÍAS',
    sectionAll: 'TODO EL HISTORIAL',
    emptyWeek: 'Nada registrado esta semana',
    emptyAll: 'Aún no hay registros. Tus días aparecerán aquí.',
    legend: (goal: string) => `Verde = meta diaria de ${goal} cumplida`,
    showEarlier: (hidden: number) => `Ver días anteriores (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1
        ? 'Ver días anteriores, 1 más'
        : `Ver días anteriores, ${hidden} más`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', hoy' : ''}: ${amount}${met ? ', meta cumplida' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', meta cumplida' : ''}`,
  },

  onboarding: {
    title: 'Fijemos tu meta diaria',
    subtitle: 'Con unos pocos datos, ya puedes empezar.',
    suggestedGoal: 'Meta diaria sugerida',
    changeBelow: 'Cámbiala abajo si prefieres tu propia meta.',
    enterWeight: 'Escribe tu peso para ver una sugerencia.',
    goalLabel: (units: string) => `Meta diaria (${units})`,
    goalA11y: (unitName: string) => `Meta diaria en ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Escribe una meta entre ${min} y ${max} ${units}`,
    unitsLabel: 'Unidades',
    start: 'Empezar',
    permissionNote:
      'Te pediremos permiso para enviarte notificaciones, así los recordatorios te llegarán.',
  },

  settings: {
    title: 'Ajustes',
    sectionGoal: 'META DIARIA',
    sectionUnits: 'UNIDADES',
    sectionSchedule: 'HORARIO',
    sectionCups: 'VASOS',
    sectionReminders: 'RECORDATORIOS',
    sectionAbout: 'ACERCA DE',
    suggested: 'Sugerida',
    useSuggested: 'Usar sugerida',
    useSuggestedA11y: 'Usar la meta sugerida',
    goalLabel: 'Meta diaria (ml)',
    goalA11y: 'Meta diaria en mililitros',
    goalRange: (min: string, max: string) =>
      `Escribe una meta entre ${min} y ${max} ml`,
    unitsNote: 'Solo cambia cómo se muestran las cantidades. Todo se guarda en ml.',
    presetSizes: 'Tamaños predefinidos (ml)',
    cupA11y: (index: number) => `Tamaño del vaso ${index} en mililitros`,
    defaultCup: 'Vaso predeterminado',
    defaultCupA11y: (amount: string) => `Vaso predeterminado ${amount}`,
    cupNote: 'Se registra al tocar el botón de añadir rápido en un recordatorio.',
    reminders: 'Recordatorios',
    enableInIosSettings: 'Activa las notificaciones en los Ajustes de iOS',
    version: (version: string) => `Versión ${version}`,
    privacyNote: 'Tus datos nunca salen de este dispositivo.',
    rate: 'Valorar Sip',
    rateA11y: 'Valorar Sip en el App Store',
  },

  fields: {
    weightLabel: 'Tu peso (kg)',
    weightA11y: 'Tu peso en kilogramos',
    activityLabel: 'Nivel de actividad',
    sedentary: 'Sedentario',
    moderate: 'Moderado',
    active: 'Activo',
    wakeLabel: 'Me levanto hacia las',
    sleepLabel: 'Me acuesto hacia las',
    wakeA11y: (time: string) => `Levantarse a las ${time}`,
    sleepA11y: (time: string) => `Acostarse a las ${time}`,
    showMl: 'Mostrar en mililitros',
    showOz: 'Mostrar en onzas',
    unitNameMl: 'mililitros',
    unitNameOz: 'onzas',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Faltan ${amount}`,
    done: 'Meta alcanzada',
  },

  notice: {
    paceTitle: 'Bebe un poco más despacio',
    paceBody: (limit: string) =>
      `Llevas más de ${limit} en la última hora. Los riñones solo eliminan más o menos esa cantidad por hora, y beber más rápido diluye el sodio de la sangre. Mejor a sorbos constantes que de golpe.`,
    paceTail: '¿Dolor de cabeza, náuseas o la mente nublada? Consulta a un médico.',
    dailyTitle: 'Hoy has bebido mucho',
    dailyBody: (total: string, low: string, high: string) =>
      `Más de ${total} registrados hoy. La mayoría de las recomendaciones están entre ${low} y ${high} al día, contando la comida — más está bien si has sudado mucho. A partir de ahora, déjate guiar por la sed.`,
    learnMore: 'Por qué importa',
    learnMoreA11y: 'Por qué importa — abre una página web',
  },

  notifications: {
    quickLog: (amount: string) => `Añadir ${amount}`,
    snooze: 'Ahora no (1 h)',
    messages: [
      ['Hora de beber agua 💧', 'Un vaso ahora y sigues por buen camino.'],
      ['¿Qué tal esa hidratación?', 'Tu cuerpo te agradecerá un sorbo.'],
      ['Pausa para el agua', 'Pequeños sorbos, gran diferencia.'],
      ['¿Tienes sed?', 'Un vaso de agua sienta genial ahora mismo.'],
      ['Sigue así', 'Estás más cerca de tu meta de lo que crees.'],
      ['Un sorbito', 'Tómate un momento para beber agua.'],
      ['¡Al agua!', 'Un vaso ahora es mejor que ponerse al día luego.'],
      ['Sigue hidratándote', 'Un poco de agua hace mucho.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['Te escribimos luego', 'Cuando tengas un momento, un vaso de agua.'],
      ['Sin prisa', 'Bebe cuando te venga bien. Seremos discretos.'],
      ['Seguimos aquí', 'Un poco de agua, cuando quieras.'],
      ['Un toque suave', '¿Día ajetreado? Espaciaremos los avisos.'],
    ] as Array<[string, string]>,
  },
};

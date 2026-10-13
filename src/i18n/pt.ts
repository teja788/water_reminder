import type { Strings } from './en';

/** Brazilian Portuguese, informal (você). */
export const pt: Strings = {
  tabs: {
    today: 'Hoje',
    history: 'Histórico',
    settings: 'Ajustes',
  },

  home: {
    remindersOff: 'Lembretes desativados',
    doneForToday: 'Meta de hoje cumprida — sem mais lembretes',
    nextReminder: (time: string) => `Próximo lembrete por volta das ${time}`,
    noneTonight: 'Sem mais lembretes hoje — até amanhã',
  },

  bottle: {
    goalReached: 'Meta atingida! 🎉',
    ofGoal: (goal: string) => `de ${goal}`,
    progressA11y: (total: string, goal: string) => `${total} de ${goal}`,
  },

  log: {
    custom: 'Outra…',
    undoLast: 'Desfazer',
    customTitle: 'Quantidade personalizada',
    cancel: 'Cancelar',
    submit: 'Registrar',
    amountInMl: 'Quantidade em mililitros',
    amountInOz: 'Quantidade em onças',
    logAmountA11y: (amount: string) => `Registrar ${amount}`,
    customA11y: 'Registrar outra quantidade',
    undoA11y: 'Desfazer a última bebida',
    closeCustomA11y: 'Fechar quantidade personalizada',
    submitA11y: 'Registrar quantidade personalizada',
  },

  history: {
    title: 'Histórico',
    streak: (days: number) =>
      days === 1 ? `🔥 Sequência de 1 dia` : `🔥 Sequência de ${days} dias`,
    noStreak: 'Comece sua sequência hoje',
    sectionWeek: 'ÚLTIMOS 7 DIAS',
    sectionAll: 'TODO O HISTÓRICO',
    emptyWeek: 'Nada registrado esta semana',
    emptyAll: 'Nada registrado ainda. Seus dias vão aparecer aqui.',
    legend: (goal: string) => `Verde = meta diária de ${goal} cumprida`,
    showEarlier: (hidden: number) => `Mostrar dias anteriores (${hidden})`,
    showEarlierA11y: (hidden: number) =>
      hidden === 1 ? 'Mostrar dias anteriores, mais 1 dia' : `Mostrar dias anteriores, mais ${hidden} dias`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', hoje' : ''}: ${amount}${met ? ', meta cumprida' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', meta cumprida' : ''}`,
  },

  onboarding: {
    title: 'Vamos definir sua meta diária',
    subtitle: 'Alguns detalhes e pronto, é só beber.',
    suggestedGoal: 'Meta diária sugerida',
    changeBelow: 'Altere abaixo se preferir sua própria meta.',
    enterWeight: 'Informe seu peso para ver uma sugestão.',
    goalLabel: (units: string) => `Meta diária (${units})`,
    goalA11y: (unitName: string) => `Meta diária em ${unitName}`,
    goalRange: (min: string, max: string, units: string) =>
      `Informe uma meta entre ${min} e ${max} ${units}`,
    unitsLabel: 'Unidades',
    start: 'Começar',
    permissionNote:
      'Vamos pedir permissão para notificações, assim os lembretes chegam até você.',
  },

  settings: {
    title: 'Ajustes',
    sectionGoal: 'META DIÁRIA',
    sectionUnits: 'UNIDADES',
    sectionSchedule: 'HORÁRIOS',
    sectionCups: 'COPOS',
    sectionReminders: 'LEMBRETES',
    sectionAbout: 'SOBRE',
    suggested: 'Sugerida',
    useSuggested: 'Usar sugerida',
    useSuggestedA11y: 'Usar a meta sugerida',
    goalLabel: 'Meta diária (ml)',
    goalA11y: 'Meta diária em mililitros',
    goalRange: (min: string, max: string) =>
      `Informe uma meta entre ${min} e ${max} ml`,
    unitsNote: 'Muda como as quantidades aparecem. Tudo é salvo em ml.',
    presetSizes: 'Tamanhos predefinidos (ml)',
    cupA11y: (index: number) => `Tamanho do copo ${index} em mililitros`,
    defaultCup: 'Copo padrão',
    defaultCupA11y: (amount: string) => `Copo padrão ${amount}`,
    cupNote: 'Registrado quando você toca no botão de registro rápido de um lembrete.',
    reminders: 'Lembretes',
    enableInIosSettings: 'Ative as notificações nos Ajustes do iOS',
    version: (version: string) => `Versão ${version}`,
    privacyNote: 'Seus dados nunca saem deste aparelho.',
    rate: 'Avaliar o Sip',
    rateA11y: 'Avaliar o Sip na App Store',
  },

  fields: {
    weightLabel: 'Seu peso (kg)',
    weightA11y: 'Seu peso em quilos',
    activityLabel: 'Nível de atividade',
    sedentary: 'Sedentário',
    moderate: 'Moderado',
    active: 'Ativo',
    wakeLabel: 'Acordo por volta das',
    sleepLabel: 'Vou dormir por volta das',
    wakeA11y: (time: string) => `Acordar às ${time}`,
    sleepA11y: (time: string) => `Dormir às ${time}`,
    showMl: 'Mostrar quantidades em mililitros',
    showOz: 'Mostrar quantidades em onças',
    unitNameMl: 'mililitros',
    unitNameOz: 'onças',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `Faltam ${amount}`,
    done: 'Meta atingida',
  },

  notice: {
    paceTitle: 'Vá com um pouco mais de calma',
    paceBody: (limit: string) =>
      `Você bebeu mais de ${limit} na última hora. Os rins conseguem eliminar apenas cerca dessa quantidade por hora, e beber mais depressa dilui o sódio no sangue. É melhor beber aos poucos do que de uma só vez.`,
    paceTail: 'Sentindo dor de cabeça, enjoo ou confusão mental? Procure um médico.',
    dailyTitle: 'Foi bastante hoje',
    dailyBody: (total: string, low: string, high: string) =>
      `Hoje você registrou mais de ${total}. A maioria das recomendações fica entre ${low} e ${high} por dia, contando a água dos alimentos — beber mais pode ser adequado se você suou muito. Daqui para a frente, deixe a sede guiar.`,
    learnMore: 'Por que isso importa',
    learnMoreA11y: 'Por que isso importa — abre uma página da web',
  },

  notifications: {
    quickLog: (amount: string) => `Registrar ${amount}`,
    snooze: 'Agora não (1 h)',
    messages: [
      ['Hora da água 💧', 'Um copo agora e você segue no ritmo.'],
      ['Como está a hidratação?', 'Seu corpo agradece um gole.'],
      ['Pausa para a água', 'Pequenos goles, grande diferença.'],
      ['Já deu sede?', 'Um copo d’água cairia bem agora.'],
      ['Continue assim', 'Você está mais perto da meta do que imagina.'],
      ['Lembrete do Sip', 'Tire um minutinho e beba água.'],
      ['Um copinho?', 'Um copo agora é melhor do que correr atrás depois.'],
      ['Refresque-se', 'Um pouco de água faz muita diferença.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['A gente volta depois', 'Quando tiver um tempinho, um copo d’água.'],
      ['Sem pressa', 'Beba quando der. A gente fica quietinho.'],
      ['Ainda por aqui', 'Um pouco de água, quando você quiser.'],
      ['Só um toque', 'Dia corrido? Vamos espaçar os lembretes.'],
    ] as Array<[string, string]>,
  },
};

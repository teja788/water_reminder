import type { Strings } from './en';

export const ko: Strings = {
  tabs: {
    today: '오늘',
    history: '기록',
    settings: '설정',
  },

  home: {
    remindersOff: '알림이 꺼져 있어요',
    doneForToday: '오늘 목표 달성! 더 이상 알림이 없어요',
    nextReminder: (time: string) => `다음 알림은 ${time}쯤이에요`,
    noneTonight: '오늘 밤 알림은 끝났어요. 내일 다시 만나요',
  },

  bottle: {
    goalReached: '목표 달성! 🎉',
    ofGoal: (goal: string) => `/ ${goal}`,
    progressA11y: (total: string, goal: string) => `${goal} 중 ${total}`,
  },

  log: {
    custom: '직접 입력…',
    undoLast: '되돌리기',
    customTitle: '직접 입력',
    cancel: '취소',
    submit: '기록',
    amountInMl: '양(밀리리터)',
    amountInOz: '양(온스)',
    logAmountA11y: (amount: string) => `${amount} 기록`,
    customA11y: '양을 직접 입력해 기록',
    undoA11y: '마지막 기록 되돌리기',
    closeCustomA11y: '직접 입력 닫기',
    submitA11y: '입력한 양 기록',
  },

  history: {
    title: '기록',
    streak: (days: number) => `🔥 ${days}일 연속`,
    noStreak: '오늘부터 연속 기록을 시작해요',
    sectionWeek: '최근 7일',
    sectionAll: '전체 기록',
    emptyWeek: '이번 주에는 기록이 없어요',
    emptyAll: '아직 기록이 없어요. 기록한 날이 여기에 표시돼요.',
    legend: (goal: string) => `초록색 = 하루 목표 ${goal} 달성`,
    showEarlier: (hidden: number) => `이전 날짜 보기 (${hidden})`,
    showEarlierA11y: (hidden: number) => `이전 날짜 보기, ${hidden}일 더 있음`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', 오늘' : ''}: ${amount}${met ? ', 목표 달성' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', 목표 달성' : ''}`,
  },

  onboarding: {
    title: '하루 목표를 정해 볼까요',
    subtitle: '몇 가지만 입력하면 바로 시작할 수 있어요.',
    suggestedGoal: '추천 하루 목표',
    changeBelow: '원하는 목표가 있다면 아래에서 바꿀 수 있어요.',
    enterWeight: '체중을 입력하면 추천 목표가 보여요.',
    goalLabel: (units: string) => `하루 목표(${units})`,
    goalA11y: (unitName: string) => `하루 목표(${unitName})`,
    goalRange: (min: string, max: string, units: string) =>
      `${min}~${max} ${units} 사이로 입력해 주세요`,
    unitsLabel: '단위',
    start: '시작하기',
    permissionNote: '알림을 보내 드릴 수 있도록 알림 권한을 요청할게요.',
  },

  settings: {
    title: '설정',
    sectionGoal: '하루 목표',
    sectionUnits: '단위',
    sectionSchedule: '일정',
    sectionCups: '컵',
    sectionReminders: '알림',
    sectionAbout: '정보',
    suggested: '추천',
    useSuggested: '추천 목표 사용',
    useSuggestedA11y: '추천 목표 사용',
    goalLabel: '하루 목표(ml / L)',
    goalA11y: '하루 목표(밀리리터)',
    goalRange: (min: string, max: string) =>
      `${min}~${max} ml 사이로 입력해 주세요`,
    unitsNote: '양을 표시하는 단위만 바뀌어요. 모든 기록은 ml로 저장돼요.',
    presetSizes: '기본 용량(ml)',
    cupA11y: (index: number) => `컵 ${index} 용량(밀리리터)`,
    defaultCup: '기본 컵',
    defaultCupA11y: (amount: string) => `기본 컵 ${amount}`,
    cupNote: '알림에서 바로 기록 버튼을 누르면 이 양이 기록돼요.',
    reminders: '알림',
    enableInIosSettings: 'iOS 설정에서 알림을 켜 주세요',
    version: (version: string) => `버전 ${version}`,
    privacyNote: '데이터는 이 기기 밖으로 나가지 않아요.',
    rate: 'Sip 평가하기',
    rateA11y: 'App Store에서 Sip 평가하기',
  },

  fields: {
    weightLabel: '체중(kg)',
    weightA11y: '체중(킬로그램)',
    activityLabel: '활동량',
    sedentary: '적음',
    moderate: '보통',
    active: '많음',
    wakeLabel: '일어나는 시간',
    sleepLabel: '잠드는 시간',
    wakeA11y: (time: string) => `기상 ${time}`,
    sleepA11y: (time: string) => `취침 ${time}`,
    showMl: '밀리리터로 표시',
    showOz: '온스로 표시',
    unitNameMl: '밀리리터',
    unitNameOz: '온스',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `${amount} 남음`,
    done: '목표 달성',
  },

  notice: {
    paceTitle: '조금 천천히 마셔요',
    paceBody: (limit: string) =>
      `최근 1시간 동안 ${limit} 넘게 마셨어요. 신장이 한 시간에 처리할 수 있는 양은 대략 그 정도이고, 그보다 빨리 마시면 혈액 속 나트륨이 묽어져요. 벌컥벌컥 마시기보다 조금씩 꾸준히 마시는 게 몸에 좋아요.`,
    paceTail: '두통, 메스꺼움, 멍한 느낌이 있다면 의사와 상담하세요.',
    dailyTitle: '오늘 정말 많이 마셨어요',
    dailyBody: (total: string, low: string, high: string) =>
      `오늘 ${total} 넘게 기록했어요. 대부분의 권장량은 음식에 든 수분을 포함해 하루 ${low}~${high} 정도예요. 땀을 많이 흘린 날이라면 더 마셔도 괜찮아요. 지금부터는 목이 마를 때 마셔요.`,
    learnMore: '왜 중요할까요',
    learnMoreA11y: '왜 중요할까요 — 웹페이지가 열려요',
  },

  notifications: {
    quickLog: (amount: string) => `${amount} 기록`,
    snooze: '나중에 (1시간)',
    messages: [
      ['물 마실 시간이에요 💧', '지금 한 잔이면 오늘 페이스를 지킬 수 있어요.'],
      ['수분 체크', '한 모금만 마셔도 몸이 고마워해요.'],
      ['잠깐 물 한 잔', '조금씩 마셔도 확실히 달라져요.'],
      ['목마르지 않나요?', '지금 물 한 잔 어때요?'],
      ['이대로 계속', '오늘 목표까지 생각보다 얼마 안 남았어요.'],
      ['Sip 알림', '잠깐 쉬면서 물 한 잔 마셔요.'],
      ['지금 한 잔', '나중에 몰아서 마시는 것보다 지금 한 잔이 좋아요.'],
      ['상쾌하게', '물 조금으로도 기분이 달라져요.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['나중에 다시 알려 드릴게요', '여유가 생기면 물 한 잔 마셔요.'],
      ['서두르지 않아도 돼요', '편할 때 마셔요. 알림 횟수는 줄일게요.'],
      ['여기 있어요', '준비되면 물 조금 마셔요.'],
      ['살짝 알림', '바쁜 하루인가요? 알림 간격을 늘릴게요.'],
    ] as Array<[string, string]>,
  },
};

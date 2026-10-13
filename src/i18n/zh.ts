import type { Strings } from './en';

/** Traditional Chinese (Taiwan usage), used for every Chinese locale. */
export const zh: Strings = {
  tabs: {
    today: '今天',
    history: '紀錄',
    settings: '設定',
  },

  home: {
    remindersOff: '提醒已關閉',
    doneForToday: '今天達標了，不會再提醒你',
    nextReminder: (time: string) => `下次提醒約在 ${time}`,
    noneTonight: '今晚不再提醒，明天見',
  },

  bottle: {
    goalReached: '達成目標！🎉',
    ofGoal: (goal: string) => `/ ${goal}`,
    progressA11y: (total: string, goal: string) => `已喝 ${total}，每日目標 ${goal}`,
  },

  log: {
    custom: '自訂…',
    undoLast: '復原',
    customTitle: '自訂份量',
    cancel: '取消',
    submit: '記錄',
    amountInMl: '份量（毫升）',
    amountInOz: '份量（盎司）',
    logAmountA11y: (amount: string) => `記錄 ${amount}`,
    customA11y: '記錄自訂份量',
    undoA11y: '復原上一筆紀錄',
    closeCustomA11y: '關閉自訂份量',
    submitA11y: '記錄輸入的份量',
  },

  history: {
    title: '紀錄',
    streak: (days: number) => `🔥 連續 ${days} 天`,
    noStreak: '從今天開始累積連續天數',
    sectionWeek: '最近 7 天',
    sectionAll: '所有紀錄',
    emptyWeek: '這週還沒有紀錄',
    emptyAll: '還沒有任何紀錄，記錄過的日子會顯示在這裡。',
    legend: (goal: string) => `綠色＝達成每日目標 ${goal}`,
    showEarlier: (hidden: number) => `顯示更早的日子（${hidden}）`,
    showEarlierA11y: (hidden: number) => `顯示更早的日子，還有 ${hidden} 天`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? '，今天' : ''}：${amount}${met ? '，已達標' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}：${amount}${met ? '，已達標' : ''}`,
  },

  onboarding: {
    title: '設定你的每日目標',
    subtitle: '填幾個資料就能開始喝水了。',
    suggestedGoal: '建議每日目標',
    changeBelow: '想用自己的目標，可以在下方修改。',
    enterWeight: '輸入體重即可看到建議。',
    goalLabel: (units: string) => `每日目標（${units}）`,
    goalA11y: (unitName: string) => `每日目標（${unitName}）`,
    goalRange: (min: string, max: string, units: string) =>
      `請輸入 ${min} 到 ${max} ${units} 之間的目標`,
    unitsLabel: '單位',
    start: '開始',
    permissionNote: '我們會請你允許通知，這樣提醒才能送達。',
  },

  settings: {
    title: '設定',
    sectionGoal: '每日目標',
    sectionUnits: '單位',
    sectionSchedule: '作息',
    sectionCups: '杯子容量',
    sectionReminders: '提醒',
    sectionAbout: '關於',
    suggested: '建議',
    useSuggested: '使用建議值',
    useSuggestedA11y: '使用建議目標',
    goalLabel: '每日目標（ml）',
    goalA11y: '每日目標（毫升）',
    goalRange: (min: string, max: string) =>
      `請輸入 ${min} 到 ${max} ml 之間的目標`,
    unitsNote: '只會改變份量的顯示方式，所有資料都以 ml 儲存。',
    presetSizes: '預設容量（ml）',
    cupA11y: (index: number) => `第 ${index} 杯的份量（毫升）`,
    defaultCup: '預設容量',
    defaultCupA11y: (amount: string) => `預設容量 ${amount}`,
    cupNote: '在提醒通知上點「快速記錄」時，會記錄這個份量。',
    reminders: '提醒',
    enableInIosSettings: '請到 iOS 設定開啟通知',
    version: (version: string) => `版本 ${version}`,
    privacyNote: '你的資料不會離開這台裝置。',
    rate: '為 Sip 評分',
    rateA11y: '在 App Store 為 Sip 評分',
  },

  fields: {
    weightLabel: '體重（kg）',
    weightA11y: '體重（公斤）',
    activityLabel: '活動量',
    sedentary: '久坐',
    moderate: '適中',
    active: '活躍',
    wakeLabel: '我大約幾點起床',
    sleepLabel: '我大約幾點睡覺',
    wakeA11y: (time: string) => `起床時間 ${time}`,
    sleepA11y: (time: string) => `睡覺時間 ${time}`,
    showMl: '以毫升顯示份量',
    showOz: '以盎司顯示份量',
    unitNameMl: '毫升',
    unitNameOz: '盎司',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `還差 ${amount}`,
    done: '已達成目標',
  },

  notice: {
    paceTitle: '稍微放慢一點',
    paceBody: (limit: string) =>
      `過去一小時你已喝超過 ${limit}。腎臟每小時大約只能排出這麼多水，喝得更快會稀釋血液中的鈉。慢慢小口喝，比一口氣灌下對身體更溫和。`,
    paceTail: '如果感到頭痛、噁心或昏沉，請諮詢醫師。',
    dailyTitle: '今天喝得真多',
    dailyBody: (total: string, low: string, high: string) =>
      `今天已記錄超過 ${total}。多數建議落在每天 ${low} 到 ${high}，包含食物中的水分；如果流了很多汗，多喝一些也沒關係。接下來就跟著口渴的感覺喝吧。`,
    learnMore: '為什麼這很重要',
    learnMoreA11y: '為什麼這很重要 — 會開啟網頁',
  },

  notifications: {
    quickLog: (amount: string) => `記錄 ${amount}`,
    snooze: '稍後（1 小時）',
    messages: [
      ['該喝水囉 💧', '現在喝一杯，保持今天的好節奏。'],
      ['補水時間', '喝一口水，身體會感謝你。'],
      ['喝水休息一下', '小口喝，也能帶來大改變。'],
      ['口渴了嗎？', '現在來杯水剛剛好。'],
      ['繼續保持', '離今天的目標比你想的還近。'],
      ['Sip 提醒你', '停下來一下，喝點水吧。'],
      ['來杯水吧', '現在喝一杯，勝過晚點一次補很多。'],
      ['清爽一下', '一點點水，就能讓你精神一振。'],
    ] as Array<[string, string]>,
    softMessages: [
      ['晚點再提醒你', '有空的時候，喝杯水吧。'],
      ['不用急', '方便的時候再喝，我們會安靜一點。'],
      ['我們還在', '準備好了，就喝點水吧。'],
      ['輕輕提醒', '今天很忙嗎？我們會拉長提醒間隔。'],
    ] as Array<[string, string]>,
  },
};

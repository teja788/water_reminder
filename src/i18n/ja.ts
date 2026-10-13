import type { Strings } from './en';

export const ja: Strings = {
  tabs: {
    today: '今日',
    history: '履歴',
    settings: '設定',
  },

  home: {
    remindersOff: 'リマインダーはオフです',
    doneForToday: '今日は達成！もうリマインダーはありません',
    nextReminder: (time: string) => `次のリマインダーは${time}ごろ`,
    noneTonight: '今夜のリマインダーはもうありません。また明日',
  },

  bottle: {
    goalReached: '目標達成！🎉',
    ofGoal: (goal: string) => `/ ${goal}`,
    progressA11y: (total: string, goal: string) => `目標${goal}のうち${total}`,
  },

  log: {
    custom: 'カスタム…',
    undoLast: '取り消す',
    customTitle: '量を入力',
    cancel: 'キャンセル',
    submit: '記録',
    amountInMl: '量（ミリリットル）',
    amountInOz: '量（オンス）',
    logAmountA11y: (amount: string) => `${amount}を記録`,
    customA11y: '量を入力して記録',
    undoA11y: '最後の記録を取り消す',
    closeCustomA11y: '量の入力を閉じる',
    submitA11y: '入力した量を記録',
  },

  history: {
    title: '履歴',
    streak: (days: number) => `🔥 ${days}日連続`,
    noStreak: '今日から連続記録をはじめましょう',
    sectionWeek: '過去7日間',
    sectionAll: 'すべての履歴',
    emptyWeek: '今週の記録はまだありません',
    emptyAll: 'まだ記録がありません。記録した日がここに表示されます。',
    legend: (goal: string) => `緑＝1日の目標（${goal}）を達成`,
    showEarlier: (hidden: number) => `以前の日を表示（${hidden}）`,
    showEarlierA11y: (hidden: number) => `以前の日を表示、あと${hidden}日`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? '、今日' : ''}：${amount}${met ? '、目標達成' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}：${amount}${met ? '、目標達成' : ''}`,
  },

  onboarding: {
    title: '1日の目標を決めましょう',
    subtitle: 'いくつか入力するだけで準備完了です。',
    suggestedGoal: 'おすすめの1日の目標',
    changeBelow: '自分で目標を決めたい場合は、下で変更できます。',
    enterWeight: '体重を入力すると、おすすめが表示されます。',
    goalLabel: (units: string) => `1日の目標（${units}）`,
    goalA11y: (unitName: string) => `1日の目標（${unitName}）`,
    goalRange: (min: string, max: string, units: string) =>
      `${min}〜${max} ${units}の範囲で入力してください`,
    unitsLabel: '単位',
    start: 'はじめる',
    permissionNote:
      'リマインダーをお届けするため、通知の許可をお願いします。',
  },

  settings: {
    title: '設定',
    sectionGoal: '1日の目標',
    sectionUnits: '単位',
    sectionSchedule: 'スケジュール',
    sectionCups: 'カップ',
    sectionReminders: 'リマインダー',
    sectionAbout: 'このアプリについて',
    suggested: 'おすすめ',
    useSuggested: 'おすすめを使う',
    useSuggestedA11y: 'おすすめの目標を使う',
    goalLabel: '1日の目標（ml）',
    goalA11y: '1日の目標（ミリリットル）',
    goalRange: (min: string, max: string) =>
      `${min}〜${max} mlの範囲で入力してください`,
    unitsNote: '量の表示が変わります。データはすべてmlで保存されます。',
    presetSizes: 'プリセットの量（ml）',
    cupA11y: (index: number) => `カップ${index}の量（ミリリットル）`,
    defaultCup: 'いつものカップ',
    defaultCupA11y: (amount: string) => `いつものカップ ${amount}`,
    cupNote: 'リマインダーの「記録」ボタンをタップしたときに記録される量です。',
    reminders: 'リマインダー',
    enableInIosSettings: 'iOSの設定で通知をオンにしてください',
    version: (version: string) => `バージョン ${version}`,
    privacyNote: 'データがこの端末の外に出ることはありません。',
    rate: 'Sipを評価する',
    rateA11y: 'App StoreでSipを評価する',
  },

  fields: {
    weightLabel: '体重（kg）',
    weightA11y: '体重（キログラム）',
    activityLabel: '活動量',
    sedentary: '少なめ',
    moderate: 'ふつう',
    active: '多め',
    wakeLabel: '起きる時刻',
    sleepLabel: '寝る時刻',
    wakeA11y: (time: string) => `起床 ${time}`,
    sleepA11y: (time: string) => `就寝 ${time}`,
    showMl: '量をミリリットルで表示',
    showOz: '量をオンスで表示',
    unitNameMl: 'ミリリットル',
    unitNameOz: 'オンス',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `あと${amount}`,
    done: '目標達成',
  },

  notice: {
    paceTitle: '少しペースを落としましょう',
    paceBody: (limit: string) =>
      `この1時間で${limit}を超えています。腎臓が1時間に処理できるのはおよそその量までで、それより速く飲むと血液中のナトリウムが薄まります。一気に飲むより、少しずつ飲むほうが体にやさしいです。`,
    paceTail: '頭痛や吐き気、ぼんやりする感じがあるときは、医師に相談してください。',
    dailyTitle: '今日はたくさん飲みました',
    dailyBody: (total: string, low: string, high: string) =>
      `今日は${total}を超える量を記録しています。多くの目安では、食事からの水分も含めて1日${low}〜${high}ほどです。たくさん汗をかいた日はそれ以上でもかまいません。ここからは、のどの渇きに合わせて飲みましょう。`,
    learnMore: '大切な理由',
    learnMoreA11y: '大切な理由。Webページが開きます',
  },

  notifications: {
    quickLog: (amount: string) => `${amount}を記録`,
    snooze: 'あとで（1時間）',
    messages: [
      ['お水の時間です 💧', 'いま1杯飲んで、いいペースをキープしましょう。'],
      ['水分チェック', 'ひと口の水で、体がよろこびます。'],
      ['ひと休みしませんか', '少しずつでも、ちゃんと効きます。'],
      ['のど、渇いていませんか？', 'そろそろ1杯いかがですか。'],
      ['その調子です', '今日の目標まで、思ったより近いですよ。'],
      ['Sipからのお知らせ', 'ちょっと手を止めて、お水をどうぞ。'],
      ['ここで1杯', 'あとでまとめて飲むより、いま1杯がおすすめです。'],
      ['すっきりしましょう', '少しの水でも、気分が変わります。'],
    ] as Array<[string, string]>,
    softMessages: [
      ['またあとで声をかけますね', '手があいたときに、お水を1杯どうぞ。'],
      ['急がなくて大丈夫', '飲めるときにどうぞ。通知は控えめにしますね。'],
      ['ここにいますよ', '準備ができたら、少しお水をどうぞ。'],
      ['そっとお知らせ', '忙しい日ですか？通知の間隔をあけますね。'],
    ] as Array<[string, string]>,
  },
};

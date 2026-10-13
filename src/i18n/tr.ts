import type { Strings } from './en';

/** Turkish, informal (sen). No plural after a number: "5 gün". */
export const tr: Strings = {
  tabs: {
    today: 'Bugün',
    history: 'Geçmiş',
    settings: 'Ayarlar',
  },

  home: {
    remindersOff: 'Hatırlatıcılar kapalı',
    doneForToday: 'Bugünlük bu kadar — başka hatırlatma yok',
    nextReminder: (time: string) => `Sonraki hatırlatma ${time} civarı`,
    noneTonight: 'Bu akşam başka hatırlatma yok — yarın görüşürüz',
  },

  bottle: {
    goalReached: 'Hedefe ulaştın! 🎉',
    ofGoal: (goal: string) => `/ ${goal}`,
    progressA11y: (total: string, goal: string) => `${goal} hedefinin ${total} kadarı tamamlandı`,
  },

  log: {
    custom: 'Diğer…',
    undoLast: 'Geri al',
    customTitle: 'Özel miktar',
    cancel: 'Vazgeç',
    submit: 'Kaydet',
    amountInMl: 'Mililitre cinsinden miktar',
    amountInOz: 'Ons cinsinden miktar',
    logAmountA11y: (amount: string) => `${amount} kaydet`,
    customA11y: 'Özel bir miktar kaydet',
    undoA11y: 'Son içeceği geri al',
    closeCustomA11y: 'Özel miktarı kapat',
    submitA11y: 'Özel miktarı kaydet',
  },

  history: {
    title: 'Geçmiş',
    streak: (days: number) => `🔥 ${days} günlük seri`,
    noStreak: 'Serine bugün başla',
    sectionWeek: 'SON 7 GÜN',
    sectionAll: 'TÜM GEÇMİŞ',
    emptyWeek: 'Bu hafta kayıt yok',
    emptyAll: 'Henüz kayıt yok. Günlerin burada görünecek.',
    legend: (goal: string) => `Yeşil = ${goal} olan günlük hedefe ulaşıldı`,
    showEarlier: (hidden: number) => `Önceki günleri göster (${hidden})`,
    showEarlierA11y: (hidden: number) => `Önceki günleri göster, ${hidden} gün daha`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', bugün' : ''}: ${amount}${met ? ', hedefe ulaşıldı' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', hedefe ulaşıldı' : ''}`,
  },

  onboarding: {
    title: 'Günlük hedefini belirleyelim',
    subtitle: 'Birkaç bilgi ve içmeye hazırsın.',
    suggestedGoal: 'Önerilen günlük hedef',
    changeBelow: 'Kendi hedefini istersen aşağıdan değiştir.',
    enterWeight: 'Öneri görmek için kilonu gir.',
    goalLabel: (units: string) => `Günlük hedef (${units})`,
    goalA11y: (unitName: string) => `${unitName} cinsinden günlük hedef`,
    goalRange: (min: string, max: string, units: string) =>
      `${min} ile ${max} ${units} arasında bir hedef gir`,
    unitsLabel: 'Birimler',
    start: 'Başla',
    permissionNote:
      'Hatırlatmalar sana ulaşabilsin diye bildirim izni isteyeceğiz.',
  },

  settings: {
    title: 'Ayarlar',
    sectionGoal: 'GÜNLÜK HEDEF',
    sectionUnits: 'BİRİMLER',
    sectionSchedule: 'GÜN DÜZENİ',
    sectionCups: 'BARDAKLAR',
    sectionReminders: 'HATIRLATICILAR',
    sectionAbout: 'HAKKINDA',
    suggested: 'Önerilen',
    useSuggested: 'Öneriyi kullan',
    useSuggestedA11y: 'Önerilen hedefi kullan',
    goalLabel: 'Günlük hedef (ml)',
    goalA11y: 'Mililitre cinsinden günlük hedef',
    goalRange: (min: string, max: string) =>
      `${min} ile ${max} ml arasında bir hedef gir`,
    unitsNote: 'Miktarların nasıl gösterileceğini değiştirir. Her şey ml olarak saklanır.',
    presetSizes: 'Hazır boyutlar (ml)',
    cupA11y: (index: number) => `${index}. bardak boyutu, mililitre`,
    defaultCup: 'Varsayılan bardak',
    defaultCupA11y: (amount: string) => `Varsayılan bardak ${amount}`,
    cupNote: 'Bir hatırlatmadaki hızlı kayıt düğmesine dokunduğunda kaydedilir.',
    reminders: 'Hatırlatıcılar',
    enableInIosSettings: 'Bildirimleri iOS Ayarlar’dan aç',
    version: (version: string) => `Sürüm ${version}`,
    privacyNote: 'Verilerin bu cihazdan asla çıkmaz.',
    rate: 'Sip’i değerlendir',
    rateA11y: 'Sip’i App Store’da değerlendir',
  },

  fields: {
    weightLabel: 'Kilon (kg)',
    weightA11y: 'Kilogram cinsinden kilon',
    activityLabel: 'Aktivite düzeyi',
    sedentary: 'Hareketsiz',
    moderate: 'Orta',
    active: 'Aktif',
    wakeLabel: 'Şu saatlerde uyanırım',
    sleepLabel: 'Şu saatlerde yatarım',
    wakeA11y: (time: string) => `Uyanma saati ${time}`,
    sleepA11y: (time: string) => `Uyku saati ${time}`,
    showMl: 'Miktarları mililitre olarak göster',
    showOz: 'Miktarları ons olarak göster',
    unitNameMl: 'mililitre',
    unitNameOz: 'ons',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `${amount} kaldı`,
    done: 'Hedefe ulaşıldı',
  },

  notice: {
    paceTitle: 'Biraz yavaşla',
    paceBody: (limit: string) =>
      `Son bir saatte içtiğin su miktarı ${limit} sınırını aştı. Böbrekler saatte yalnızca yaklaşık bu kadar su atabilir; daha hızlı içmek kandaki sodyumu seyreltir. Bir dikişte içmek yerine azar azar içmek daha iyidir.`,
    paceTail: 'Baş ağrısı, mide bulantısı ya da zihin bulanıklığı mı var? Bir doktora danış.',
    dailyTitle: 'Bugün epey içtin',
    dailyBody: (total: string, low: string, high: string) =>
      `Bugün kaydettiğin su miktarı ${total} değerini aştı. Önerilerin çoğu, yiyeceklerden alınan su dahil, günde ${low} ile ${high} arasındadır — çok terlediysen daha fazlası da uygun olabilir. Bundan sonra susuzluğuna göre iç.`,
    learnMore: 'Bu neden önemli',
    learnMoreA11y: 'Bu neden önemli — bir web sayfası açar',
  },

  notifications: {
    quickLog: (amount: string) => `${amount} kaydet`,
    snooze: 'Şimdi değil (1 sa.)',
    messages: [
      ['Su vakti 💧', 'Şimdi bir bardak, gün boyu yolunda.'],
      ['Su molası', 'Küçük yudumlar, büyük fark.'],
      ['Susadın mı?', 'Şu an bir bardak su iyi gider.'],
      ['Bir yudum?', 'Vücudun bir yudum su için teşekkür eder.'],
      ['Böyle devam', 'Bugünkü hedefe sandığından daha yakınsın.'],
      ['Sip hatırlatması', 'Bir dakika ayır, biraz su iç.'],
      ['Bir bardak su', 'Şimdi bir bardak, sonra telafi etmekten iyidir.'],
      ['Ferahla', 'Biraz su çok iş görür.'],
    ] as Array<[string, string]>,
    softMessages: [
      ['Sonra yine uğrarız', 'Bir an bulduğunda, bir bardak su.'],
      ['Acele yok', 'Ne zaman uygunsa iç. Bildirimleri seyrekleştireceğiz.'],
      ['Hâlâ buradayız', 'Hazır olduğunda biraz su.'],
      ['Ufak bir dürtme', 'Yoğun bir gün mü? Hatırlatmaları seyrekleştiriyoruz.'],
    ] as Array<[string, string]>,
  },
};

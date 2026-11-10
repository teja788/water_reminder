import type { Strings } from './en';

/**
 * Hindi, polite (आप). Everyday words Indian apps already use in English
 * (रिमाइंडर, विजेट, सेटिंग्स) stay in that form: a purist word like
 * "अनुस्मारक" reads as a government form, not a phone app.
 */
export const hi: Strings = {
  tabs: {
    today: 'आज',
    history: 'इतिहास',
    settings: 'सेटिंग्स',
  },

  home: {
    remindersOff: 'रिमाइंडर बंद हैं',
    doneForToday: 'आज का लक्ष्य पूरा — अब कोई रिमाइंडर नहीं',
    nextReminder: (time: string) => `अगला रिमाइंडर लगभग ${time}`,
    noneTonight: 'आज रात और रिमाइंडर नहीं — कल फिर मिलेंगे',
  },

  bottle: {
    goalReached: 'लक्ष्य पूरा! 🎉',
    ofGoal: (goal: string) => `${goal} में से`,
    progressA11y: (total: string, goal: string) => `${goal} में से ${total}`,
  },

  log: {
    custom: 'अपनी मात्रा…',
    undoLast: 'पिछला हटाएँ',
    customTitle: 'अपनी मात्रा',
    cancel: 'रद्द करें',
    submit: 'जोड़ें',
    amountInMl: 'मात्रा मिलीलीटर में',
    amountInOz: 'मात्रा औंस में',
    logAmountA11y: (amount: string) => `${amount} जोड़ें`,
    customA11y: 'अपनी मात्रा जोड़ें',
    undoA11y: 'पिछला पानी हटाएँ',
    closeCustomA11y: 'मात्रा दर्ज करने वाला पैनल बंद करें',
    submitA11y: 'अपनी मात्रा जोड़ें',
  },

  history: {
    title: 'इतिहास',
    streak: (days: number) => `🔥 लगातार ${days} दिन`,
    noStreak: 'आज से अपनी लय शुरू करें',
    sectionWeek: 'पिछले 7 दिन',
    sectionAll: 'पूरा इतिहास',
    emptyWeek: 'इस हफ़्ते कुछ नहीं जोड़ा गया',
    emptyAll: 'अभी कुछ नहीं जोड़ा गया। जिन दिनों का रिकॉर्ड होगा, वे यहाँ दिखेंगे।',
    legend: (goal: string) => `हरा = रोज़ का लक्ष्य ${goal} पूरा`,
    showEarlier: (hidden: number) => `पहले के दिन दिखाएँ (${hidden})`,
    showEarlierA11y: (hidden: number) => `पहले के ${hidden} और दिन दिखाएँ`,
    barA11y: (date: string, amount: string, isToday: boolean, met: boolean) =>
      `${date}${isToday ? ', आज' : ''}: ${amount}${met ? ', लक्ष्य पूरा' : ''}`,
    rowA11y: (date: string, amount: string, met: boolean) =>
      `${date}: ${amount}${met ? ', लक्ष्य पूरा' : ''}`,
  },

  onboarding: {
    title: 'आइए, आपका रोज़ का लक्ष्य तय करें',
    subtitle: 'बस कुछ जानकारी, फिर आप तैयार हैं।',
    suggestedGoal: 'सुझाया गया रोज़ का लक्ष्य',
    changeBelow: 'चाहें तो नीचे अपना लक्ष्य बदलें।',
    enterWeight: 'सुझाव देखने के लिए अपना वज़न डालें।',
    goalLabel: (units: string) => `रोज़ का लक्ष्य (${units})`,
    goalA11y: (unitName: string) => `रोज़ का लक्ष्य ${unitName} में`,
    goalRange: (min: string, max: string, units: string) =>
      `${min} से ${max} ${units} के बीच लक्ष्य डालें`,
    unitsLabel: 'इकाई',
    start: 'शुरू करें',
    permissionNote: 'रिमाइंडर आप तक पहुँच सकें, इसलिए हम नोटिफ़िकेशन की अनुमति माँगेंगे।',
  },

  settings: {
    title: 'सेटिंग्स',
    sectionGoal: 'रोज़ का लक्ष्य',
    sectionUnits: 'इकाई',
    sectionSchedule: 'समय',
    sectionCups: 'गिलास',
    sectionReminders: 'रिमाइंडर',
    sectionAbout: 'ऐप के बारे में',
    suggested: 'सुझाव',
    useSuggested: 'सुझाव अपनाएँ',
    useSuggestedA11y: 'सुझाया गया लक्ष्य अपनाएँ',
    goalLabel: 'रोज़ का लक्ष्य (ml / L)',
    goalA11y: 'रोज़ का लक्ष्य मिलीलीटर में',
    goalRange: (min: string, max: string) => `${min} से ${max} ml के बीच लक्ष्य डालें`,
    unitsNote: 'सिर्फ़ मात्रा दिखाने का तरीका बदलता है। सब कुछ ml में सहेजा जाता है।',
    presetSizes: 'गिलास के साइज़ (ml)',
    cupA11y: (index: number) => `गिलास ${index} का साइज़ मिलीलीटर में`,
    defaultCup: 'डिफ़ॉल्ट गिलास',
    defaultCupA11y: (amount: string) => `डिफ़ॉल्ट गिलास: ${amount}`,
    cupNote: 'रिमाइंडर पर "जोड़ें" बटन दबाने पर यही मात्रा जुड़ती है।',
    reminders: 'रिमाइंडर',
    enableInIosSettings: 'iOS सेटिंग्स में नोटिफ़िकेशन चालू करें',
    version: (version: string) => `वर्ज़न ${version}`,
    privacyNote: 'आपका रिकॉर्ड और सेटिंग्स इसी डिवाइस पर रहते हैं। सिर्फ़ इस्तेमाल के गुमनाम आँकड़े भेजे जाते हैं।',
    rate: 'Sip को रेट करें',
    rateA11y: 'App Store पर Sip को रेट करें',
  },

  fields: {
    weightLabel: 'आपका वज़न (kg)',
    weightA11y: 'आपका वज़न किलोग्राम में',
    activityLabel: 'आप कितने सक्रिय हैं',
    sedentary: 'कम',
    moderate: 'मध्यम',
    active: 'ज़्यादा',
    wakeLabel: 'आम तौर पर उठने का समय',
    sleepLabel: 'आम तौर पर सोने का समय',
    wakeA11y: (time: string) => `उठने का समय ${time}`,
    sleepA11y: (time: string) => `सोने का समय ${time}`,
    showMl: 'मात्रा मिलीलीटर में दिखाएँ',
    showOz: 'मात्रा औंस में दिखाएँ',
    unitNameMl: 'मिलीलीटर',
    unitNameOz: 'औंस',
  },

  widget: {
    add: (amount: string) => `+${amount}`,
    toGo: (amount: string) => `${amount} बाकी`,
    done: 'लक्ष्य पूरा',
  },

  notice: {
    paceTitle: 'थोड़ा धीरे पिएँ',
    paceBody: (limit: string) =>
      `पिछले एक घंटे में ${limit} से ज़्यादा। किडनियाँ एक घंटे में लगभग इतना ही पानी निकाल पाती हैं। इससे तेज़ पीने पर खून में सोडियम का स्तर घट सकता है। एक साथ गटकने से बेहतर है धीरे-धीरे पीना।`,
    paceTail: 'सिरदर्द, जी मिचलाना या उलझन महसूस हो रही है? डॉक्टर से बात करें।',
    dailyTitle: 'आज काफ़ी पानी हो गया',
    dailyBody: (total: string, low: string, high: string) =>
      `आज ${total} से ज़्यादा जोड़ा गया। ज़्यादातर दिशानिर्देशों में रोज़ का कुल पानी ${low} से ${high} बताया गया है, जिसमें खाने से मिलने वाला पानी भी शामिल है — बहुत पसीना आया हो तो ज़रूरत ज़्यादा हो सकती है। अब प्यास के हिसाब से पिएँ।`,
    learnMore: 'यह क्यों ज़रूरी है',
    learnMoreA11y: 'यह क्यों ज़रूरी है — वेब पेज खुलेगा',
  },

  notifications: {
    quickLog: (amount: string) => `${amount} जोड़ें`,
    snooze: 'अभी नहीं (1 घंटा)',
    messages: [
      ['पानी का समय 💧', 'अभी एक गिलास, और आप सही राह पर।'],
      ['पानी पिया आपने?', 'एक घूँट लीजिए, शरीर शुक्रिया कहेगा।'],
      ['पानी ब्रेक', 'छोटे घूँट, बड़ा फ़र्क।'],
      ['प्यास लगी?', 'अभी एक गिलास पानी बढ़िया रहेगा।'],
      ['बस ऐसे ही चलते रहें', 'आज का लक्ष्य आपकी सोच से ज़्यादा पास है।'],
      ['Sip रिमाइंडर', 'एक पल रुकिए — थोड़ा पानी पी लीजिए।'],
      ['पानी का वक़्त', 'अभी एक गिलास पी लीजिए, बाद में कमी पूरी नहीं करनी पड़ेगी।'],
      ['ताज़गी बनाए रखें', 'थोड़ा सा पानी, बड़ा असर।'],
    ],
    softMessages: [
      ['बाद में याद दिलाएँगे', 'जब फ़ुर्सत मिले, एक गिलास पानी।'],
      ['कोई जल्दी नहीं', 'जब मन हो तब पिएँ। हम बार-बार रिमाइंडर नहीं भेजेंगे।'],
      ['हम यहीं हैं', 'थोड़ा पानी, जब आप तैयार हों।'],
      ['हल्की सी याद', 'आज व्यस्त हैं? हम रिमाइंडर कम कर देंगे।'],
    ],
  },
};

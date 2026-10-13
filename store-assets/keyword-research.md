# Keyword research — 1.2.0 listings (2026-10-14)

Method: `app-store-scraper` `suggest` (autocomplete = demand) on 3–8 seed terms
per storefront, plus one `search` per key phrase (median rating count of the
top 10 = competition). Raw caches lived in the session scratchpad
(`suggest.json`, `search.json`), so they are gone now. Names were checked
against `itunes.apple.com/search` for exact and near-exact duplicates.
That check is not proof: ASC only confirms uniqueness on `push`.

Rules applied: name/subtitle ≤30 chars, keywords ≤100 UTF-8 bytes with no
spaces and no words repeated from that locale's name or subtitle. Each
locale's descriptions name the localized UI buttons ("Añadir 250 ml" and so
on). **If a catalog in `src/i18n/` changes `notifications.quickLog` or
`snooze`, update these listings to match.**

Competition (median ratings, top 10): nl 92 · kr 123 · mx 267 · es 560 ·
tr 1,082 · it 1,149 · jp 1,259 · fr 1,354 · pl 1,844–2,348 · in 2,084 ·
tw 2,544 · gb 2,831 · de 5,495 · br 7,225–12,794. The weakest markets
(nl, kr, mx, es) are where a new listing can rank fastest.

| Locale | Top autocomplete demand | Chosen name / subtitle cover | Keywords add | Fallback name |
|---|---|---|---|---|
| en-GB (UK, India, several EU stores) | drink water reminder, water reminder, hydration tracker, water tracker widget | drink water reminder · hydration tracker · water log | litre, daily, notify, widget, goal, drinking, counter, diary, journal, timer, routine, wellness, fitness, liquid. Kept clear of every en-US term, as asked. | Sip: Water Reminder & Tracker |
| de-DE | trinkerinnerung (kostenlos), wasser trinken erinnerung, wassertracker, wasserzähler | Trinkerinnerung · Tracker · wasser trinken erinnerung | wassertracker, wasserzähler, trinkwasser, trinkmenge, hydration, kostenlos, widget, glas, flasche, liter | Sip: Wasser trinken Erinnerung is **taken** (another "Sip" app holds it). Use Sip: Trink-Erinnerung & Log |
| es-MX | recordatorio de tomar agua, tomar agua, beber agua recordatorio | recordatorio de agua (live name, kept) · tomar/beber agua | hidratación, rastreador, registro, contador, meta, litros, botella, vaso, hábito, racha, alarma, aviso, widget | live name, no change |
| es-ES | recordatorio para beber agua, beber agua, aplicación beber agua | Aviso para Beber Agua · control de hidratación | recordatorio, registro, contador, meta, litros, botella, vaso, hábito, racha, alarma, widget, gratis | Sip: Recordatorio Beber Agua is **taken** (id 6757387389). Use Sip: Beber Agua sin Agobios |
| fr-FR | boire de l'eau, rappel eau, rappel boire de l'eau, suivi hydratation | rappel d'eau et suivi (live) · boire de l'eau · hydratation | traqueur, compteur, objectif, litre, verre, bouteille, habitude, série, santé, widget, gratuit, alarme, soif | live name, no change |
| pt-BR | beber água, lembrete de beber agua, lembrete de água, hidratação | Lembrete de Beber Água (live) · controle hidratação diária | lembretes, alarme, registro, contador, meta, litros, garrafa, copo, hábito, sequência, saúde, widget, grátis | live name, no change |
| it | bere acqua promemoria (gratis), promemoria acqua, bevi acqua | Bevi Acqua – Promemoria · idratazione | tracker, contatore, obiettivo, litri, bottiglia, bicchiere, abitudine, serie, salute, widget, gratis, sete, bere | Sip - Bere Acqua Promemoria already exists, so ours was changed. Fallback: Sip: Promemoria per l'acqua |
| nl-NL | water drinken (reminder/herinnering/tracker), water herinnering | Water Drinken Herinnering · drinkwater tracker, logboek | hydratatie, reminder, teller, doel, liter, fles, glas, gewoonte, reeks, gezondheid, widget, gratis, dorst | Sip: Water drinken & reminder |
| pl | przypomnienie o piciu wody, przypomnienie o wodzie, pij wodę, nawodnienie | Przypomnienie o wodzie · pij wodę, nawodnienie | picie, piciu, wody, woda, tracker, licznik, cel, litry, butelka, szklanka, nawyk, zdrowie, widget, pragnienie | Sip: Pij wodę – przypomnienie |
| tr | su içme hatırlatıcı (ücretsiz), su içme takibi, su hatırlatıcısı | Su İçme Hatırlatıcı · su takibi, günlük hedef | hatırlatıcısı, sayacı, ücretsiz, alarm, bildirim, litre, şişe, bardak, alışkanlık, sağlık, widget | Sip: Su Hatırlatıcı & Takip |
| ja | 水分補給 (アプリ/リマインダー/記録), 水分摂取量 | 水分補給・飲水リマインダー · 水を飲む習慣・摂取量・記録 | お知らせ, 通知, アラーム, ウィジェット, 健康, 目標, 無料, ドリンク | Sip - 水分補給リマインダー already exists, so ours was changed. Fallback: Sip: 水分補給の記録と通知 |
| ko | 물 마시기 (알림), 물 알림, 수분 섭취, 음수량 | 물 마시기 알리미 · 수분 섭취 기록, 물 트래커 | 물마시기, 알림, 알람, 음수량, 수분섭취, 리마인더, 위젯, 건강, 습관, 목표, 무료 | Sip - 물 마시기 알림 already exists, so ours was changed. Fallback: Sip: 물마시기 알림 & 기록 |
| zh-Hant (TW, HK) | 喝水提醒, 喝水紀錄, 喝水時間, 飲水紀錄/追蹤 | 喝水提醒與紀錄 · 每日飲水追蹤，補充水分 | 喝水時間, 鬧鐘, 水量, 補水, 健康, 習慣, 目標, 小工具, 免費, 減肥 | Sip - 喝水提醒・飲水紀錄 |

Notes
- es-MX, fr-FR, pt-BR, ko and zh-Hant are also indexed in the US store. They
  used to carry English padding, but each is now a native field. "widget",
  which en-US lacks, rides in all of them.
- fr-FR copy moved from *vous* to *tu* so it matches the app UI.
- The "this app is English only" lines were dropped from es-MX and fr-FR.
  The UI is translated now.
- en-US: only whatsNew changed. Its description still says "animated glass"
  where the app now shows a bottle. The translations say bottle. Fix en-US
  on the next push if wanted.

/* ==========================================================================
   L'Obsidienne — i18n (zh-Hant / en)
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'obsidian-locale';
  const SUPPORTED = ['zh-Hant', 'en'];

  const dict = {
    'zh-Hant': {
      meta_title: "L'Obsidienne Palace · DEMO",
      meta_description: 'DEMO — L\'Obsidienne Palace 虛構旅館展示頁。不可真實預訂。',
      demo_banner: 'DEMO · 虛構旅館展示頁 · 不可真實預訂',
      nav_home: '首頁',
      footer_privacy: '隱私',
      footer_terms: '條款',
      err404_doc_title: "404 · L'Obsidienne Palace · DEMO",
      err404_title: '此頁不存在',
      err404_lede: '連結可能已變更，或路徑輸入有誤。這是虛構旅館 DEMO，沒有其他公開分館頁',
      err404_cta: '回到首頁',
      privacy_doc_title: "隱私 · L'Obsidienne Palace · DEMO",
      privacy_title: '隱私說明',
      privacy_lede: '本頁屬於虛構旅館 DEMO，不是真實營運網站',
      privacy_h1: '資料蒐集',
      privacy_p1: '預訂表單僅在瀏覽器內運算與顯示憑證，不會送到伺服器，也不會建立真實訂單或付款',
      privacy_h2: '本機儲存',
      privacy_p2: '語系偏好可能寫入 localStorage，僅供此 DEMO 記住介面語言，可隨時清除瀏覽器資料',
      privacy_h_cookies: 'Cookie',
      privacy_p_cookies: '首次造訪會顯示 Cookie 列。同意後寫入 lob_consent（約 180 天）與本機備份，僅記錄「接受／僅必要」。本 DEMO 不投放廣告、不做跨站追蹤',
      cookie_title: 'Cookie 偏好',
      cookie_text: '本 DEMO 使用必要 Cookie 與本機儲存以記住語系與同意狀態。無追蹤廣告、無真實訂房後端',
      cookie_privacy: '隱私說明',
      cookie_essential: '僅必要',
      cookie_accept: '接受',
      privacy_h3: '第三方資源',
      privacy_p3: '頁面會載入 Google Fonts 與 CDN 上的 Three.js／GSAP。這些第三方可能依其自身政策處理連線紀錄',
      privacy_h4: '其他說明',
      privacy_p4: '本 DEMO 無客服信箱、無真實會員系統。政策細節以本頁與授權全文為準',
      privacy_link_site: '隱私說明',
      terms_doc_title: "條款 · L'Obsidienne Palace · DEMO",
      terms_title: '使用條款',
      terms_lede: 'L\'Obsidienne Palace 為互動展示 DEMO，品牌、房型與價格皆屬虛構',
      terms_h1: '示範性質',
      terms_p1: '本站不提供真實住宿、餐飲、接送或付款。畫面上的「預訂憑證」僅為前端產生的展示碼',
      terms_h2: '智慧財產',
      terms_p2: '本專案以 MIT 授權釋出。詳見授權全文',
      terms_h3: '免責',
      terms_p3: 'DEMO 可能隨時變更或下線。作者不對使用本頁造成的任何損失負責，也不保證內容正確或持續可用',
      terms_h4: '相關連結',
      terms_link_site: '使用條款',
      webgl_fallback: '此裝置無法顯示 3D 場景，內容仍可正常瀏覽',
      aria_home: '回到首頁',
      aria_nav: '主要導覽',
      aria_lang: '切換為 English',
      aria_tools: '工具',
      aria_sound_off: '開啟聲景',
      aria_sound_on: '關閉聲景',
      aria_currency: '切換幣別',
      aria_menu_open: '開啟選單',
      aria_menu_close: '關閉選單',
      aria_suite_filter: '套房篩選',
      aria_close_suite: '關閉套房細節',
      aria_close_pass: '關閉憑證',
      nav_about: '關於',
      nav_suites: '套房',
      nav_atelier: '石材工藝',
      nav_dining: '餐飲',
      nav_book: '預訂',
      hero_copy: 'Nero Marquina 黑石，光緩慢掠過金脈',
      hero_cta: '查看套房',
      intro_title: '以石材寫成的旅館',
      intro_quote: '不必多餘裝飾。光線掠過切面時，金脈自己會說話',
      intro_stat_quarry: '原礦',
      intro_stat_quarry_v: '畢爾包',
      intro_stat_vein: '金脈',
      intro_stat_vein_v: '24K 嵌縫',
      intro_stat_suites: '套房',
      intro_stat_suites_v: '28 間',
      intro_stat_dining: '餐廳',
      intro_stat_dining_v: '三星',
      suites_title: '三間不同節奏的黑曜套房',
      suites_lede: '頂層、水療、整石浴殿——挑選適合此行步調的一間',
      filter_all: '全部',
      filter_penthouse: '頂層',
      filter_pool: '湯池',
      filter_royal: '浴殿',
      suite_detail: '細節',
      suite_book: '預訂',
      suite_per_night: '/ 晚',
      suite_nightly: '每晚',
      suite_select: '選入預訂',
      atelier_title: '石材工藝，跟著滾動展開',
      atelier_lede: '點選下方節點，背景的黑曜結構會緩緩轉向、解構，對應每一道工序',
      hotspot_0: '西班牙 Nero Marquina 原石',
      hotspot_1: '24K 金箔嵌縫',
      hotspot_2: '八道鏡面拋光',
      hotspot_3: '靜音與地暖夾層',
      theme_nero: '黑曜金脈',
      theme_verde: '帝王翠玉',
      theme_liquid: '流金',
      explode: '解構幾何',
      explode_on: '還原幾何',
      orbit: '近距鑑賞',
      orbit_on: '結束鑑賞',
      dining_title: '黑曜石柱下的晚餐',
      dining_lede: '七米整石圓柱環抱餐廳，侍酒師藏著一千八百款年份酒，每晚只接待二十四席',
      dining_note1_t: '黑松露八道式',
      dining_note1_d: '佩里戈爾黑松露與熟成和牛',
      dining_note2_t: '午夜開瓶',
      dining_note2_d: 'Dom Pérignon P2 私人酒窖',
      dining_cta: '一併預訂晚宴',
      dining_img_alt: 'Le Salon Noir 餐廳內景',
      book_title: '私人禮賓預訂',
      book_lede: '選擇套房與加購項目，即時試算總額並取得入住憑證碼',
      label_name: '貴賓姓名',
      label_date: '入住日期',
      label_suite: '套房',
      label_nights: '晚數',
      label_guests: '人數',
      label_addons: '加購項目',
      label_notes: '特別吩咐（選填）',
      err_name: '請填寫貴賓姓名',
      err_date: '請選擇有效入住日期',
      night_1: '1 晚',
      night_2: '2 晚',
      night_3: '3 晚',
      night_5: '5 晚',
      guest_1: '1 位',
      guest_2: '2 位',
      guest_3: '3 位',
      guest_4: '4 位',
      summary_title: '試算摘要',
      summary_suite: '套房',
      summary_trip: '行程',
      summary_room: '套房小計',
      summary_addon: '加購小計',
      summary_total: '預估總額',
      summary_submit: '取得預訂憑證',
      summary_submitting: '產生憑證中…',
      summary_note: '免收訂金 · 入住前 48 小時可調整',
      trip_line: '{nights} 晚 · {guests} 位貴賓',
      footer_top: '回頂部',
      footer_license: '授權',
      pass_label: 'Private Pass',
      pass_title: '預訂憑證',
      pass_guest: '貴賓',
      pass_checkin: '入住',
      pass_suite: '套房',
      pass_notes: '備註',
      pass_none: '無',
      pass_total: '總額',
      pass_copy: '複製憑證碼',
      pass_copied: '已複製 · {code}',
      pass_copy_fail: '請手動複製 · {code}',
      pass_stay: '{date} · {nights} 晚 · {guests} 位',
      guest_fallback: '貴賓',
      sound_on_label: '聲景 · 開',
      // suites
      suite_penthouse_cat: '天際頂層',
      suite_penthouse_name: '黑曜金脈天際頂層閣樓',
      suite_penthouse_sub: 'Nero Marquina Sky Penthouse',
      suite_penthouse_guests: '最多 4 位',
      suite_penthouse_desc: '88 樓頂層，整面 Nero Marquina 主牆與金箔嵌縫，270 度景觀玻璃、恆溫酒窖，並配備專屬管家',
      suite_penthouse_f1: 'Nero Marquina 鏡面主牆與壁爐',
      suite_penthouse_f2: '私人管家與機場接送安排',
      suite_penthouse_f3: '劇院級聲學系統與特大床',
      suite_penthouse_f4: '空中露台與香檳雪茄吧',
      suite_pool_cat: '私密湯池',
      suite_pool_name: '流金縞瑪瑙無邊際湯池套房',
      suite_pool_sub: 'Backlit Onyx Pool',
      suite_pool_guests: '最多 2 位',
      suite_pool_desc: '14 米室內無邊際溫水池，對面是透光黃金縞瑪瑙牆，水波會把金脈折進天花板',
      suite_pool_f1: '黑大理石恆溫無邊際礦物溫泉池',
      suite_pool_f2: '透光黃金縞瑪瑙光影牆',
      suite_pool_f3: '雙人芳療室與冥想茶席',
      suite_pool_f4: '每晚雙人微醺香檳儀式',
      suite_royal_cat: '整石浴殿',
      suite_royal_name: '皇家黑曜整石浴殿套房',
      suite_royal_sub: 'Monolith Bath Suite',
      suite_royal_guests: '最多 3 位',
      suite_royal_desc: '五米黑曜拱窗與雙面壁爐貫穿起居與浴室，中央是三噸整石鑿成的浸泡浴缸',
      suite_royal_f1: '整塊黑曜石手工鑿刻深泡浴缸',
      suite_royal_f2: '高織數寢具與羊絨披毯',
      suite_royal_f3: '專屬沐浴香氛禮盒',
      suite_royal_f4: '行政酒廊香檳與下午茶',
      // atelier
      at0_title: '西班牙畢爾包 Nero Marquina 原石',
      at0_sub: 'Basque Country Quarry Monolith',
      at0_desc: '嚴選自西班牙北部巴斯克礦脈的高密度黑色方解石原礦，底色如午夜墨淵，天然金白脈絡每一塊皆為孤品',
      at0_m1: '莫氏硬度與抗壓強度',
      at0_m2: '鏡面反射光澤度',
      at0_m3: '金脈天然紋理稀有度',
      at1_title: '24K 香檳金箔手工嵌縫工藝',
      at1_sub: 'Artisanal Kintsugi Gold Inlay',
      at1_desc: '順應大理石天然裂隙，以 24K 純金與鍛造黃銅條進行微米級鑲嵌，隨光線角度折射金輝',
      at1_m1: '金箔純度與色澤穩定度',
      at1_m2: '接縫微米級平整公差',
      at1_m3: '動態光影漫反射層次',
      at2_title: '八道雙曲率水刀鏡面拋光',
      at2_sub: 'Eight-Stage Diamond Mirror Honing',
      at2_desc: '五軸水刀切割與八道鑽石研磨，使石材呈現深邃光澤，觸感溫潤並具備疏水抗指紋特性',
      at2_m1: '表面絲滑觸感指數',
      at2_m2: '光線折射深邃感',
      at2_m3: '防潮抗蝕耐久度',
      at3_title: '靜音聲學腔體與地暖導熱層',
      at3_sub: 'Acoustic Sanctuary & Thermal Core',
      at3_desc: '石板後方配置蜂巢吸音阻尼與毛細管恆溫水循環，維持約 26°C 溫潤觸感並隔絕外界喧囂',
      at3_m1: 'STC 68 隔音表現',
      at3_m2: '恆溫蓄熱效率',
      at3_m3: '室內靜謐深眠指數',
      addon_rr: '機場專屬禮車接送',
      addon_michelin: '主廚八道式黑松露私宴（雙人）',
      addon_spa: '午夜溫泉私人包場與開瓶儀式',
      addon_wine: '侍酒師迎賓酒與魚子醬禮',
      notes_default: '準備 1996 年份香檳、黑琥珀香氛與低敏鵝絨枕'
    },
    en: {
      meta_title: "L'Obsidienne Palace · DEMO",
      meta_description: "DEMO — Fictional L'Obsidienne Palace showcase. Not a real booking site.",
      demo_banner: 'DEMO · Fictional hotel showcase · Not a real booking',
      nav_home: 'Home',
      footer_privacy: 'Privacy',
      footer_terms: 'Terms',
      err404_doc_title: "404 · L'Obsidienne Palace · DEMO",
      err404_title: 'Page not found',
      err404_lede: 'The link may have moved, or the path is wrong. This fictional hotel DEMO has no other public branches',
      err404_cta: 'Back to home',
      privacy_doc_title: "Privacy · L'Obsidienne Palace · DEMO",
      privacy_title: 'Privacy note',
      privacy_lede: 'This page is a fictional hotel DEMO, not a live hotel site',
      privacy_h1: 'Data collection',
      privacy_p1: 'The booking form runs only in your browser to show a pass code. Nothing is sent to a server, and no real order or payment is created',
      privacy_h2: 'Local storage',
      privacy_p2: 'Locale preference may be saved in localStorage for this DEMO only. You can clear browser data anytime',
      privacy_h_cookies: 'Cookies',
      privacy_p_cookies: 'A cookie bar appears on first visit. After you choose, we set lob_consent (about 180 days) plus a local backup — only “accept / essential”. This DEMO has no ads and no cross-site tracking',
      cookie_title: 'Cookie preferences',
      cookie_text: 'This DEMO uses essential cookies and local storage to remember locale and consent. No ad tracking, no real booking backend',
      cookie_privacy: 'Privacy note',
      cookie_essential: 'Essential only',
      cookie_accept: 'Accept',
      privacy_h3: 'Third-party assets',
      privacy_p3: 'The page loads Google Fonts and Three.js / GSAP from CDNs. Those providers may process connection logs under their own policies',
      privacy_h4: 'Other notes',
      privacy_p4: 'This DEMO has no support inbox and no real accounts. Policy details are on this page and in the license',
      privacy_link_site: 'Privacy note',
      terms_doc_title: "Terms · L'Obsidienne Palace · DEMO",
      terms_title: 'Terms of use',
      terms_lede: "L'Obsidienne Palace is an interactive DEMO. Brand, suites, and prices are fictional",
      terms_h1: 'Demo only',
      terms_p1: 'This site does not offer real stays, dining, transfers, or payments. On-screen pass codes are client-generated samples only',
      terms_h2: 'Intellectual property',
      terms_p2: 'This project is released under the MIT License. See the full license text',
      terms_h3: 'Disclaimer',
      terms_p3: 'The DEMO may change or go offline anytime. The author is not liable for any loss from using this page, and makes no warranty of accuracy or availability',
      terms_h4: 'Related links',
      terms_link_site: 'Terms',
      webgl_fallback: '3D is unavailable on this device. You can still browse the page',
      aria_home: 'Back to home',
      aria_nav: 'Primary navigation',
      aria_lang: 'Switch to 繁體中文',
      aria_tools: 'Tools',
      aria_sound_off: 'Enable soundscape',
      aria_sound_on: 'Mute soundscape',
      aria_currency: 'Toggle currency',
      aria_menu_open: 'Open menu',
      aria_menu_close: 'Close menu',
      aria_suite_filter: 'Suite filters',
      aria_close_suite: 'Close suite details',
      aria_close_pass: 'Close pass',
      nav_about: 'About',
      nav_suites: 'Suites',
      nav_atelier: 'Atelier',
      nav_dining: 'Dining',
      nav_book: 'Book',
      hero_copy: 'Nero Marquina stone, light moving slowly across the veins',
      hero_cta: 'View suites',
      intro_title: 'A hotel written in stone',
      intro_quote: 'No extra ornament. When light crosses the cut, the veins speak',
      intro_stat_quarry: 'Quarry',
      intro_stat_quarry_v: 'Bilbao',
      intro_stat_vein: 'Vein',
      intro_stat_vein_v: '24K inlay',
      intro_stat_suites: 'Suites',
      intro_stat_suites_v: '28 rooms',
      intro_stat_dining: 'Dining',
      intro_stat_dining_v: 'Three stars',
      suites_title: 'Three suites, three tempos',
      suites_lede: 'Penthouse, pool, or carved bath — choose the pace for this stay',
      filter_all: 'All',
      filter_penthouse: 'Penthouse',
      filter_pool: 'Pool',
      filter_royal: 'Bath',
      suite_detail: 'Details',
      suite_book: 'Book',
      suite_per_night: '/ night',
      suite_nightly: 'Per night',
      suite_select: 'Add to booking',
      atelier_title: 'Marble craft, revealed as you scroll',
      atelier_lede: 'Select a node and the monolith turns, opens, and matches each step',
      hotspot_0: 'Nero Marquina from Spain',
      hotspot_1: '24K gold inlay',
      hotspot_2: 'Eight-stage polish',
      hotspot_3: 'Acoustic & radiant layer',
      theme_nero: 'Nero gold',
      theme_verde: 'Royal verde',
      theme_liquid: 'Liquid gold',
      explode: 'Explode',
      explode_on: 'Restore',
      orbit: 'Inspect',
      orbit_on: 'End inspect',
      dining_title: 'Dinner under obsidian columns',
      dining_lede: 'Seven-meter monolith columns enclose the room. Eighteen hundred wines. Twenty-four seats a night',
      dining_note1_t: 'Black truffle tasting',
      dining_note1_d: 'Périgord truffle and aged wagyu',
      dining_note2_t: 'Midnight sabrage',
      dining_note2_d: 'Dom Pérignon P2 cellar',
      dining_cta: 'Add dinner to booking',
      dining_img_alt: 'Interior of Le Salon Noir',
      book_title: 'Private concierge booking',
      book_lede: 'Choose a suite and add-ons, see the total, and receive a pass code',
      label_name: 'Guest name',
      label_date: 'Check-in',
      label_suite: 'Suite',
      label_nights: 'Nights',
      label_guests: 'Guests',
      label_addons: 'Add-ons',
      label_notes: 'Special notes (optional)',
      err_name: 'Please enter a guest name',
      err_date: 'Please choose a valid date',
      night_1: '1 night',
      night_2: '2 nights',
      night_3: '3 nights',
      night_5: '5 nights',
      guest_1: '1 guest',
      guest_2: '2 guests',
      guest_3: '3 guests',
      guest_4: '4 guests',
      summary_title: 'Summary',
      summary_suite: 'Suite',
      summary_trip: 'Stay',
      summary_room: 'Room subtotal',
      summary_addon: 'Add-ons',
      summary_total: 'Estimated total',
      summary_submit: 'Get pass code',
      summary_submitting: 'Creating pass…',
      summary_note: 'No deposit · Free changes until 48 hours before arrival',
      trip_line: '{nights} nights · {guests} guests',
      footer_top: 'Top',
      footer_license: 'License',
      pass_label: 'Private Pass',
      pass_title: 'Booking pass',
      pass_guest: 'Guest',
      pass_checkin: 'Stay',
      pass_suite: 'Suite',
      pass_notes: 'Notes',
      pass_none: 'None',
      pass_total: 'Total',
      pass_copy: 'Copy pass code',
      pass_copied: 'Copied · {code}',
      pass_copy_fail: 'Copy manually · {code}',
      pass_stay: '{date} · {nights} nights · {guests} guests',
      guest_fallback: 'Guest',
      sound_on_label: 'Sound on',
      suite_penthouse_cat: 'Sky penthouse',
      suite_penthouse_name: 'Nero Marquina Sky Penthouse',
      suite_penthouse_sub: 'Nero Marquina Sky Penthouse',
      suite_penthouse_guests: 'Up to 4 guests',
      suite_penthouse_desc: 'Floor 88 with a Nero Marquina wall, gold inlay, 270° glass, a cellar, and a private butler',
      suite_penthouse_f1: 'Nero Marquina wall and fireplace',
      suite_penthouse_f2: 'Butler and airport transfer',
      suite_penthouse_f3: 'Theatre sound and a large bed',
      suite_penthouse_f4: 'Sky terrace and champagne bar',
      suite_pool_cat: 'Private pool',
      suite_pool_name: 'Backlit Onyx Pool Suite',
      suite_pool_sub: 'Backlit Onyx Pool',
      suite_pool_guests: 'Up to 2 guests',
      suite_pool_desc: 'A 14 m indoor infinity pool facing a backlit onyx wall — light folds into the ceiling',
      suite_pool_f1: 'Heated black-marble infinity pool',
      suite_pool_f2: 'Backlit golden onyx wall',
      suite_pool_f3: 'Private spa room and tea seat',
      suite_pool_f4: 'Nightly champagne ritual for two',
      suite_royal_cat: 'Carved bath',
      suite_royal_name: 'Royal Monolith Bath Suite',
      suite_royal_sub: 'Monolith Bath Suite',
      suite_royal_guests: 'Up to 3 guests',
      suite_royal_desc: 'Five-meter arches and a double fireplace; a three-ton carved soaking tub at the center',
      suite_royal_f1: 'Hand-carved monolith soaking tub',
      suite_royal_f2: 'High-count linens and cashmere',
      suite_royal_f3: 'Private bath fragrance set',
      suite_royal_f4: 'Club lounge champagne and tea',
      at0_title: 'Nero Marquina from Bilbao',
      at0_sub: 'Basque Country Quarry Monolith',
      at0_desc: 'Dense black calcite from the Basque veins — midnight ground with rare gold-white crystal lines',
      at0_m1: 'Hardness & compressive strength',
      at0_m2: 'Mirror gloss',
      at0_m3: 'Vein rarity',
      at1_title: '24K champagne gold inlay',
      at1_sub: 'Artisanal Kintsugi Gold Inlay',
      at1_desc: 'Following natural fissures, 24K gold and brass are set to micron tolerance and catch light as it moves',
      at1_m1: 'Gold purity & color stability',
      at1_m2: 'Joint flatness tolerance',
      at1_m3: 'Diffuse light layers',
      at2_title: 'Eight-stage mirror polish',
      at2_sub: 'Eight-Stage Diamond Mirror Honing',
      at2_desc: 'Five-axis waterjet and eight diamond passes leave a deep polish with a soft, hydrophobic touch',
      at2_m1: 'Surface touch index',
      at2_m2: 'Light depth',
      at2_m3: 'Moisture & wear resistance',
      at3_title: 'Acoustic cavity & radiant layer',
      at3_sub: 'Acoustic Sanctuary & Thermal Core',
      at3_desc: 'Honeycomb damping and capillary heating behind each slab hold about 26°C and keep the room quiet',
      at3_m1: 'STC 68 isolation',
      at3_m2: 'Thermal retention',
      at3_m3: 'Sleep quiet index',
      addon_rr: 'Private airport transfer',
      addon_michelin: 'Eight-course truffle dinner (two)',
      addon_spa: 'Midnight private pool & sabrage',
      addon_wine: 'Sommelier welcome wine & caviar',
      notes_default: '1996 champagne, black-amber scent, hypoallergenic pillows'
    }
  };

  function detectLocale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch (err) {
      /* ignore */
    }
    const nav = (navigator.language || '').toLowerCase();
    if (nav.startsWith('zh')) return 'zh-Hant';
    return 'en';
  }

  let locale = detectLocale();
  const listeners = [];

  function t(key, vars) {
    const table = dict[locale] || dict['zh-Hant'];
    let value = table[key] != null ? table[key] : (dict.en[key] != null ? dict.en[key] : key);
    if (vars) {
      Object.keys(vars).forEach((k) => {
        value = String(value).replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return value;
  }

  function applyAttr(el, attr, value) {
    if (attr === 'text') {
      el.textContent = value;
      return;
    }
    if (attr === 'html') {
      el.innerHTML = value;
      return;
    }
    el.setAttribute(attr, value);
  }

  function apply() {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-Hant';
    const titleKey = document.documentElement.getAttribute('data-i18n-title-key') || 'meta_title';
    document.title = t(titleKey);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t('meta_description'));

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      applyAttr(el, 'text', t(key));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });

    // option elements
    document.querySelectorAll('option[data-i18n]').forEach((el) => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.setAttribute('aria-label', t('aria_lang'));
      langBtn.setAttribute('title', t('aria_lang'));
      langBtn.dataset.locale = locale;
      const badge = langBtn.querySelector('.lang-badge');
      if (badge) badge.textContent = locale === 'en' ? '中' : 'EN';
    }

    listeners.forEach((fn) => {
      try {
        fn(locale);
      } catch (err) {
        /* ignore listener errors */
      }
    });

    document.dispatchEvent(new CustomEvent('obsidian:localechange', { detail: { locale } }));
  }

  function setLocale(next) {
    if (!SUPPORTED.includes(next) || next === locale) return;
    locale = next;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch (err) {
      /* ignore */
    }
    apply();
  }

  function toggle() {
    setLocale(locale === 'en' ? 'zh-Hant' : 'en');
  }

  function onChange(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  window.ObsidianI18n = {
    t,
    apply,
    setLocale,
    toggle,
    onChange,
    get locale() {
      return locale;
    },
    getSuite(id) {
      const map = {
        'obsidian-penthouse': 'penthouse',
        'imperial-onyx-pool': 'pool',
        'royal-sovereign-marble': 'royal'
      };
      const k = map[id];
      if (!k) return null;
      return {
        categoryLabel: t('suite_' + k + '_cat'),
        name: t('suite_' + k + '_name'),
        subtitle: t('suite_' + k + '_sub'),
        guests: t('suite_' + k + '_guests'),
        description: t('suite_' + k + '_desc'),
        features: [1, 2, 3, 4].map((n) => t('suite_' + k + '_f' + n))
      };
    },
    getHotspot(index) {
      const i = index;
      return {
        title: t('at' + i + '_title'),
        subtitle: t('at' + i + '_sub'),
        desc: t('at' + i + '_desc'),
        metrics: [
          { label: t('at' + i + '_m1') },
          { label: t('at' + i + '_m2') },
          { label: t('at' + i + '_m3') }
        ]
      };
    },
    getAddonName(id) {
      const map = {
        'rolls-royce': 'addon_rr',
        'michelin-tasting': 'addon_michelin',
        'midnight-spa': 'addon_spa',
        'sommelier-caviar': 'addon_wine'
      };
      return t(map[id] || id);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    apply();
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        toggle();
        if (typeof ScrollTrigger !== 'undefined') {
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      });
    }
  });
})();

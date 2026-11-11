/* Scopes derive from the existing curated directory, not an independent site list.
   Discussion URLs often live outside category paths, so use the listed host.
   Reddit and Telegram remain limited to the curated community/thread paths. */
const ZrvSearch = (() => {
  function scopes(sources) {
    return [...new Set(sources.map(source => {
      const u = new URL(source.url);
      if (u.hostname === 'www.reddit.com' || u.hostname === 't.me') return u.hostname + u.pathname;
      if (u.hostname === 'www.honda.co.jp') return u.hostname + '/usersvoice/';
      return u.hostname;
    }))];
  }
  function terms(query, model) {
    // Treat input as ordinary words; do not accept query operators that widen scope.
    const words = query.match(/[\p{L}\p{N}\p{M}_-]+/gu) || [];
    if (!words.length) return '';
    return (model === 'hrv' ? '("HR-V" OR "HRV")' : '("ZR-V" OR "ZRV" OR "致在")') + ' ' + words.slice(0, 12).map(w => '"' + w + '"').join(' ');
  }
  function links(query, model, selected, lang) {
    const q = terms(query, model);
    if (!q || !selected.length) return [];
    const result = [];
    // Three scopes per URL keeps Google's query length manageable.
    for (let i = 0; i < selected.length; i += 3) {
      const group = selected.slice(i, i + 3);
      const url = new URL('https://www.google.com/search');
      url.searchParams.set('q', q + ' (' + group.map(s => 'site:' + s).join(' OR ') + ')');
      url.searchParams.set('hl', lang);
      result.push({ url: url.href, scopes: group });
    }
    return result;
  }
  return { scopes, terms, links };
})();
if (typeof module !== 'undefined') module.exports = ZrvSearch;
if (typeof document !== 'undefined') (() => {
  const $ = id => document.getElementById(id);
  const scopes = ZrvSearch.scopes(SOURCES);
  const cx = (window.ZRV_SEARCH_CONFIG?.cx || '').trim();
  let ready = false, failed = false, submitted = false;
  const messages = {
    en: {
      fallbackTitle:'Alternative: search on Google in site-filtered groups', searchNav:'ZR-V search engine', engineTitle:'Honda ZR-V search engine',
      engineIntro:'Search the curated owners’ sources. Use Arabic, English, Japanese or Chinese terms; queries are not translated automatically.',
      queryLabel:'What are you looking for? (up to 12 words)', modelLabel:'Vehicle focus', scopeLabel:'Search scope', engineSubmit:'Search',
      engineCaution:'The Google fallback opens external results in small site-filtered groups. Filters are best-effort, not a guaranteed allowlist; ads and unindexed/private posts are not covered. HR-V results may include other generations: verify 2023+ and the engine. A report does not establish warranty coverage.',
      scopeSummary:'Included sources and limits', scopeNote:'Scopes come from the existing directory. Most cover the listed host, including other models; vehicle terms narrow relevance. Reddit is limited to the listed community/threads, Telegram to its listed group and Honda to User’s Voice. Blog directory pages do not automatically include blogs hosted elsewhere.',
      scopeDownload:'Download Google inclusion patterns', engineSetup:'Owner: Google PSE setup instructions',
      all:'All curated scopes', fallback:'Google site-filter fallback is active. An engine ID has not been configured.',
      loading:'Loading Google PSE… The fallback links remain available.', failed:'Google PSE could not be loaded. Use the fallback links below.', ready:'Google PSE is ready. Its Google-side inclusion settings control results; fallback links are also available.',
      group:'Open Google group', invalid:'Enter at least one word or number.', placeholder:'windshield rubber / paint / CVT'
    },
    ar: {
      fallbackTitle:'بديل: البحث على Google بمجموعات المواقع', searchNav:'محرك بحث ZR-V', engineTitle:'محرك بحث Honda ZR-V',
      engineIntro:'ابحث في مصادر الملاك المختارة بالعربية أو الإنجليزية أو اليابانية أو الصينية. لا تتم ترجمة كلمات البحث تلقائيًا.',
      queryLabel:'عمّ تبحث؟ (حتى 12 كلمة)', modelLabel:'السيارة', scopeLabel:'نطاق البحث', engineSubmit:'بحث',
      engineCaution:'البديل يفتح نتائج Google الخارجية في مجموعات صغيرة بفلاتر المواقع. الفلاتر ليست ضمانًا لحصر النتائج؛ الإعلانات والمحتوى الخاص أو غير المفهرس غير مشمولين. نتائج HR-V قد تشمل أجيالًا أخرى: تحقق من موديل 2023 فأحدث والمحرك. وجود شكوى لا يثبت تغطية الضمان.',
      scopeSummary:'المصادر المشمولة وحدود البحث', scopeNote:'النطاقات مأخوذة من الفهرس الحالي. معظمها يشمل الموقع المدرج وموديلات أخرى، وتضيّق كلمات السيارة النتائج. Reddit مقيد بالمجتمع والنقاشات المدرجة، وTelegram بالمجموعة المدرجة، وهوندا بقسم تجارب الملاك. صفحات فهارس المدونات لا تشمل تلقائيًا مدونات مستضافة في مواقع أخرى.',
      scopeDownload:'تنزيل قائمة المواقع لإعداد Google', engineSetup:'لصاحب الموقع: خطوات تفعيل Google PSE',
      all:'كل النطاقات المختارة', fallback:'يعمل الآن بديل Google بفلاتر المواقع. لم يُضبط معرّف محرك PSE بعد.',
      loading:'جارٍ تحميل Google PSE… روابط البحث البديلة تظل متاحة.', failed:'تعذر تحميل Google PSE. استخدم روابط البحث البديلة أدناه.', ready:'Google PSE جاهز. إعدادات المواقع في حساب Google تتحكم بالنتائج، والروابط البديلة متاحة أيضًا.',
      group:'فتح مجموعة Google', invalid:'اكتب كلمة أو رقمًا واحدًا على الأقل.', placeholder:'مطاط الزجاج / دهان / CVT'
    }
  };
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ar';
  const msg = () => messages[lang()];
  function fallbackLinks() {
    $('engineLinks').replaceChildren();
    const selected = $('engineScope').value === 'all' ? scopes : scopes.filter(s => s === $('engineScope').value);
    ZrvSearch.links($('engineQuery').value, $('engineModel').value, selected, lang()).forEach((item, i) => {
      const a = document.createElement('a');
      a.className = 'btn'; a.href = item.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = msg().group + ' ' + (i + 1) + ': ' + item.scopes.join(' · ');
      $('engineLinks').append(a);
    });
  }
  function translate() {
    for (const [id, value] of Object.entries(msg())) if ($(id)) $(id).textContent = value;
    $('engineQuery').placeholder = msg().placeholder;
    $('engineStatus').textContent = msg()[!cx ? 'fallback' : ready ? 'ready' : failed ? 'failed' : 'loading'];
    const selected = $('engineScope').value || 'all';
    $('engineScope').replaceChildren(new Option(msg().all, 'all'), ...scopes.map(s => new Option(s, s)));
    $('engineScope').value = selected;
    if (submitted) fallbackLinks();
  }
  scopes.forEach(scope => { const li = document.createElement('li'); li.textContent = scope; $('scopeList').append(li); });
  new MutationObserver(translate).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  $('engineForm').addEventListener('submit', event => {
    event.preventDefault();
    const query = ZrvSearch.terms($('engineQuery').value, $('engineModel').value);
    if (!query) { $('engineStatus').textContent = msg().invalid; return; }
    submitted = true; fallbackLinks();
    $('fallbackPanel').open = !ready;
    if (ready) {
      const scope = $('engineScope').value;
      window.google.search.cse.element.getElement('zrv').execute(query + (scope === 'all' ? '' : ' site:' + scope));
    }
  });
  // Existing element UI language is fixed at load by Google. The site UI switches live.
  if (cx) {
    window.__gcse = { parsetags:'explicit', initializationCallback: () => {
      try {
        window.google.search.cse.element.render({ div:'pseResults', tag:'searchresults-only', gname:'zrv' });
        ready = true; translate();
      } catch { failed = true; translate(); }
    }};
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://cse.google.com/cse.js?cx=' + encodeURIComponent(cx) + '&hl=' + lang();
    script.onerror = () => { failed = true; translate(); };
    document.head.append(script);
    setTimeout(() => { if (!ready) { failed = true; translate(); } }, 12000);
  }
  translate();
})();

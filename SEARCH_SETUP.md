# Honda ZR-V search / البحث المتخصص

Open `index.html#zr-v-search` on the existing GitHub Pages site. No build, server, API key or dependency is required. Existing directory, warranty tracker, theme, favorites and language storage are preserved.

## Active engine

Created in the owner’s Google account on November 11, 2026. Public engine ID (`cx`): `d7ef1b04095be4c5d`. The repository is already configured to load it; no further key or activation is required. [Manage this engine](https://programmablesearchengine.google.com/controlpanel/overview?cx=d7ef1b04095be4c5d). The following instructions document replacement/reconfiguration.

تم إنشاء المحرك وربطه بالموقع بالفعل. لا يلزم إدخال مفتاح أو معرّف آخر. الخطوات التالية مرجع لإعادة الإعداد والصيانة.

## Enable or replace Google PSE

1. Sign in with your own Google account at https://programmablesearchengine.google.com/ and create a Programmable Search Engine. Account verification and acceptance of Google terms require the owner’s authorization; repository code alone does not create an engine.
2. Choose **Search specific sites or pages**, not the entire web. Add the patterns from [search-sites.txt](search-sites.txt), one per line (bulk add in the Overview / Sites to search controls). Remove any example, unrelated, or previous inclusion entries. Keep **Search the entire web** disabled wherever that setting is available. Merely prioritizing these sites is insufficient.
3. Review the complete inclusion list. The list is derived from the 31 existing `SOURCES` entries in `index.html`, deduplicated by scope. Most entries include their exact listed host, because forum posts/owner logs often have paths outside the category landing page. Reddit retains the original community or individual thread paths; Telegram retains the original group; Honda retains `/usersvoice/`. No new sources or sibling blog hosts were added. A model keyword narrows relevance but does not guarantee vehicle compatibility. Host-wide patterns can return other models. Add exclusions in Google if necessary; mirror scope changes here.
4. In **Look and Feel → Layout**, select **Results only** so results stay inline with this site’s custom form (the default Overlay layout opens a modal). Copy **Search engine ID** from Overview (also visible as `cx` in Google's embed snippet). Edit `search-config.js`:
   ```js
   window.ZRV_SEARCH_CONFIG = { cx: 'YOUR_REAL_ENGINE_ID' };
   ```
   Commit and publish through the repository's existing GitHub Pages setup. The ID is public by design. **Do not put a Google API key, OAuth token, service-account file, or account credentials in this repository.** The Search Element embed needs only `cx`, not the Custom Search JSON API.
5. Open the search section and search for `windshield rubber` and `paint`, then test Arabic and Japanese terms. Verify actual organic result destinations against the configured inclusions. An engine loading successfully does not prove its Google-side restrictions are correct. Review promotions/ads separately. Test both languages, narrow scopes, and a blocked `cse.google.com` request: external fallback links should remain usable.

The embedded result element is rendered with Google's supported Search Element API. Our bilingual form passes vehicle-focused queries to it. Google widget labels use the language at page load; after changing the site language, reload to update Google's widget language. Site controls switch immediately and preserve the entered query. No result-language restriction is applied, so Japanese/Chinese sources remain eligible. Google controls widget appearance, indexing, ads, availability and account limits; the surrounding page retains the site's theme. A missing/blocked/invalid engine can yield an error or no results; fallback links are always offered after submission.

## Fallback limitations

With an empty `cx`, the page immediately generates Google Search links containing vehicle terms and parenthesized `site:` alternatives from the curated scopes. Each link searches at most three scopes, avoiding a single excessively long all-sites query. Click the groups separately; results are not merged or ranked across groups. Select one scope for a narrower search.

Search input is treated as ordinary words, up to 12 words / 120 characters; operators and punctuation are not passed through as search syntax. Words are quoted; no automatic translation occurs. The query always adds ZR-V aliases, or HR-V aliases when explicitly selected. HR-V year/platform/powertrain compatibility still requires human checking.

This is **not PSE** and is **not a guaranteed allowlist**: Google may interpret or relax operators, omit results, show ads, or let visitors alter the query. Neither mode accesses private Telegram messages, login-only communities or unindexed content. Blog tag/index pages do not automatically grant access to all linked blogs. The source directory remains available for direct browsing.

## الصيانة والتفعيل بالعربية

- افتح لوحة Google Programmable Search بحسابك، وأنشئ محركًا يبحث في **مواقع أو صفحات محددة** فقط. أضف أسطر `search-sites.txt` إلى المواقع المشمولة، واحذف أي مواقع أخرى، وأوقف البحث في الويب بالكامل.
- انسخ **Search engine ID** إلى قيمة `cx` في `search-config.js` ثم ارفع التعديل. المعرّف علني بطبيعته؛ لا تحتاج مفتاح API ولا تضع كلمات مرور أو مفاتيح خاصة في المستودع.
- بدون المعرّف، يعمل البديل فورًا بروابط Google مقيدة بفلاتر `site:` في مجموعات من ثلاثة نطاقات. هذا ليس محرك PSE ولا ضمانًا لحصر جميع النتائج. الإعلانات والمحتوى الخاص أو غير المفهرس ليست مشمولة.
- تحقق من إعدادات Google والنتائج الفعلية بعد التفعيل. تغيير قائمة المصادر في الموقع لا يحدّث إعدادات Google تلقائيًا. بعد تبديل لغة الموقع أعد تحميل الصفحة لتحديث لغة أدوات Google نفسها.

## Maintenance and verification

Run `node test-search.cjs`. When changing the directory sources, run `node test-search.cjs --write-sites`, review the generated patterns, and update the Google control panel manually to match. Clear `cx` only if you deliberately want fallback-only mode. This is a static GitHub Pages addition; do not replace the existing deployment with a new hosting service.

Automated checks cover original source count, scope derivation, full fallback coverage in small batches, Unicode URL encoding, neutralized query operators, model selection, generated inclusion patterns and existing inline JavaScript syntax. Live PSE results require the real engine and Google-side setup; automated unit checks do not validate Google’s remote configuration.

Official references (checked November 11, 2026):
- [Create a search engine](https://support.google.com/programmable-search/answer/12495704)
- [Included/excluded sites](https://support.google.com/programmable-search/answer/71638)
- [Site patterns](https://support.google.com/programmable-search/answer/12397162)
- [Engine ID and bulk inclusion](https://support.google.com/programmable-search/answer/12465937)
- [Search Element render and execute API](https://developers.google.com/custom-search/docs/element)
- [PSE versus Google Search](https://support.google.com/programmable-search/answer/70392)

Manual verification on November 11, 2026: created the real engine with 23 inclusions; confirmed entire-web search OFF, all regions and all languages; selected Results only layout. In-browser checks preserved all 31 directory cards and 8 warranty cases, exercised directory/country filters, theme and Arabic/English direction switching, preserved typed Unicode, and verified all-scope and single-scope fallback links. Real PSE searches for `paint` and Japanese `ゴム` returned results; the latter included the documented windshield rubber reports on Minkara. Model keywords can still match forum signatures/sidebar text; inspect each result.

(function (window, document) {
  function getLang() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') === 'en' ? 'en' : 'fr';
  }

  function highlightLangBtn() {
    const lang = getLang();
    const frBtn = document.getElementById('btn-fr');
    const enBtn = document.getElementById('btn-en');
    if (frBtn) frBtn.classList.toggle('selected', lang === 'fr');
    if (enBtn) enBtn.classList.toggle('selected', lang === 'en');
  }

  function wireLangSwitch() {
    const frBtn = document.getElementById('btn-fr');
    const enBtn = document.getElementById('btn-en');
    if (!frBtn || !enBtn) return;
    frBtn.addEventListener('click', function () {
      const url = new URL(window.location.href);
      url.searchParams.delete('lang');
      window.location.href = url.pathname + url.search;
    });
    enBtn.addEventListener('click', function () {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', 'en');
      window.location.href = url.pathname + url.search;
    });
  }

  function prepareContent(wrapper, lang) {
    const selector = 'template[id$="-'+ lang +'"]';
    const templates = wrapper.querySelectorAll(selector);
    if (!templates.length) {
      const fragment = document.createDocumentFragment();
      while (wrapper.firstChild) fragment.appendChild(wrapper.firstChild);
      return fragment;
    }
    const fragment = document.createDocumentFragment();
    templates.forEach(function (tpl) {
      fragment.appendChild(tpl.content.cloneNode(true));
    });
    return fragment;
  }

  async function loadPartials(partials, options) {
    const config = options || {};
    const root = document.getElementById(config.targetId || 'site-root');
    if (!root || !Array.isArray(partials) || !partials.length) return;
    const lang = getLang();
    document.documentElement.lang = lang;
    root.innerHTML = '';
    for (const url of partials) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(response.statusText);
        const html = await response.text();
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        root.appendChild(prepareContent(wrapper, lang));
      } catch (error) {
        console.error('Failed to load', url, error);
      }
    }
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    syncNavLinks();
    document.dispatchEvent(new Event('partialsLoaded'));
  }

  function splitHref(baseHref) {
    const hashIndex = baseHref.indexOf('#');
    const hash = hashIndex >= 0 ? baseHref.slice(hashIndex) : '';
    const pathAndQuery = hashIndex >= 0 ? baseHref.slice(0, hashIndex) : baseHref;
    const queryIndex = pathAndQuery.indexOf('?');
    const path = queryIndex >= 0 ? pathAndQuery.slice(0, queryIndex) : pathAndQuery;
    const query = queryIndex >= 0 ? pathAndQuery.slice(queryIndex + 1) : '';
    return { path, query, hash };
  }

  function syncNavLinks() {
    const lang = getLang();
    const links = document.querySelectorAll('.nav a, .brand');
    links.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (/^(https?:|mailto:|tel:|\/\/)/i.test(href)) return;
      if (!link.dataset.baseHref) link.dataset.baseHref = href;
      const baseHref = link.dataset.baseHref;
      const parts = splitHref(baseHref);
      const params = new URLSearchParams(parts.query);
      if (lang === 'fr') params.delete('lang');
      else params.set('lang', lang);
      const queryString = params.toString();
      let nextHref = parts.path || (baseHref.startsWith('#') ? '' : './');
      if (queryString) nextHref += (nextHref.includes('?') ? '&' : '?') + queryString;
      if (parts.hash) nextHref += parts.hash;
      link.setAttribute('href', nextHref);
    });
  }

  function setMeta(config) {
    if (!config) return;
    const lang = getLang();
    const meta = config[lang] || config.fr || config.en;
    if (!meta) return;
    Object.entries(meta).forEach(function ([id, value]) {
      const el = document.getElementById(id);
      if (!el) return;
      const tag = el.tagName;
      if (tag === 'META') {
        el.setAttribute('content', value);
      } else if (tag === 'LINK') {
        el.setAttribute('href', value);
      } else if (tag === 'TITLE') {
        document.title = value;
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    });
  }

  function initLangUI() {
    highlightLangBtn();
    wireLangSwitch();
  }

  window.Site = {
    getLang: getLang,
    highlightLangBtn: highlightLangBtn,
    initLangUI: initLangUI,
    loadPartials: loadPartials,
    setMeta: setMeta,
    syncNavLinks: syncNavLinks
  };
})(window, document);

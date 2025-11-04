(() => {
  const translations = {
    en: {
      "nav.work": "Work",
      "nav.email": "Email",
      "hero.title": "Editor",
      "hero.tagline":
        "I craft punchy short videos for creators, brands, and teams—whatever the vibe: trend, humor, or cinematic storytelling.",
      "hero.cta.primary": "Let's Work Together",
      "hero.cta.secondary": "View Projects",
      "section.title": "Projects",
      "section.meta": "Shortform · Longform",
      "search.label": "Search projects",
      "search.placeholder": "Search by project name or collaborator...",
      "filters.aria": "Filter by category",
      "chip.all": "All",
      "chip.shorts": "Shortform",
      "chip.longform": "Longform",
      "card.morrow.meta": "Longform · Music",
      "card.morrow.description":
        "Personal project improvised and shot for an underground artist friend.",
      "card.vincent.meta": "Shortform · Client",
      "card.vincent.description":
        "These videos were created free of charge as a practice exchange. They were edited freestyle without attending the shoot or receiving a formal brief—thank you Vincent for the opportunity!",
      "card.find.meta": "Shortform · Entertainment",
      "card.find.description":
        "English vlog content where I share creative experiences, travel stories, and everyday life.",
      "project.play": "Play Fullscreen",
      "footer.copy": "Anoki Media · Crafted for fast, cinematic storytelling ·",
      "footer.email": "contact@anoki.media",
    },
    fr: {
      "nav.work": "Projets",
      "nav.email": "Courriel",
      "hero.title": "Monteur",
      "hero.tagline":
        "Je crée des short vidéos percutantes pour créateurs, marques et entreprises. Peu importe le style/storytelling, trend, humour ou cinématique, je m'adapte à ton vibe.",
      "hero.cta.primary": "Travaillons ensemble !",
      "hero.cta.secondary": "Voir les projets",
      "section.title": "Projets",
      "section.meta": "Court format · Long format",
      "search.label": "Rechercher des projets",
      "search.placeholder": "Rechercher par nom de projet ou collaborateur...",
      "filters.aria": "Filtrer par catégorie",
      "chip.all": "Tous",
      "chip.shorts": "Court format",
      "chip.longform": "Long format",
      "card.morrow.meta": "Long format · Musique",
      "card.morrow.description":
        "Projet passion filmé et improvisé par mes soins pour un ami artiste underground.",
      "card.vincent.meta": "Court format · Client",
      "card.vincent.description":
        "Ces vidéos ont été réalisées gratuitement dans le cadre d’un échange d’expérience et de pratique. Elles ont été montées en freestyle, sans participation au tournage ni brief préalable. Merci à Vincent pour cette belle expérience !",
      "card.find.meta": "Court format · Divertissement",
      "card.find.description":
        "Contenu de vlog en anglais où je partage mes expériences créatives, mes voyages et mon quotidien.",
      "project.play": "Lecture plein écran",
      "footer.copy": "Anoki Media · Pensé pour un récit cinématique rapide ·",
      "footer.email": "contact@anoki.media",
    },
  };

  const storageKey = "anoki-language";
  const root = document.documentElement;
  const langToggle = document.getElementById("lang-toggle");
  const saved = localStorage.getItem(storageKey);
  let current = saved === "fr" ? "fr" : "en";

  const applyTranslations = (lang) => {
    const dictionary = translations[lang] || translations.en;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (dictionary[key]) el.textContent = dictionary[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (dictionary[key]) el.setAttribute("placeholder", dictionary[key]);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const attr = el.dataset.i18nAttr;
      const key = el.dataset.i18nAttrKey;
      if (attr && key && dictionary[key]) {
        el.setAttribute(attr, dictionary[key]);
      }
    });

    root.lang = lang;
    root.dataset.lang = lang;

    const nextLang = lang === "en" ? "fr" : "en";
    if (langToggle) {
      langToggle.querySelector(".label").textContent = nextLang === "en" ? "English" : "Français";
      langToggle.setAttribute(
        "aria-label",
        nextLang === "en" ? "Switch language to English" : "Passer le site en français"
      );
    }
  };

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      current = current === "en" ? "fr" : "en";
      localStorage.setItem(storageKey, current);
      applyTranslations(current);
    });
  }

  applyTranslations(current);
})();

(() => {
  const chips = document.querySelectorAll(".chip");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const searchField = document.getElementById("search");
  let activeFilter = "all";

  const normalise = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const applyFilters = () => {
    const query = normalise(searchField.value || "");
    cards.forEach((card) => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const haystack = card.dataset.title + " " + (card.dataset.tags || "").replaceAll("|", " ");
      const matchesSearch = normalise(haystack).includes(query);
      card.style.display = matchesCategory && matchesSearch ? "" : "none";
    });
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.filter === activeFilter) return;
      chips.forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  searchField.addEventListener("input", () => {
    window.requestAnimationFrame(applyFilters);
  });
})();

(() => {
  const modal = document.getElementById("video-modal");
  const player = document.getElementById("modal-player");
  const title = document.getElementById("modal-title");
  const description = document.getElementById("modal-description");
  const playlistContainer = document.getElementById("modal-playlist");
  const triggers = document.querySelectorAll(".project-actions button[data-drive]");
  let lastFocused;

  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    player.src = "";
    playlistContainer.hidden = true;
    playlistContainer.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  };

  const getVideoList = (button) => {
    const raw = button.dataset.videos;
    if (!raw) {
      const src = button.getAttribute("data-drive");
      return src ? [{ title: button.dataset.title || "Video", src }] : [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && item.src);
    } catch (error) {
      console.error("Failed to parse video list:", error);
      return [];
    }
  };

  const openModal = (event) => {
    const trigger = event.currentTarget;
    const videos = getVideoList(trigger);
    if (!videos.length) return;
    lastFocused = document.activeElement;
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    title.textContent = trigger.dataset.title || "Project";
    const lang = document.documentElement.dataset.lang === "fr" ? "fr" : "en";
    const descriptionKey = lang === "fr" ? "descriptionFr" : "descriptionEn";
    description.textContent = trigger.dataset[descriptionKey] || "";
    document.body.style.overflow = "hidden";

    let activeIndex = 0;
    let playlistButtons = [];

    const setActive = () => {
      playlistButtons.forEach((btn, idx) => {
        btn.classList.toggle("is-active", idx === activeIndex);
      });
    };

    const setVideo = (index) => {
      const item = videos[index];
      if (!item) return;
      activeIndex = index;
      player.src = item.src;
      setActive();
    };

    playlistContainer.innerHTML = "";
    if (videos.length > 1) {
      playlistContainer.hidden = false;
      playlistButtons = videos.map((item, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = item.title || `Clip ${idx + 1}`;
        btn.addEventListener("click", () => setVideo(idx));
        playlistContainer.appendChild(btn);
        return btn;
      });
    } else {
      playlistContainer.hidden = true;
    }

    setVideo(0);
    modal.querySelector(".modal-close").focus();
  };

  triggers.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  modal.addEventListener("click", (event) => {
    if (event.target.hasAttribute("data-close")) {
      closeModal();
    }
  });

  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-visible")) {
      closeModal();
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

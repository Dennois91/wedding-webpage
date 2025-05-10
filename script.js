document.addEventListener("DOMContentLoaded", () => {
  // === DOM ELEMENTS ===
  const langButtons = {
    en: document.getElementById("lang-en"),
    sv: document.getElementById("lang-sv"),
    sr: document.getElementById("lang-sr"),
  };
  const sidebar = document.getElementById("scroll-sidebar");
  const toggleButton = document.getElementById("sidebar-toggle");
  const sidebarLinks = document.querySelectorAll("#scroll-sidebar a");

  const daysSpan = document.getElementById("days");
  const hoursSpan = document.getElementById("hours");
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  const translatableElements = {
    coverHeading: document.querySelector("#cover-photo h1"),
    coverDateHeader: document.querySelector("#cover-photo h2"),
    coverParagraph: document.querySelector("#cover-photo p"),
    infoHeading: document.querySelector("#information h2"),
    infoParagraphs: document.querySelectorAll("#information .info-content p"),
    timelineContents: document.querySelectorAll(".timeline-content"),
  };

  // === GLOBAL STATE ===
  let currentLang = "en";
  const weddingDate = new Date("October 19, 2025 00:00:00");

  // === FUNCTIONS ===
  function updateCountdown() {
    const now = new Date();
    const timeDifference = weddingDate - now;

    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      [daysSpan, hoursSpan, minutesSpan, secondsSpan].forEach(
        (span) => (span.textContent = "00")
      );
      return;
    }

    const timeUnits = {
      days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeDifference / (1000 * 60)) % 60),
      seconds: Math.floor((timeDifference / 1000) % 60),
    };

    daysSpan.textContent = String(timeUnits.days).padStart(2, "0");
    hoursSpan.textContent = String(timeUnits.hours).padStart(2, "0");
    minutesSpan.textContent = String(timeUnits.minutes).padStart(2, "0");
    secondsSpan.textContent = String(timeUnits.seconds).padStart(2, "0");
  }

  function setLanguage(langCode) {
    currentLang = langCode;

    fetch(`/information/${langCode}.json`)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to load content for language: ${langCode}`);
        return response.json();
      })
      .then((data) => {
        ["ourStory", "toastmasters", "weddingTraditions", "qa"].forEach(
          (key) => {
            renderBlock(key, data[key]);
            document.getElementById(`title-${key}`).textContent =
              data.titles[key];
            document.getElementById(`nav-${key}`).textContent =
              data.titles[key];
          }
        );
        document.getElementById("nav-weddingDay").textContent =
          data.titles.weddingDay;

        const countdownKeys = ["days", "hours", "minutes", "seconds"];
        document
          .querySelectorAll(".countdown-label")
          .forEach((label, index) => {
            label.textContent = data.countdown[countdownKeys[index]] || "";
          });

        const officialDateLabel = document.querySelector(
          ".official-date-label"
        );
        if (officialDateLabel)
          officialDateLabel.textContent = data.officialDate;

        const timelineKeys = ["ceremony", "cocktail", "legals", "party"];
        document.querySelectorAll(".timeline-content").forEach((el, idx) => {
          el.innerHTML = data.timeline[timelineKeys[idx]] || "";
        });
      })
      .catch(console.error);

    // Update button styles
    Object.values(langButtons).forEach((btn) => btn.classList.remove("active"));
    langButtons[langCode].classList.add("active");
  }

  function renderBlock(blockId, content) {
    const block = document.getElementById(blockId);
    if (block) block.innerHTML = content;
  }

  // === INITIALIZATION ===

  // Language selector
  Object.keys(langButtons).forEach((langCode) => {
    langButtons[langCode].addEventListener("click", () =>
      setLanguage(langCode)
    );
  });

  // Start with English
  setLanguage(currentLang);

  // Countdown timer
  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Sidebar toggle
  toggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    toggleButton.textContent = sidebar.classList.contains("hidden") ? "☰" : "✖";
  });

  // Smooth scrolling
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});

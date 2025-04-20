document.addEventListener("DOMContentLoaded", () => {
  const langButtons = {
    en: document.getElementById("lang-en"),
    sv: document.getElementById("lang-sv"),
    sr: document.getElementById("lang-sr"),
  };
  let currentLang = "en";

  const weddingDate = new Date("October 19, 2025 00:00:00"); // Set your wedding date and time
  const weddingTime = "12:00"; // Set your wedding time
  const saintSavaLink =
    "https://www.google.com/maps/place/The+Temple+of+Saint+Sava/@44.7980938,20.466963,16.96z/data=!4m6!3m5!1s0x475a700ca7258e8f:0xbe11391a6fc0344c!8m2!3d44.7981382!4d20.4690468!16zL20vMDNucXNi?entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D"; // URL for Saint Sava Church

  const translations = {
    en: {
      coverHeading: "Jovana & Dennis",
      coverDateHeader: "October 19 2025",
      coverParagraph: "We're Getting Married!",
      infoHeading: "Wedding Details",
      infoParagraphs: [
        "Date: October 19 2025",
        "Time: " + weddingTime,
        `Location: <a href="${saintSavaLink}" target="_blank" rel="noopener noreferrer">Saint Sava Temple</a>`,
      ],
      countdownDays: "Days",
      countdownHours: "Hours",
      countdownMinutes: "Minutes",
      countdownSeconds: "Seconds",
      timelineCeremony: "Church Wedding",
      timelineCocktail: "Reception &<br>Cocktail Hour",
      timelineLegals: "Legal Ceremony",
      timelineParty: "Dinner & Party",
    },
    sv: {
      coverHeading: "Jovana & Dennis",
      coverDateHeader: "Oktober 19 2025",
      coverParagraph: "Vi är så glada att fira med er!",
      infoHeading: "Bröllopsinformation",
      infoParagraphs: [
        "Datum: Oktober 19 2025",
        "Tid: " + weddingTime,
        `Plats: <a href="${saintSavaLink}" target="_blank" rel="noopener noreferrer">Sankt Savas Kyrka</a>`,
      ],
      countdownDays: "Dagar",
      countdownHours: "Timmar",
      countdownMinutes: "Minuter",
      countdownSeconds: "Sekunder",
      timelineCeremony: "Vigselceremoni",
      timelineCocktail: "Cocktailtimme",
      timelineLegals: "Borgelig vigsel",
      timelineParty: "Kvällsfest",
    },
    sr: {
      coverHeading: "Dobrodošli na našu veb stranicu venčanja",
      coverDateHeader: "October 19 2025",
      coverParagraph: "Veoma smo uzbuđeni što slavimo sa vama!",
      infoHeading: "Detalji Venčanja",
      infoParagraphs: [
        "Date: Oktobar 19 2025",
        "Vreme: " + weddingTime,
        `Lokacija: <a href="${saintSavaLink}" target="_blank" rel="noopener noreferrer">Hram Svetog Save</a>`,
      ],
      countdownDays: "Dana",
      countdownHours: "Sati",
      countdownMinutes: "Minuta",
      countdownSeconds: "Sekundi",
      timelineCeremony: "Ceremonija Venčanja",
      timelineLunch: "Ručak Venčanja",
      timelineCocktail: "Koktel Sat",
      timelineLegals: "Građanska Venčanja",
      timelineParty: "Večernja Zabava",
    },
  };

  const daysSpan = document.getElementById("days");
  const hoursSpan = document.getElementById("hours");
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  function updateCountdown() {
    const now = new Date(); // Current date and time
    const timeDifference = weddingDate.getTime() - now.getTime(); // Time difference in milliseconds

    if (timeDifference <= 0) {
      // Wedding date has passed
      clearInterval(countdownInterval); // Stop the interval
      daysSpan.textContent = "00";
      hoursSpan.textContent = "00";
      minutesSpan.textContent = "00";
      secondsSpan.textContent = "00";
      return; // Exit the function
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    daysSpan.textContent = String(days).padStart(2, "0"); // Pad with leading zeros if needed
    hoursSpan.textContent = String(hours).padStart(2, "0");
    minutesSpan.textContent = String(minutes).padStart(2, "0");
    secondsSpan.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown(); // Call it once immediately to set initial values
  const countdownInterval = setInterval(updateCountdown, 1000); // Update every 1 second

  const translatableElements = {
    coverHeading: document.querySelector("#cover-photo h1"),
    coverDateHeader: document.querySelector("#cover-photo h2"),
    coverParagraph: document.querySelector("#cover-photo p"),
    infoHeading: document.querySelector("#information h2"),
    infoParagraphs: document.querySelectorAll("#information .info-content p"),
    timelineContents: document.querySelectorAll(".timeline-content"), // NEW: Select all timeline content elements
  };

  function setLanguage(langCode) {
    currentLang = langCode;

    // Fetch the JSON file for the selected language
    fetch(`/information/${langCode}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load content for language: ${langCode}`);
        }
        return response.json();
      })
      .then((data) => {
        // Update the blocks with the fetched content
        renderBlock("block1", data.block1);
        renderBlock("block2", data.block2);
        renderBlock("block3", data.block3);
      })
      .catch((error) => {
        console.error("Error fetching language content:", error);
      });

    const currentTranslations = translations[langCode];

    if (!currentTranslations) {
      console.error(`Translations for language '${langCode}' not found.`);
      return; // Exit if translations are missing
    }

    translatableElements.coverHeading.textContent =
      currentTranslations.coverHeading;
    translatableElements.coverDateHeader.textContent =
      currentTranslations.coverDateHeader;
    translatableElements.coverParagraph.textContent =
      currentTranslations.coverParagraph;
    translatableElements.infoHeading.textContent =
      currentTranslations.infoHeading;

    translatableElements.infoParagraphs.forEach((paragraph, index) => {
      // For the Location paragraph (index 2), set innerHTML to allow HTML content (link)
      if (index === 2) {
        paragraph.innerHTML = currentTranslations.infoParagraphs[index] || "";
      } else {
        paragraph.textContent = currentTranslations.infoParagraphs[index] || "";
      }
    });

    // Update Countdown Labels (existing code - keep this)
    const countdownLabels = document.querySelectorAll(".countdown-label");
    const countdownKeys = [
      "countdownDays",
      "countdownHours",
      "countdownMinutes",
      "countdownSeconds",
    ];
    countdownLabels.forEach((label, index) => {
      label.textContent = currentTranslations[countdownKeys[index]] || "";
    });

    // Update Timeline Content (NEW code)
    const timelineContentKeys = [
      "timelineCeremony",
      "timelineCocktail",
      "timelineLegals",
      "timelineParty",
    ]; // Order matters!
    translatableElements.timelineContents.forEach((content, index) => {
      content.innerHTML = currentTranslations[timelineContentKeys[index]] || "";
    });

    // Update active button highlight (existing code - keep this)
    Object.values(langButtons).forEach((btn) => btn.classList.remove("active"));
    langButtons[langCode].classList.add("active");
  }

  // Add click event listeners to language buttons dynamically
  Object.keys(langButtons).forEach((langCode) => {
    langButtons[langCode].addEventListener("click", () =>
      setLanguage(langCode)
    );
  });

  setLanguage("en"); // Initialize to English
});

function renderBlock(blockId, content) {
  const blockElement = document.getElementById(blockId);
  if (blockElement) {
    blockElement.innerHTML = content; // Render HTML content
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll("#scroll-sidebar a");

  // Smooth scrolling
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      // Scroll to the section
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  // Highlight active section
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute("id");
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSection) {
        link.classList.add("active");
      }
    });
  });
});

const sidebar = document.getElementById("scroll-sidebar");
const toggleButton = document.getElementById("sidebar-toggle");

toggleButton.addEventListener("click", () => {
  if (sidebar.classList.contains("hidden")) {
    sidebar.classList.remove("hidden"); // Show sidebar
    toggleButton.textContent = "✖"; // Update button text/icon
  } else {
    sidebar.classList.add("hidden"); // Hide sidebar
    toggleButton.textContent = "☰"; // Update button text/icon
  }
});
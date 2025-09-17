/**
 * Early Language Detection Script
 * This script runs before the main i18n.js to prevent FOUC (Flash of Untranslated Content)
 */

(function () {
  "use strict";

  // Early language detection
  function detectLanguageEarly() {
    // Check localStorage first
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && ["en", "tr"].includes(savedLanguage)) {
      return savedLanguage;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith("tr")) {
      return "tr";
    }

    // Default to English
    return "en";
  }

  // Apply early language class to prevent FOUC
  const detectedLang = detectLanguageEarly();

  // Add language class to HTML element
  document.documentElement.setAttribute("lang", detectedLang);
  document.documentElement.setAttribute("data-i18n-lang", detectedLang);
  document.documentElement.classList.add("lang-" + detectedLang);

  // Store in global for main i18n script
  window.earlyDetectedLanguage = detectedLang;

  console.log("Early language detection:", detectedLang);
})();

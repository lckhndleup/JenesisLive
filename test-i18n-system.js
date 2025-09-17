console.log("=== i18n System Test ===");

// Supported languages kontrol
const i18nInstance = window.i18nInstance;
if (i18nInstance) {
  console.log("✅ i18n instance found");
  console.log("Supported languages:", i18nInstance.supportedLanguages);
  console.log("Current language:", i18nInstance.currentLanguage);
  console.log(
    "Available translations:",
    Object.keys(i18nInstance.translations)
  );
} else {
  console.log("❌ i18n instance not found");
}

// DOM elements kontrol
const modal = document.getElementById("languageModal");
if (modal) {
  const languageOptions = modal.querySelectorAll(".language-option");
  console.log("✅ Language modal found");
  console.log("Language options count:", languageOptions.length);

  languageOptions.forEach((option) => {
    const lang = option.getAttribute("data-language");
    const name = option.querySelector(".language-name").textContent;
    console.log(`- ${lang}: ${name}`);
  });
} else {
  console.log("❌ Language modal not found");
}

// Translation elements kontrol
const translatableElements = document.querySelectorAll("[data-i18n]");
console.log("✅ Translatable elements found:", translatableElements.length);

console.log("=== Test Complete ===");

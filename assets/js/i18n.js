/**
 * I18n (Internationalization) System
 * Supports EN and TR languages with localStorage persistence
 */

class I18n {
  constructor() {
    this.currentLanguage = "en";
    this.translations = {};
    this.fallbackLanguage = "en";
    this.supportedLanguages = ["en", "tr"];

    // Initialize the system
    this.init();
  }

  /**
   * Initialize the i18n system
   */
  async init() {
    console.log("Initializing i18n system...");
    try {
      // Detect user's preferred language
      this.currentLanguage = this.detectLanguage();
      console.log("Detected language:", this.currentLanguage);

      // Load translations for the detected language
      await this.loadTranslations(this.currentLanguage);

      // Apply translations to the page
      this.applyTranslations();

      // Update HTML lang attribute
      this.updateHtmlLang();

      // Initialize language selector
      this.initLanguageSelector();

      console.log("i18n system initialization completed successfully");
    } catch (error) {
      console.error("Failed to initialize i18n:", error);
      // Fallback to English if initialization fails
      await this.loadTranslations(this.fallbackLanguage);
      this.applyTranslations();
    }
  }

  /**
   * Detect user's preferred language
   * Priority: localStorage > browser language > fallback
   */
  detectLanguage() {
    // Check localStorage first
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
      return savedLanguage;
    }

    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith("tr")) {
      return "tr";
    }

    // Default to English
    return this.fallbackLanguage;
  }

  /**
   * Load translation files
   */
  async loadTranslations(language) {
    try {
      const response = await fetch(`i18n/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language}.json`);
      }

      this.translations[language] = await response.json();
      console.log(`Loaded translations for ${language}`);
    } catch (error) {
      console.error(`Error loading translations for ${language}:`, error);

      // If requested language fails and it's not the fallback, try fallback
      if (language !== this.fallbackLanguage) {
        console.log(`Falling back to ${this.fallbackLanguage}`);
        const fallbackResponse = await fetch(
          `i18n/${this.fallbackLanguage}.json`
        );
        this.translations[this.fallbackLanguage] =
          await fallbackResponse.json();
        this.currentLanguage = this.fallbackLanguage;
      }
    }
  }

  /**
   * Get translation by key (supports nested keys like "nav.home")
   */
  getTranslation(key) {
    const currentTranslations = this.translations[this.currentLanguage];
    if (!currentTranslations) {
      return key;
    }

    // Support nested keys
    const keys = key.split(".");
    let value = currentTranslations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        const fallbackTranslations = this.translations[this.fallbackLanguage];
        if (fallbackTranslations) {
          let fallbackValue = fallbackTranslations;
          for (const fk of keys) {
            if (
              fallbackValue &&
              typeof fallbackValue === "object" &&
              fk in fallbackValue
            ) {
              fallbackValue = fallbackValue[fk];
            } else {
              return key; // Return key if not found in fallback either
            }
          }
          return fallbackValue;
        }
        return key;
      }
    }

    return value || key;
  }

  /**
   * Apply translations to all elements with data-i18n attributes
   */
  applyTranslations() {
    console.log("Applying translations for language:", this.currentLanguage);
    console.log(
      "Available translations:",
      this.translations[this.currentLanguage]
    );

    // Handle text content with data-i18n
    const elements = document.querySelectorAll("[data-i18n]");
    console.log("Found elements with data-i18n:", elements.length);

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getTranslation(key);
      console.log(`Translating "${key}" to "${translation}"`);

      // Handle different element types
      if (element.tagName === "INPUT" && element.type === "submit") {
        element.value = translation;
      } else if (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA"
      ) {
        element.textContent = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Handle attributes with data-i18n-attr
    const attrElements = document.querySelectorAll("[data-i18n-attr]");
    attrElements.forEach((element) => {
      const attrConfig = element.getAttribute("data-i18n-attr");
      const attrPairs = attrConfig.split("|");

      attrPairs.forEach((pair) => {
        const [attr, key] = pair.split(":");
        if (attr && key) {
          const translation = this.getTranslation(key.trim());
          element.setAttribute(attr.trim(), translation);
        }
      });
    });

    // Handle data-hover attributes (for hover effects)
    const hoverElements = document.querySelectorAll("[data-i18n-hover]");
    hoverElements.forEach((element) => {
      const key = element.getAttribute("data-i18n-hover");
      const translation = this.getTranslation(key);
      element.setAttribute("data-hover", translation);
    });

    // Update meta tags
    this.updateMetaTags();
  }

  /**
   * Update meta tags with translations
   */
  updateMetaTags() {
    // Update title
    const titleTranslation = this.getTranslation("meta.title");
    if (titleTranslation && titleTranslation !== "meta.title") {
      document.title = titleTranslation;
    }

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      const descriptionTranslation = this.getTranslation("meta.description");
      if (
        descriptionTranslation &&
        descriptionTranslation !== "meta.description"
      ) {
        descriptionMeta.setAttribute("content", descriptionTranslation);
      }
    }
  }

  /**
   * Update HTML lang attribute
   */
  updateHtmlLang() {
    document.documentElement.setAttribute("lang", this.currentLanguage);
  }

  /**
   * Change language
   */
  async changeLanguage(newLanguage) {
    console.log("Attempting to change language to:", newLanguage);

    if (!this.supportedLanguages.includes(newLanguage)) {
      console.error(`Unsupported language: ${newLanguage}`);
      return;
    }

    try {
      // Save to localStorage
      localStorage.setItem("language", newLanguage);
      console.log("Saved language to localStorage:", newLanguage);

      // Load new translations if not already loaded
      if (!this.translations[newLanguage]) {
        console.log("Loading translations for:", newLanguage);
        await this.loadTranslations(newLanguage);
      }

      // Update current language
      this.currentLanguage = newLanguage;
      console.log("Current language updated to:", this.currentLanguage);

      // Apply new translations
      this.applyTranslations();

      // Update HTML lang attribute
      this.updateHtmlLang();

      // Update language selector UI
      this.updateLanguageSelector();

      console.log(`Language successfully changed to ${newLanguage}`);
    } catch (error) {
      console.error(`Failed to change language to ${newLanguage}:`, error);
    }
  }

  /**
   * Initialize language selector buttons
   */
  initLanguageSelector() {
    // Wait a bit to ensure DOM is fully ready
    setTimeout(() => {
      const languageButtons = document.querySelectorAll("[data-language]");
      console.log("Found language buttons:", languageButtons.length);
      console.log("Buttons:", languageButtons);

      if (languageButtons.length === 0) {
        console.warn("No language buttons found! Retrying...");
        setTimeout(() => this.initLanguageSelector(), 500);
        return;
      }

      languageButtons.forEach((button) => {
        const language = button.getAttribute("data-language");
        console.log("Setting up button for language:", language);

        // Remove existing listeners first
        button.removeEventListener("click", this.handleLanguageClick);

        // Add click event listener
        const clickHandler = (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Language button clicked:", language);
          this.changeLanguage(language);
        };

        button.addEventListener("click", clickHandler);

        // Store reference for cleanup
        button._i18nClickHandler = clickHandler;
      });

      // Update initial state
      this.updateLanguageSelector();
    }, 100);
  }

  /**
   * Update language selector visual state
   */
  updateLanguageSelector() {
    const languageButtons = document.querySelectorAll("[data-language]");

    languageButtons.forEach((button) => {
      const language = button.getAttribute("data-language");

      if (language === this.currentLanguage) {
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      }
    });
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  /**
   * Manual test function for debugging
   */
  test() {
    console.log("Current language:", this.currentLanguage);
    console.log("Available translations:", this.translations);
    console.log(
      "Language buttons:",
      document.querySelectorAll("[data-language]")
    );
    return this;
  }
}

// Initialize i18n system when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing i18n system...");
  window.i18n = new I18n();
  console.log("i18n system initialized:", window.i18n);
});

// Fallback for older browsers or edge cases
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.i18n) {
      console.log("Fallback initialization...");
      window.i18n = new I18n();
    }
  });
} else {
  console.log("DOM already loaded, initializing immediately...");
  window.i18n = new I18n();
}

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = I18n;
}

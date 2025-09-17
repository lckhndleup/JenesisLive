/**
 * I18n (Internationalization) System
 * Supports EN and TR languages with localStorage persistence
 */

class I18n {
  constructor() {
    this.currentLanguage = "en";
    this.translations = {};
    this.fallbackLanguage = "en";
    this.supportedLanguages = ["en", "tr", "ru", "de", "es", "sa", "fr"];

    // Initialize the system
    this.init();
  }

  /**
   * Initialize the i18n system
   */
  async init() {
    console.log("Initializing i18n system...");
    try {
      // Use early detected language if available
      if (window.earlyDetectedLanguage) {
        this.currentLanguage = window.earlyDetectedLanguage;
        console.log("Using early detected language:", this.currentLanguage);
      } else {
        // Fallback to normal detection
        this.currentLanguage = this.detectLanguage();
        console.log("Detected language:", this.currentLanguage);
      }

      // Load translations for the detected language
      await this.loadTranslations(this.currentLanguage);

      // Apply translations to the page immediately
      this.applyTranslationsInstant();

      // Update HTML lang attribute
      this.updateHtmlLang();

      // Initialize language selector
      this.initLanguageSelector();

      // Update language selector visual state (flag and active states)
      this.updateLanguageSelector();

      // Initialize AJAX navigation listeners
      this.initAjaxNavigationListeners();

      console.log("i18n system initialization completed successfully");
    } catch (error) {
      console.error("Failed to initialize i18n:", error);
      // Fallback to English if initialization fails
      await this.loadTranslations(this.fallbackLanguage);
      this.applyTranslationsInstant();
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

      // Mark element as translated to remove CSS overlay
      element.classList.add("i18n-ready");
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
   * Apply translations instantly without logging (for initial load)
   */
  applyTranslationsInstant() {
    // Handle text content with data-i18n
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getTranslation(key);

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

      // Mark element as translated to remove CSS overlay
      element.classList.add("i18n-ready");
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

      // Hide modal after language change
      this.hideLanguageModal();

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
      this.initModernLanguageSelector();
    }, 100);
  }

  /**
   * Initialize modern language selector with modal - FIX: Event Delegation kullanarak
   */
  initModernLanguageSelector() {
    const toggleBtn = document.getElementById("languageToggle");
    const modal = document.getElementById("languageModal");

    console.log("Setting up modern language selector");
    console.log("Toggle button:", toggleBtn);
    console.log("Modal:", modal);

    if (!toggleBtn || !modal) {
      console.warn("Language selector elements not found! Retrying...");
      // Try multiple times with longer delays for AJAX-loaded content
      setTimeout(() => this.initLanguageSelector(), 500);
      setTimeout(() => this.initLanguageSelector(), 1000);
      setTimeout(() => this.initLanguageSelector(), 2000);
      return;
    }

    // Remove existing event listeners to avoid duplicates
    const oldToggleBtn = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(oldToggleBtn, toggleBtn);

    // Toggle modal on button click
    const newToggleBtn = document.getElementById("languageToggle");
    console.log("Adding click listener to toggle button");

    newToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Toggle button clicked! Opening modal...");
      this.toggleLanguageModal();
    });

    // Add explicit button debugging
    newToggleBtn.style.border = "2px solid red"; // Debug border
    setTimeout(() => {
      if (newToggleBtn.style.border) {
        newToggleBtn.style.border = "";
      }
    }, 3000);

    // FIX: Event delegation kullanarak language option click'lerini handle et
    // Modal ve modal content'e listener ekle
    modal.addEventListener("click", (e) => {
      console.log("Modal clicked, target:", e.target);
      console.log("Target classes:", e.target.classList);

      // En yakın .language-option elementini bul
      const languageOption = e.target.closest(".language-option");
      console.log("Found language option:", languageOption);

      if (languageOption) {
        e.preventDefault();
        e.stopPropagation();

        const language = languageOption.getAttribute("data-language");
        console.log("Language option clicked via delegation:", language);

        if (language && this.supportedLanguages.includes(language)) {
          this.changeLanguage(language);
        } else {
          console.error("Invalid language selected:", language);
        }
      }
    });

    // BACKUP: Modal content'e de listener ekle (CSS pointer-events sorunu varsa)
    const modalContent = modal.querySelector(".language-modal-content");
    if (modalContent) {
      modalContent.addEventListener("click", (e) => {
        console.log("Modal content clicked, target:", e.target);

        const languageOption = e.target.closest(".language-option");
        if (languageOption) {
          e.preventDefault();
          e.stopPropagation();

          const language = languageOption.getAttribute("data-language");
          console.log("Language option clicked from modal content:", language);

          if (language && this.supportedLanguages.includes(language)) {
            this.changeLanguage(language);
          }
        }
      });
    }

    // BACKUP 2: Direkt language option'lara da listener ekle
    const languageOptions = modal.querySelectorAll(".language-option");
    console.log(
      "Found language options for direct binding:",
      languageOptions.length
    );

    languageOptions.forEach((option, index) => {
      console.log(`Adding direct listener to option ${index}:`, option);
      option.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const language = option.getAttribute("data-language");
        console.log("Direct language option clicked:", language);

        if (language && this.supportedLanguages.includes(language)) {
          this.changeLanguage(language);
        }
      });
    });

    // Prepare document click handler but don't add it yet
    this.documentClickHandler = (e) => {
      // Only close if modal is active and click is outside
      const modal = document.getElementById("languageModal");
      if (modal && modal.classList.contains("active")) {
        if (!e.target.closest(".language-selector-modern")) {
          console.log("Clicking outside modal, closing...");
          this.hideLanguageModal();
        }
      }
    };

    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideLanguageModal();
      }
    });

    // Update initial state
    this.updateLanguageSelector();

    console.log(
      "Modern language selector setup completed with event delegation"
    );
  }

  /**
   * Toggle language modal visibility
   */
  toggleLanguageModal() {
    console.log("toggleLanguageModal called");
    const modal = document.getElementById("languageModal");
    console.log("Modal element:", modal);

    if (modal) {
      const isActive = modal.classList.contains("active");
      console.log("Modal is currently active:", isActive);

      if (isActive) {
        this.hideLanguageModal();
      } else {
        this.showLanguageModal();
      }
    } else {
      console.error("Modal element not found!");
    }
  }

  /**
   * Show language modal
   */
  showLanguageModal() {
    console.log("showLanguageModal called");
    const modal = document.getElementById("languageModal");
    if (modal) {
      modal.classList.add("active");
      console.log("Language modal shown - active class added");
      console.log("Modal classes:", modal.classList.toString());

      // Add document click listener in next event loop to avoid immediate triggering
      setTimeout(() => {
        document.addEventListener("click", this.documentClickHandler);
        console.log("Document click listener added (delayed)");
      }, 0);
    } else {
      console.error("Modal element not found in showLanguageModal!");
    }
  }

  /**
   * Hide language modal
   */
  hideLanguageModal() {
    console.log("hideLanguageModal called");
    const modal = document.getElementById("languageModal");
    if (modal) {
      modal.classList.remove("active");
      console.log("Language modal hidden - active class removed");

      // Remove document click listener
      document.removeEventListener("click", this.documentClickHandler);
      console.log("Document click listener removed");
    } else {
      console.error("Modal element not found in hideLanguageModal!");
    }
  }

  /**
   * Update language selector visual state
   */
  updateLanguageSelector() {
    // Language names mapping
    const languageNames = {
      en: "English",
      tr: "Türkçe",
      ru: "Русский",
      de: "Deutsch",
      es: "Español",
      sa: "العربية",
      fr: "Français",
    };

    // Update current flag in toggle button
    const currentFlag = document.getElementById("currentFlag");
    if (currentFlag) {
      const newSrc = `assets/countryImages/${this.currentLanguage}.svg`;
      currentFlag.src = newSrc;
      currentFlag.alt = languageNames[this.currentLanguage] || "English";

      // Force image reload to ensure it displays correctly
      currentFlag.onerror = () => {
        console.error(`Failed to load flag: ${newSrc}`);
      };
      currentFlag.onload = () => {
        console.log(`✅ Flag loaded successfully: ${newSrc}`);
      };

      console.log(
        `Flag updated to: ${this.currentLanguage} (${
          languageNames[this.currentLanguage]
        })`
      );
    }

    // Update active state in modal options
    const languageOptions = document.querySelectorAll(".language-option");
    languageOptions.forEach((option) => {
      const language = option.getAttribute("data-language");
      if (language === this.currentLanguage) {
        option.classList.add("active");
        console.log(`Added active class to: ${language}`);
      } else {
        option.classList.remove("active");
      }
    });

    // Add animation to flag change
    const toggleBtn = document.getElementById("languageToggle");
    if (toggleBtn) {
      toggleBtn.classList.add("language-changing");
      setTimeout(() => {
        toggleBtn.classList.remove("language-changing");
      }, 400);
    }

    console.log("Language selector updated for:", this.currentLanguage);
  }

  /**
   * Initialize AJAX navigation listeners for page transitions
   */
  initAjaxNavigationListeners() {
    console.log("Setting up AJAX navigation listeners...");

    // Listen for URL changes (history.pushState/replaceState)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        console.log("URL changed to:", url);
        // Delay to ensure new content is loaded
        setTimeout(() => this.handlePageTransition(), 300);
      }
    }).observe(document, { subtree: true, childList: true });

    // Listen for popstate events (back/forward button)
    window.addEventListener("popstate", () => {
      console.log("Popstate event triggered");
      setTimeout(() => this.handlePageTransition(), 300);
    });

    // Listen for custom page transition events (if the theme uses them)
    document.addEventListener("pageTransitionComplete", () => {
      console.log("Page transition complete event triggered");
      this.handlePageTransition();
    });

    // Listen for hash changes
    window.addEventListener("hashchange", () => {
      console.log("Hash change detected");
      setTimeout(() => this.handlePageTransition(), 100);
    });

    // Observe DOM changes to detect new content
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // Check if new nodes contain translatable content
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                node.querySelector &&
                (node.querySelector("[data-i18n]") ||
                  (node.hasAttribute && node.hasAttribute("data-i18n")))
              ) {
                shouldReapply = true;
              }
            }
          });
        }
      });

      if (shouldReapply) {
        console.log(
          "New translatable content detected, reapplying translations"
        );
        setTimeout(() => this.applyTranslations(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("AJAX navigation listeners initialized");
  }

  /**
   * Handle page transitions
   */
  handlePageTransition() {
    console.log("Handling page transition...");

    // Reapply translations to new content
    this.applyTranslations();

    // Update language selector visual state (flag and active states)
    this.updateLanguageSelector();

    // Re-initialize language selector if needed
    this.initLanguageSelector();

    // Update HTML lang attribute
    this.updateHtmlLang();

    // Reinitialize language selector if needed
    const toggleBtn = document.getElementById("languageToggle");
    if (toggleBtn && !toggleBtn.hasAttribute("data-i18n-initialized")) {
      console.log(
        "Language selector not found or not initialized, reinitializing..."
      );
      this.initLanguageSelector();
    } else {
      // Just update the visual state
      this.updateLanguageSelector();
    }

    console.log("Page transition handled successfully");
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
    console.log("Toggle button:", document.getElementById("languageToggle"));
    console.log("Modal:", document.getElementById("languageModal"));
    return this;
  }

  /**
   * Manual modal toggle for testing
   */
  testModal() {
    console.log("Manual modal test");
    this.toggleLanguageModal();
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

// Additional fallback for AJAX-loaded content - try multiple times
setTimeout(() => {
  if (!window.i18n) {
    console.log("Emergency fallback initialization after 1s...");
    window.i18n = new I18n();
  } else if (window.i18n && !document.getElementById("languageToggle")) {
    console.log("Re-initializing i18n system due to missing elements...");
    window.i18n.initLanguageSelector();
  }
}, 1000);

setTimeout(() => {
  if (window.i18n && !document.getElementById("languageToggle")) {
    console.log("Re-initializing i18n system due to missing elements (2s)...");
    window.i18n.initLanguageSelector();
  }
}, 2000);

setTimeout(() => {
  if (window.i18n && !document.getElementById("languageToggle")) {
    console.log("Re-initializing i18n system due to missing elements (3s)...");
    window.i18n.initLanguageSelector();
  }
}, 3000);

// Periodic check for AJAX content updates
setInterval(() => {
  if (window.i18n && window.i18n.currentLanguage !== "en") {
    // Check if we have untranslated content
    const untranslatedElements = document.querySelectorAll("[data-i18n]");
    let hasUntranslated = false;

    untranslatedElements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const currentText = el.textContent.trim();

      // Check if element shows English text when language is not English
      if (
        key === "nav.index" &&
        currentText === "Index" &&
        window.i18n.currentLanguage === "tr"
      ) {
        hasUntranslated = true;
      }
      if (
        key === "nav.projects" &&
        currentText === "Projects" &&
        window.i18n.currentLanguage === "tr"
      ) {
        hasUntranslated = true;
      }
      if (
        key === "nav.about" &&
        currentText === "Agency" &&
        window.i18n.currentLanguage === "tr"
      ) {
        hasUntranslated = true;
      }
      if (
        key === "nav.resources" &&
        currentText === "Resources" &&
        window.i18n.currentLanguage === "tr"
      ) {
        hasUntranslated = true;
      }
    });

    if (hasUntranslated) {
      console.log("Detected untranslated content, reapplying translations...");
      window.i18n.applyTranslations();
    }
  }
}, 2000); // Check every 2 seconds

// Global click handler for debugging
document.addEventListener("click", function (e) {
  if (e.target.closest("#languageToggle")) {
    console.log("GLOBAL: Language toggle clicked!");
    if (window.i18n) {
      console.log("GLOBAL: Calling toggleLanguageModal via global handler");
      window.i18n.toggleLanguageModal();
    }
  }
});

// MutationObserver to detect when language selector is added to DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const toggleBtn = document.getElementById("languageToggle");
      if (
        toggleBtn &&
        window.i18n &&
        !toggleBtn.hasAttribute("data-i18n-initialized")
      ) {
        console.log(
          "MutationObserver: Language toggle detected, reinitializing..."
        );
        toggleBtn.setAttribute("data-i18n-initialized", "true");
        window.i18n.initLanguageSelector();
      }
    }
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Global function to force reapply translations (useful for AJAX pages)
window.reapplyTranslations = function () {
  if (window.i18n) {
    console.log("Force reapplying translations via global function");
    window.i18n.applyTranslations();
    window.i18n.updateLanguageSelector();
  }
};

// Global function to handle page transitions manually
window.handlePageTransition = function () {
  if (window.i18n) {
    console.log("Manual page transition trigger via global function");
    window.i18n.handlePageTransition();
  }
};

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = I18n;
}

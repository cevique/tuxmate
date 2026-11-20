(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "tuxmate-theme";
  var meta = document.getElementById("theme-color");

  function getStoredTheme() {
    try {
      var value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : "dark";
    } catch (error) {
      return "dark";
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (meta) {
      meta.setAttribute("content", theme === "light" ? "#f3f6fb" : "#0b1220");
    }

    var button = document.getElementById("theme-toggle");

    if (button) {
      var isLight = theme === "light";
      button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("aria-pressed", String(isLight));
    }
  }

  applyTheme(getStoredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");

    if (!button) {
      return;
    }

    applyTheme(root.getAttribute("data-theme") || "dark");

    button.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  });
})();

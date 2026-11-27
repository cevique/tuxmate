(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "tuxmate-theme";
  var windowMarker = "tuxmate-theme=";
  var meta = document.getElementById("theme-color");

  function readLocal() {
    try {
      var value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function writeLocal(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      return;
    }
  }

  function readWindowName() {
    try {
      var parts = String(window.name || "").split(";");

      for (var index = 0; index < parts.length; index += 1) {
        if (parts[index].indexOf(windowMarker) === 0) {
          var value = parts[index].slice(windowMarker.length);
          return value === "light" || value === "dark" ? value : null;
        }
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function writeWindowName(theme) {
    try {
      var parts = String(window.name || "").split(";").filter(function (part) {
        return part.indexOf(windowMarker) !== 0;
      });

      parts.push(windowMarker + theme);
      window.name = parts.join(";");
    } catch (error) {
      return;
    }
  }

  function readCookie() {
    try {
      var parts = document.cookie.split(";");

      for (var index = 0; index < parts.length; index += 1) {
        var part = parts[index].replace(/^\s+/, "");

        if (part.indexOf(storageKey + "=") === 0) {
          var value = part.slice(storageKey.length + 1);
          return value === "light" || value === "dark" ? value : null;
        }
      }
    } catch (error) {
      return null;
    }

    return null;
  }

  function writeCookie(theme) {
    try {
      document.cookie = storageKey + "=" + theme + ";path=/;max-age=31536000;SameSite=Lax";
    } catch (error) {
      return;
    }
  }

  function readTheme() {
    return readLocal() || readWindowName() || readCookie() || "dark";
  }

  function saveTheme(theme) {
    writeLocal(theme);
    writeWindowName(theme);
    writeCookie(theme);
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
      button.setAttribute("aria-keyshortcuts", "Control+Shift+D");
      button.title = "Toggle theme (Ctrl+Shift+D)";
    }
  }

  function toggleTheme() {
    var nextTheme = readTheme() === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  }

  applyTheme(readTheme());

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(readTheme());

    var button = document.getElementById("theme-toggle");

    if (button) {
      button.addEventListener("click", toggleTheme);
    }
  });

  window.addEventListener("pageshow", function () {
    applyTheme(readTheme());
  });

  window.addEventListener("storage", function (event) {
    if (event.key === storageKey && (event.newValue === "light" || event.newValue === "dark")) {
      applyTheme(event.newValue);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
      event.preventDefault();
      toggleTheme();
    }
  });
})();

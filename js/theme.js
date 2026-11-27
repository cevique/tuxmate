(function () {
  "use strict";

  var root = document.documentElement;
  var storageKey = "tuxmate-theme";
  var windowMarker = "tuxmate-theme=";
  var meta = document.getElementById("theme-color");
  var currentTheme = "dark";

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

  function readUrlTheme() {
    try {
      var match = /(?:^|[?&])theme=(light|dark)(?:[&#]|$)/.exec(window.location.search || "");
      return match ? match[1] : null;
    } catch (error) {
      return null;
    }
  }

  function readInitialTheme() {
    return readUrlTheme() || readLocal() || readWindowName() || readCookie() || "dark";
  }

  function saveTheme(theme) {
    writeLocal(theme);
    writeWindowName(theme);
    writeCookie(theme);
  }

  function applyTheme(theme) {
    currentTheme = theme;
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

  function cleanQuery(query, theme) {
    var parts = query ? query.split("&").filter(function (part) {
      return part.indexOf("theme=") !== 0;
    }) : [];

    parts.push("theme=" + theme);
    return parts.join("&");
  }

  function updateUrlTheme(theme) {
    try {
      if (!window.history || typeof window.history.replaceState !== "function") {
        return;
      }

      var href = window.location.href || "";
      var hashIndex = href.indexOf("#");
      var hash = hashIndex !== -1 ? href.slice(hashIndex) : "";
      var base = hashIndex !== -1 ? href.slice(0, hashIndex) : href;
      var queryIndex = base.indexOf("?");
      var path = queryIndex !== -1 ? base.slice(0, queryIndex) : base;
      var query = queryIndex !== -1 ? base.slice(queryIndex + 1) : "";

      window.history.replaceState(null, "", path + "?" + cleanQuery(query, theme) + hash);
    } catch (error) {
      return;
    }
  }

  function withThemeParam(href) {
    var hashIndex = href.indexOf("#");
    var hash = hashIndex !== -1 ? href.slice(hashIndex) : "";
    var base = hashIndex !== -1 ? href.slice(0, hashIndex) : href;
    var queryIndex = base.indexOf("?");
    var path = queryIndex !== -1 ? base.slice(0, queryIndex) : base;
    var query = queryIndex !== -1 ? base.slice(queryIndex + 1) : "";

    return path + "?" + cleanQuery(query, currentTheme) + hash;
  }

  function toggleTheme() {
    var nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
    updateUrlTheme(nextTheme);
  }

  function syncFromUrl() {
    var fromUrl = readUrlTheme();

    if (fromUrl && fromUrl !== currentTheme) {
      applyTheme(fromUrl);
      saveTheme(fromUrl);
      return;
    }

    applyTheme(currentTheme);
  }

  applyTheme(readInitialTheme());
  saveTheme(currentTheme);

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme);

    var button = document.getElementById("theme-toggle");

    if (button) {
      button.addEventListener("click", toggleTheme);
    }
  });

  window.addEventListener("pageshow", syncFromUrl);
  window.addEventListener("popstate", syncFromUrl);

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

  document.addEventListener("click", function (event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !event.target ||
      typeof event.target.closest !== "function"
    ) {
      return;
    }

    var link = event.target.closest("a[href]");

    if (!link) {
      return;
    }

    var href = link.getAttribute("href");

    if (!href || href.charAt(0) === "#" || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) {
      return;
    }

    link.setAttribute("href", withThemeParam(href));
  });
})();

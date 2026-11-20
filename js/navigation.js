(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("primary-menu");
  var toggleLabel = document.querySelector(".nav__toggle-label");

  function setMenu(open) {
    if (!menu || !toggle) {
      return;
    }

    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");

    if (toggleLabel) {
      toggleLabel.textContent = open ? "Close" : "Menu";
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (
        menu.classList.contains("is-open") &&
        header &&
        !header.contains(event.target)
      ) {
        setMenu(false);
      }
    });

    var desktopQuery = window.matchMedia("(min-width: 48rem)");

    function handleDesktopChange(event) {
      if (event.matches) {
        setMenu(false);
      }
    }

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleDesktopChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleDesktopChange);
    }
  }
})();

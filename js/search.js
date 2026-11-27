(function () {
  "use strict";

  var searchItems = [
    {
      title: "TuxMate landing page",
      description: "A free Linux learning adventure with pathways, lessons, practice and quests.",
      url: "index.html",
      keywords: "welcome linux adventure landing start"
    },
    {
      title: "Home dashboard",
      description: "Your personal starting point for lessons, practice and quest progress.",
      url: "home.html",
      keywords: "home dashboard progress start account"
    },
    {
      title: "Learn Linux",
      description: "Browse the learning pathways from Linux foundations to Bash scripting.",
      url: "learn.html",
      keywords: "learn lessons pathways linux terminal bash foundations explorer apprentice"
    },
    {
      title: "Bash playground",
      description: "See the planned safe simulator interface and the small command set it will support.",
      url: "playground.html",
      keywords: "practice playground shell simulator terminal commands sandbox safe"
    },
    {
      title: "Practice overview",
      description: "Read how the simulated shell stays safe and why it never runs real commands.",
      url: "practice.html",
      keywords: "practice safety simulator sandbox virtual filesystem"
    },
    {
      title: "Linux foundations",
      description: "Learn what Linux is, how the kernel and shell fit together, and why open source matters.",
      url: "linux.html",
      keywords: "linux foundations kernel gnu shell open source operating system"
    },
    {
      title: "Linux distributions",
      description: "Compare Ubuntu, Linux Mint, Debian, Fedora and Arch Linux, their subflavours and package tools.",
      url: "distros.html",
      keywords: "distros distributions ubuntu mint debian fedora arch beginner compare flavours kali raspberry parrot"
    },
    {
      title: "Installation guide",
      description: "Understand live sessions, disk choices, dual booting and virtual machines before installing Linux.",
      url: "installation.html",
      keywords: "installation install live usb dual boot virtual machine disk backup"
    },
    {
      title: "Terminal basics",
      description: "Learn the prompt, filesystem paths, navigation and safe commands such as pwd, ls and cd.",
      url: "terminal.html",
      keywords: "terminal shell prompt filesystem pwd ls cd mkdir absolute relative path"
    },
    {
      title: "Package managers",
      description: "Learn repositories, dependencies and how APT installs, updates and removes software.",
      url: "package-manager.html",
      keywords: "packages package manager apt repository dependency install update upgrade"
    },
    {
      title: "Bash scripting",
      description: "Build a first Bash script with variables, input, conditions, loops and functions.",
      url: "bash.html",
      keywords: "bash scripting script variables echo read if for while function shebang"
    },
    {
      title: "Quests",
      description: "Track challenges, XP and badges as your Linux skills grow.",
      url: "quests.html",
      keywords: "quests xp badges challenges achievements progress"
    },
    {
      title: "About TuxMate",
      description: "Learn about the project, its team and the Introduction to ICT course.",
      url: "about.html",
      keywords: "about project team course ict battler parri mani"
    },
    {
      title: "Learning path preview",
      description: "See the four pathways: Linux Foundations, Terminal Explorer, Bash Apprentice and Quest Master.",
      url: "index.html#pathways",
      keywords: "learning path preview linux foundations terminal explorer bash apprentice quest master"
    },
    {
      title: "Featured lessons",
      description: "Preview lessons about the terminal, moving around the filesystem and writing a Bash script.",
      url: "index.html#lessons",
      keywords: "featured lessons terminal pwd ls cd echo bash script filesystem"
    },
    {
      title: "Practice and quests preview",
      description: "Preview the simulated Bash Playground and the quest log.",
      url: "index.html#practice",
      keywords: "practice quests playground simulation xp badges"
    }
  ];

  var button = document.getElementById("search-toggle");

  if (!button) {
    return;
  }

  var overlay = document.createElement("div");
  overlay.className = "search";
  overlay.id = "site-search";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Search TuxMate");
  overlay.innerHTML = [
    '<div class="search__panel">',
    '  <div class="search__top">',
    '    <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">',
    '      <circle cx="11" cy="11" r="7"></circle>',
    '      <path d="m20 20-3.5-3.5"></path>',
    '    </svg>',
    '    <input class="search__input" id="site-search-input" type="search" placeholder="Search pages, lessons, practice and quests" aria-label="Search TuxMate" autocomplete="off" spellcheck="false">',
    '    <button class="icon-btn search__close" type="button" aria-label="Close search">',
    '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">',
    '        <path d="M6 6l12 12M18 6 6 18"></path>',
    '      </svg>',
    '    </button>',
    '  </div>',
    '  <div class="search__body">',
    '    <p class="search__hint" id="search-hint" aria-live="polite">Popular pages</p>',
    '    <ul class="search__results" id="search-results"></ul>',
    '  </div>',
    '  <div class="search__footer">',
    '    <span>Enter to open &middot; Esc to close</span>',
    '    <span>TuxMate search</span>',
    '  </div>',
    '</div>'
  ].join("");

  document.body.appendChild(overlay);

  var input = overlay.querySelector(".search__input");
  var closeButton = overlay.querySelector(".search__close");
  var resultsList = overlay.querySelector(".search__results");
  var hint = overlay.querySelector(".search__hint");
  var lastFocused = null;

  function getMatches(query) {
    var normalized = query.trim().toLowerCase();

    if (!normalized) {
      return searchItems.slice();
    }

    var terms = normalized.split(/\s+/);

    return searchItems.filter(function (item) {
      var haystack = [item.title, item.description, item.keywords].join(" ").toLowerCase();
      return terms.every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
    });
  }

  function renderResults(query) {
    var matches = getMatches(query);
    resultsList.textContent = "";

    if (!matches.length) {
      hint.textContent = "No results";
      var empty = document.createElement("li");
      empty.className = "search__empty";
      empty.textContent = "No pages matched that search. Try “terminal”, “quests” or “about”.";
      resultsList.appendChild(empty);
      return;
    }

    hint.textContent = query.trim()
      ? matches.length + (matches.length === 1 ? " result" : " results")
      : "Popular pages";

    matches.forEach(function (item) {
      var listItem = document.createElement("li");
      listItem.className = "search__result";
      var link = document.createElement("a");
      link.href = item.url;
      var title = document.createElement("span");
      title.className = "search__result-title";
      title.textContent = item.title;
      var description = document.createElement("span");
      description.className = "search__result-desc";
      description.textContent = item.description;
      link.appendChild(title);
      link.appendChild(description);
      listItem.appendChild(link);
      resultsList.appendChild(listItem);
    });
  }

  function openSearch() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    button.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-search-open");
    input.value = "";
    renderResults("");
    input.focus();
  }

  function closeSearch() {
    overlay.hidden = true;
    button.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-search-open");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function isTypingTarget(target) {
    if (!target) {
      return false;
    }

    var tagName = target.tagName.toLowerCase();
    return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
  }

  button.addEventListener("click", openSearch);
  closeButton.addEventListener("click", closeSearch);
  input.addEventListener("input", function () {
    renderResults(input.value);
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeSearch();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!overlay.hidden) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key === "Tab") {
        var focusable = overlay.querySelectorAll("a[href], button:not([disabled]), input:not([disabled])");
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }

      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
      return;
    }

    if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      openSearch();
    }
  });
})();

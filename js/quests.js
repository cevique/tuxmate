(function () {
  "use strict";

  var storageKey = "tuxmate-quest-progress";
  var questIds = ["first-command", "filesystem", "packages", "first-script"];
  var badgeRules = {
    "terminal-initiate": ["first-command"],
    "path-finder": ["filesystem"],
    "package-pilot": ["packages"],
    "script-sprout": ["first-script"],
    "quest-master": questIds
  };

  function readProgress() {
    try {
      var stored = localStorage.getItem(storageKey);
      var parsed = stored ? JSON.parse(stored) : [];

      if (!Array.isArray(parsed)) {
        return [];
      }

      var valid = [];

      parsed.forEach(function (id) {
        if (questIds.indexOf(id) !== -1 && valid.indexOf(id) === -1) {
          valid.push(id);
        }
      });

      return valid;
    } catch (error) {
      return [];
    }
  }

  function saveProgress(ids) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
    } catch (error) {
      return;
    }
  }

  function render(ids) {
    var checkboxes = document.querySelectorAll("[data-quest]");
    var count = ids.length;

    Array.prototype.forEach.call(checkboxes, function (input) {
      var isDone = ids.indexOf(input.getAttribute("data-quest")) !== -1;
      var card = input.closest("[data-quest-card]");
      var status = card ? card.querySelector("[data-quest-status]") : null;

      input.checked = isDone;

      if (card) {
        card.classList.toggle("is-complete", isDone);
      }

      if (status) {
        status.textContent = isDone ? "Complete" : "Open";
      }
    });

    var progress = document.getElementById("quest-progress");

    if (progress) {
      progress.max = questIds.length;
      progress.value = count;
    }

    var label = document.getElementById("quest-progress-label");

    if (label) {
      label.textContent = count + " of " + questIds.length + " complete";
    }

    var xp = document.getElementById("quest-xp");

    if (xp) {
      xp.textContent = count * 50 + " XP";
    }

    Object.keys(badgeRules).forEach(function (badgeId) {
      var badge = document.querySelector('[data-badge="' + badgeId + '"]');

      if (!badge) {
        return;
      }

      var unlocked = badgeRules[badgeId].every(function (questId) {
        return ids.indexOf(questId) !== -1;
      });
      var status = badge.querySelector("[data-badge-status]");

      badge.classList.toggle("is-unlocked", unlocked);

      if (status) {
        status.textContent = unlocked ? "Unlocked" : "Locked";
      }
    });
  }

  var completed = readProgress();
  render(completed);

  Array.prototype.forEach.call(document.querySelectorAll("[data-quest]"), function (input) {
    input.addEventListener("change", function () {
      var id = input.getAttribute("data-quest");
      var index = completed.indexOf(id);

      if (input.checked && index === -1) {
        completed.push(id);
      }

      if (!input.checked && index !== -1) {
        completed.splice(index, 1);
      }

      saveProgress(completed);
      render(completed);
    });
  });

  var resetButton = document.getElementById("reset-quests");

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      completed = [];
      saveProgress(completed);
      render(completed);
    });
  }
})();

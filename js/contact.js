(function () {
  "use strict";

  var form = document.getElementById("contact-form");

  if (!form) {
    return;
  }

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = [
    {
      id: "contact-name",
      message: "Enter your name using at least 2 characters.",
      test: function (value) {
        return value.length >= 2 && value.length <= 60;
      }
    },
    {
      id: "contact-email",
      message: "Enter a valid email address, such as name@example.com.",
      test: function (value) {
        return value.length <= 254 && emailPattern.test(value);
      }
    },
    {
      id: "contact-message",
      message: "Write a message between 10 and 1000 characters.",
      test: function (value) {
        return value.length >= 10 && value.length <= 1000;
      }
    }
  ];

  function clearError(rule) {
    var field = document.getElementById(rule.id);
    var error = document.getElementById(rule.id + "-error");

    if (field) {
      field.removeAttribute("aria-invalid");
    }

    if (error) {
      error.textContent = "";

      if (error.parentNode) {
        error.parentNode.classList.remove("is-invalid");
      }
    }
  }

  function showError(rule) {
    var field = document.getElementById(rule.id);
    var error = document.getElementById(rule.id + "-error");

    if (field) {
      field.setAttribute("aria-invalid", "true");
    }

    if (error) {
      error.textContent = rule.message;

      if (error.parentNode) {
        error.parentNode.classList.add("is-invalid");
      }
    }
  }

  function validate(rule) {
    var field = document.getElementById(rule.id);

    if (!field) {
      return false;
    }

    var value = String(field.value || "").trim();
    field.value = value;

    if (rule.test(value)) {
      clearError(rule);
      return true;
    }

    showError(rule);
    return false;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;
    var firstInvalid = null;

    rules.forEach(function (rule) {
      if (!validate(rule) && isValid) {
        isValid = false;
        firstInvalid = document.getElementById(rule.id);
      }
    });

    if (!isValid) {
      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }

    form.submit();
  });

  rules.forEach(function (rule) {
    var field = document.getElementById(rule.id);

    if (field) {
      field.addEventListener("input", function () {
        clearError(rule);
      });
    }
  });
})();

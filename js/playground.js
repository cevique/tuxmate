(function () {
  "use strict";

  var output = document.getElementById("terminal-output");
  var form = document.getElementById("terminal-form");
  var input = document.getElementById("terminal-input");
  var pathLabel = document.getElementById("terminal-path-label");

  if (!output || !form || !input) {
    return;
  }

  var homePath = ["home", "tux"];
  var root;
  var currentPath;
  var history = [];
  var historyIndex = 0;
  var activeExercise = null;

  var exercises = {
    "print-location": {
      goal: "Print the current folder from the home directory.",
      command: "pwd",
      expected: "/home/tux",
      message: "Dry run complete: pwd reported /home/tux."
    },
    "list-files": {
      goal: "List the three items in the home directory.",
      command: "ls",
      expected: "notes.txt  projects  welcome.md",
      message: "Dry run complete: ls listed notes.txt, projects and welcome.md."
    },
    "read-note": {
      goal: "Read the text stored in notes.txt.",
      command: "cat notes.txt",
      expected: "Buy milk\nFinish the Linux lesson",
      message: "Dry run complete: cat displayed the two saved lines."
    }
  };

  function makeDir(children) {
    return { type: "dir", children: children || {} };
  }

  function makeFile(content) {
    return { type: "file", content: content };
  }

  function createVirtualFilesystem() {
    return makeDir({
      home: makeDir({
        tux: makeDir({
          "notes.txt": makeFile("Buy milk\nFinish the Linux lesson"),
          "welcome.md": makeFile("# Welcome\nTuxMate keeps practice local."),
          projects: makeDir({
            "hello.sh": makeFile("#!/bin/bash\necho Hello, TuxMate!"),
            "todo.txt": makeFile("Try the ls command")
          })
        })
      })
    });
  }

  function line(text, kind) {
    return { text: text, kind: kind || "output" };
  }

  function appendLine(text, kind) {
    var paragraph = document.createElement("p");

    if (kind === "output" || kind === "error" || kind === "info") {
      paragraph.className = "terminal__output terminal__output--" + kind;
    }

    paragraph.textContent = text;
    output.appendChild(paragraph);
    output.scrollTop = output.scrollHeight;
  }

  function appendPrompt(command) {
    var paragraph = document.createElement("p");
    var prompt = document.createElement("span");
    var path = document.createElement("span");
    var typed = document.createElement("span");

    prompt.className = "terminal__prompt";
    prompt.textContent = "tux@tuxmate:";
    path.className = "terminal__path";
    path.textContent = displayPath(currentPath);
    typed.className = "terminal__command";
    typed.textContent = command;

    paragraph.appendChild(prompt);
    paragraph.appendChild(path);
    paragraph.appendChild(document.createTextNode("$ "));
    paragraph.appendChild(typed);
    output.appendChild(paragraph);
    output.scrollTop = output.scrollHeight;
  }

  function appendSegments(parts, value) {
    value.split("/").forEach(function (segment) {
      if (segment === "" || segment === ".") {
        return;
      }

      if (segment === "..") {
        if (parts.length > 0) {
          parts.pop();
        }
        return;
      }

      parts.push(segment);
    });
  }

  function resolvePath(value) {
    var raw = value || "";
    var parts = [];

    if (raw === "" || raw === "~") {
      return homePath.slice();
    }

    if (raw.charAt(0) === "~") {
      parts = homePath.slice();
      appendSegments(parts, raw.slice(1));
    } else if (raw.charAt(0) === "/") {
      appendSegments(parts, raw);
    } else {
      parts = currentPath.slice();
      appendSegments(parts, raw);
    }

    return parts;
  }

  function matchesHome(parts) {
    return parts.length === homePath.length && homePath.every(function (part, index) {
      return parts[index] === part;
    });
  }

  function startsWithHome(parts) {
    return parts.length > homePath.length && homePath.every(function (part, index) {
      return parts[index] === part;
    });
  }

  function displayPath(parts) {
    if (matchesHome(parts)) {
      return "~";
    }

    if (startsWithHome(parts)) {
      return "~/" + parts.slice(homePath.length).join("/");
    }

    return "/" + parts.join("/");
  }

  function updatePathLabel() {
    if (pathLabel) {
      pathLabel.textContent = displayPath(currentPath);
    }
  }

  function getNode(parts) {
    var node = root;

    for (var index = 0; index < parts.length; index += 1) {
      if (node.type !== "dir" || !Object.prototype.hasOwnProperty.call(node.children, parts[index])) {
        return null;
      }
      node = node.children[parts[index]];
    }

    return node;
  }

  function currentDir() {
    return getNode(currentPath);
  }

  function sortedNames(dirNode, showHidden) {
    return Object.keys(dirNode.children).filter(function (name) {
      return showHidden || name.charAt(0) !== ".";
    }).sort();
  }

  function tokenize(text) {
    var tokens = [];
    var current = "";
    var quote = null;
    var started = false;

    for (var index = 0; index < text.length; index += 1) {
      var character = text.charAt(index);

      if (quote) {
        if (character === quote) {
          quote = null;
        } else {
          current += character;
        }
      } else if (character === "\"" || character === "'") {
        quote = character;
        started = true;
      } else if (/\s/.test(character)) {
        if (started) {
          tokens.push(current);
          current = "";
          started = false;
        }
      } else {
        current += character;
        started = true;
      }
    }

    if (quote) {
      return { error: "Unclosed quote: finish the quote before pressing Enter." };
    }

    if (started) {
      tokens.push(current);
    }

    return { tokens: tokens };
  }

  function translateCommand(tokens) {
    var joined = tokens.join(" ");
    var operators = [">", "<", "|", "&&", ";", "$("];

    for (var index = 0; index < operators.length; index += 1) {
      if (joined.indexOf(operators[index]) !== -1) {
        return {
          error: "Operators such as " + operators[index] + " are not simulated. Type help for the allowed commands."
        };
      }
    }

    return { name: tokens[0].toLowerCase(), args: tokens.slice(1) };
  }

  var commands = {
    pwd: function () {
      return [line("/" + currentPath.join("/"))];
    },

    ls: function (args) {
      var showHidden = false;
      var longFormat = false;
      var target = null;

      for (var index = 0; index < args.length; index += 1) {
        var arg = args[index];

        if (arg === "-a") {
          showHidden = true;
        } else if (arg === "-l") {
          longFormat = true;
        } else if (arg.charAt(0) === "-") {
          return [line("ls: unknown option " + arg + ". Use -a or -l.", "error")];
        } else if (target === null) {
          target = arg;
        } else {
          return [line("ls: this simulation accepts one folder at a time.", "error")];
        }
      }

      var dirNode = target === null ? currentDir() : getNode(resolvePath(target));

      if (!dirNode) {
        return [line("ls: no such folder: " + target, "error")];
      }

      if (dirNode.type !== "dir") {
        return [line("ls: not a folder: " + target, "error")];
      }

      var names = sortedNames(dirNode, showHidden);

      if (longFormat) {
        return names.map(function (name) {
          return line(dirNode.children[name].type + "  " + name);
        });
      }

      return names.length ? [line(names.join("  "))] : [];
    },

    cd: function (args) {
      if (args.length > 1) {
        return [line("cd: give one folder path, for example cd projects.", "error")];
      }

      var parts = resolvePath(args[0]);
      var node = getNode(parts);

      if (!node) {
        return [line("cd: no such folder: " + args[0], "error")];
      }

      if (node.type !== "dir") {
        return [line("cd: not a folder: " + args[0], "error")];
      }

      currentPath = parts;
      updatePathLabel();
      return [];
    },

    cat: function (args) {
      if (args.length !== 1) {
        return [line("cat: give exactly one file name.", "error")];
      }

      var node = getNode(resolvePath(args[0]));

      if (!node) {
        return [line("cat: no such file: " + args[0], "error")];
      }

      if (node.type !== "file") {
        return [line("cat: that is a folder, not a file.", "error")];
      }

      return node.content.split("\n").map(function (text) {
        return line(text);
      });
    },

    mkdir: function (args) {
      var dirNode = currentDir();
      var results = [];

      if (!args.length) {
        return [line("mkdir: give a folder name.", "error")];
      }

      args.forEach(function (name) {
        if (name.indexOf("/") !== -1) {
          results.push(line("mkdir: use a single name, without a path: " + name, "error"));
          return;
        }

        if (Object.prototype.hasOwnProperty.call(dirNode.children, name)) {
          results.push(line("mkdir: already exists: " + name, "error"));
          return;
        }

        dirNode.children[name] = makeDir();
        results.push(line("mkdir: created " + name, "info"));
      });

      return results;
    },

    touch: function (args) {
      var dirNode = currentDir();
      var results = [];

      if (!args.length) {
        return [line("touch: give a file name.", "error")];
      }

      args.forEach(function (name) {
        if (name.indexOf("/") !== -1) {
          results.push(line("touch: use a single name, without a path: " + name, "error"));
          return;
        }

        if (Object.prototype.hasOwnProperty.call(dirNode.children, name)) {
          results.push(line("touch: already exists: " + name, "info"));
          return;
        }

        dirNode.children[name] = makeFile("");
        results.push(line("touch: created " + name, "info"));
      });

      return results;
    },

    echo: function (args) {
      return [line(args.join(" "))];
    },

    help: function () {
      return [
        line("Allowed commands (simulation only):", "info"),
        line("pwd                 print the current virtual folder"),
        line("ls [-a] [-l] [path] list folder contents"),
        line("cd [path]           change the current virtual folder"),
        line("cat <file>          read a virtual text file"),
        line("mkdir <name>        create a virtual folder"),
        line("touch <name>        create an empty virtual file"),
        line("echo <text>         print text back to the terminal"),
        line("clear               clear the output area"),
        line("reset               restore the starting filesystem"),
        line("help                show this list")
      ];
    },

    clear: function () {
      output.textContent = "";
      return [];
    },

    reset: function () {
      resetSession();
      return [];
    }
  };

  function executeInstruction(instruction) {
    if (instruction.error) {
      return [line(instruction.error, "error")];
    }

    var handler = commands[instruction.name];

    if (!handler) {
      return [line("tuxmate: " + instruction.name + ": command not supported in this simulation. Type help.", "error")];
    }

    return handler(instruction.args);
  }

  function checkExercise(results) {
    if (!activeExercise || !results.length) {
      return;
    }

    var exercise = exercises[activeExercise];
    var actual = results.map(function (entry) {
      return entry.text;
    }).join("\n");

    if (actual !== exercise.expected) {
      return;
    }

    appendLine(exercise.message, "info");

    var card = document.querySelector('[data-exercise-card="' + activeExercise + '"]');

    if (card) {
      card.classList.add("is-done");
      var status = card.querySelector("[data-exercise-status]");

      if (status) {
        status.textContent = "Complete";
      }
    }

    activeExercise = null;
  }

  function processLine(text) {
    var parsed = tokenize(text);

    if (parsed.error) {
      appendLine(parsed.error, "error");
      return;
    }

    if (!parsed.tokens.length) {
      return;
    }

    var instruction = translateCommand(parsed.tokens);
    var results = executeInstruction(instruction);

    results.forEach(function (entry) {
      appendLine(entry.text, entry.kind);
    });

    checkExercise(results);
  }

  function resetSession() {
    root = createVirtualFilesystem();
    currentPath = homePath.slice();
    updatePathLabel();
    appendLine("TuxMate Bash Playground (simulation)", "info");
    appendLine("Type help for the allowed commands. No real commands are run.", "info");
  }

  function startExercise(id) {
    var exercise = exercises[id];

    if (!exercise) {
      return;
    }

    resetSession();
    activeExercise = id;
    appendLine("Dry run: " + exercise.goal + " Suggested command: " + exercise.command, "info");

    var card = document.querySelector('[data-exercise-card="' + id + '"]');

    if (card) {
      var status = card.querySelector("[data-exercise-status]");

      if (status) {
        status.textContent = "Running";
      }
    }

    input.focus();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var command = input.value;

    input.value = "";
    history.push(command);
    historyIndex = history.length;
    appendPrompt(command);
    processLine(command);
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex];
    }

    if (event.key === "ArrowDown" && history.length) {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-exercise]"), function (button) {
    button.addEventListener("click", function () {
      startExercise(button.getAttribute("data-exercise"));
    });
  });

  var resetButton = document.getElementById("terminal-reset");

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      resetSession();
      input.focus();
    });
  }

  var clearButton = document.getElementById("terminal-clear");

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      output.textContent = "";
      input.focus();
    });
  }

  var helpButton = document.getElementById("terminal-help");

  if (helpButton) {
    helpButton.addEventListener("click", function () {
      appendPrompt("help");
      processLine("help");
      input.focus();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-command]"), function (button) {
    button.addEventListener("click", function () {
      input.value = button.getAttribute("data-command") || "";
      input.focus();
    });
  });

  resetSession();
})();

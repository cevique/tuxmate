# TuxMate

A friendly, browser-based adventure for learning Linux, terminal commands and Bash scripting. TuxMate uses a retro pixel-art RPG style, Tux and Byte mascots, short lessons, quests and a safe terminal simulator.

Built for the **Introduction to ICT** lab semester project by **Battler, Parri and Mani**.

## Features

- **14 independent HTML pages** with shared CSS and modular vanilla JavaScript.
- **Retro pixel-art design** with dark navy navigation, yellow/orange buttons and responsive desktop, tablet and mobile layouts.
- **Guided learning paths** covering Linux foundations, terminal basics, distributions, installation, package managers and Bash scripting.
- **Safe Bash Playground** — a JavaScript simulator with an isolated virtual filesystem. It never runs real shell commands and never uses `eval()`, `Function()` or `innerHTML` for student input.
- **Quests and badges** with local progress and five unlockable badge icons.
- **Light and dark themes** with a header toggle and a `Ctrl+Shift+D` keyboard shortcut. The choice persists across pages.
- **Local search**, mobile navigation, skip links, labelled controls and visible focus styles.
- **Contact form** powered by FormSubmit on the About page, with vanilla JavaScript validation.
- **No accounts, no backend, no tracking and no build step.**

## Getting started

No installation or build tools are required.

1. Download or clone the repository.
2. Open `index.html` in a modern browser, or serve the folder locally:

   ```bash
   python -m http.server 8000
   ```

   Then visit `http://localhost:8000`.

Opening the HTML files directly from disk also works. Some browsers restrict `localStorage` on `file://` URLs, so the theme also uses a cookie and `window.name` fallback to stay selected while you click between pages.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page and learning pathway preview |
| `home.html` | Dashboard with progress and quick links |
| `learn.html` | Lesson pathways |
| `linux.html` | Linux foundations |
| `distros.html` | Common distributions and package tools |
| `installation.html` | Installation concepts and preparation |
| `terminal.html` | Terminal and filesystem basics |
| `package-manager.html` | Repositories and APT basics |
| `bash.html` | Bash scripting basics |
| `practice.html` | Practice overview and simulator safety notes |
| `playground.html` | Interactive Bash simulator and dry-run exercises |
| `quests.html` | Quests, XP and badges |
| `about.html` | Project information, review cards and contact form |
| `404.html` | Friendly not-found page |

## Bash Playground

The playground in `playground.html` translates a small, fixed command set into safe JavaScript actions on a virtual filesystem. Supported commands are:

`pwd`, `ls`, `cd`, `cat`, `mkdir`, `touch`, `echo`, `clear`, `reset` and `help`.

- Shell operators such as `&&`, `|`, `>` and `;` are rejected with an explanatory error.
- Unsupported commands return: `tuxmate: <name>: command not supported in this simulation. Type help.`
- Three deterministic dry runs provide fixed expected output: `pwd`, `ls` and `cat notes.txt`.
- Command history is available with the Up and Down arrow keys.
- `reset` restores the starting virtual filesystem.

The simulator is deliberately limited so students can experiment without risk to their computer.

## Project structure

```text
tuxmate/
├── assets/                Local GIF, poster image and mascot PNGs
├── css/
│   ├── style.css          Theme tokens, layout, heroes and shared components
│   ├── components.css     Cards, badges, terminal UI and form styles
│   └── responsive.css     Breakpoints for tablet and mobile layouts
├── font/                  Locally hosted fonts
├── js/
│   ├── main.js            Footer year
│   ├── navigation.js      Mobile menu behaviour
│   ├── playground.js      Restricted Bash simulator
│   ├── quests.js          Quest progress and badge unlocking
│   ├── search.js          Local site search
│   └── theme.js           Light/dark theme persistence and shortcut
├── *.html                 Individual site pages
├── AGENTS.md              Project rules
├── LICENSE                MIT License
└── README.md              This file
```

All paths are relative and all assets are local.

## Development guidelines

- Keep markup to HTML5, styling to CSS3 and behaviour to vanilla JavaScript.
- Do not add frameworks, libraries, package managers or build tools.
- Reuse the shared CSS files instead of duplicating component styles.
- Keep quiz feedback and quest progress local with `localStorage`.
- Never execute real shell commands or evaluate student input.
- Test every page after making changes.

##  Community Contributors

We appreciate everyone who contributes to improving TuxMate!

If you've contributed to this project, add your name below through a pull request.

<!-- Add your name alphabetically -->

- Abdullah Sinan (@cevique)
- Muhammad Abdul Rehman (@AbdulRehman387)

## Contributors

Thanks to everyone who helped bring TuxMate to life!

<p align="center">
  <a href="https://github.com/cevique">
    <img src="https://github.com/cevique.png"
         width="100px" alt="cevique"/>
  </a>
  <a href="https://github.com/anfalcodes">
    <img src="https://github.com/anfalcodes.png"
         width="100px" alt="anfalcodes"/>
  </a>
  <a href="https://github.com/AbdulRehman387">
    <img src="https://github.com/AbdulRehman387.png"
         width="100px" alt="AbdulRehman387"/>
  </a>
</p>

<h2 align="center">⚔️ THE FOUNDING PARTY ⚔️</h2>

<p align="center">
  <img src="https://img.shields.io/badge/✦-BATTLER-FFD700?style=for-the-badge&labelColor=151515" />
  <img src="https://img.shields.io/badge/✦-PARRI-FF69B4?style=for-the-badge&labelColor=151515" />
  <img src="https://img.shields.io/badge/✦-MANI-32CD32?style=for-the-badge&labelColor=151515" />
</p>

<p align="center">
  <i>Three developers. One adventure. Endless commands.</i>
</p>

## License

MIT License. See [LICENSE](LICENSE) for the full text.

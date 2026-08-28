# DODIKI-GAME Agent Notes

## Project

This is a small browser game made with plain HTML, CSS, and JavaScript.
The current playable characters are KAREN and Razolter. The page opens with a character menu.

Main files:

- `index.html` contains the menu and game markup.
- `style.css` contains all visual styles, animations, layout, and responsive rules.
- `script.js` contains menu startup logic and game interactions.

## Rules For Agents

- Keep the project simple: no build tools, frameworks, or dependencies unless the user explicitly asks.
- Preserve the existing style: plain HTML/CSS/JS, cartoon-like CSS characters, and simple button controls.
- Do not remove or rewrite existing gameplay unless the user asks for that change.
- Do not change disabled menu characters into playable characters until their game logic exists.
- When adding a new character, add the menu button, character-specific markup/styles, and JavaScript behavior together.
- Keep KAREN and Razolter working when changing shared UI.
- Use Russian text for visible UI when adding labels, messages, or buttons.
- Make sure the game still works by opening `index.html` directly in a browser.
- Before committing, check `git status` and include only related files.

## Current Character Menu

Active:

- KAREN
- Razolter

Disabled / planned:

- Flaffy
- Sidius
- Игорь-Игорь
- B4CHA
- ЛЕГЕНДА
- MIND

## Publishing

The GitHub remote is:

`https://github.com/Mind315/DODIKI-GAME.git`

If push fails over HTTPS, use a GitHub Personal Access Token instead of a password.

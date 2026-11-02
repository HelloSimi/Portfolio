# Simran Rekhi – portfolio

A static portfolio site: plain HTML, CSS and JavaScript, no build step.

## Make it yours

Open `script.js` and edit the `CONFIG` block at the top: tagline, about text, skills and links. Nothing else needs changing. The project list loads public repositories from the GitHub account in `githubUser`.

## Show or hide sections

In the `CONFIG` block, `sections` has one switch for each part of the page: `tagline`, `about`, `skills`, `projects` and `contact`. Set a switch to `true` to show that part and `false` to hide it. A hidden part disappears completely, including its link in the top menu, and the page spacing adjusts by itself. Your text stays in `CONFIG`, so you can turn a part on later by changing one word.

The portrait photo has its own switch, `photo`. It can stay on even when the About text is off, and it is then shown as a framed portrait under the intro.

A part that is switched on but has no text is skipped too.

## Choose which projects show

Projects are loaded from your public GitHub repositories and kept for ten minutes, so reloading the page is fast. Two optional lists in `CONFIG` control what appears:

- `pinned`: repository names to show first, in the order you list them, for example `pinned: ['my-best-project']`. A pinned fork is shown too.
- `hideRepos`: repository names to leave out, for example `hideRepos: ['old-test']`.

Both are empty by default. Forks that are not pinned stay hidden. When your repositories use two or more languages, filter buttons appear above the list.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

## Publish with GitHub Pages

Repository → Settings → Pages → Deploy from a branch → `main` / root → Save.

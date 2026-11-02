# Simran Rekhi – portfolio

A small personal website: plain HTML, CSS and JavaScript. No build step, nothing to install.

## Change the text and links

Open `script.js`. The block at the very top, called `CONFIG`, is the only part you need to edit. Change a value, save, and refresh the page.

- `name`: your name, shown big at the top.
- `tagline`, `about`, `skills`, `contactText`: the texts for each section.
- `links`: the buttons in the Contact section. Add a line for each one, for example email or LinkedIn (examples are in the file, just remove the `//`).
- `githubUser`: your GitHub username. Your public repositories are listed as projects automatically.
- `badge`: the short text that circles around the avatar.

Keep the quotes and commas as they are in the file. If the page goes blank, a quote or comma was probably removed.

## Show or hide sections

`sections` has one switch for each part of the page: `tagline`, `about`, `skills`, `treks` (the Trails list), `projects` and `contact`. Set a switch to `true` to show that part and `false` to hide it. A hidden part disappears completely, including its link in the top menu, and the page spacing adjusts by itself. Your text stays in `CONFIG`, so you can turn a part on later by changing one word.

The portrait photo has its own switch, `photo`. It can stay on even when the About text is off, and it is then shown as a framed portrait under the intro.

A part that is switched on but has no text is skipped too.

## Add your trails

Turn on `sections.treks` and fill the `treks` list to show a Trails section. Each entry looks like this:

```
{ place: 'Trail or peak name', note: 'One short line about it.', year: '2024' }
```

`note` and `year` are optional. The list starts empty, with one example commented out, and the section stays hidden until you add something.

## Choose which projects show

Projects are loaded from your public GitHub repositories and kept for ten minutes, so reloading the page is fast. Two optional lists in `CONFIG` control what appears:

- `pinned`: repository names to show first, in the order you list them, for example `pinned: ['my-best-project']`. A pinned fork is shown too.
- `hideRepos`: repository names to leave out, for example `hideRepos: ['old-test']`.

Both are empty by default. Forks that are not pinned stay hidden. When your repositories use two or more languages, filter buttons appear above the list.

## Light and dark theme

The site is light by default. The round button in the top corner switches to a darker night view, and the choice is remembered in that browser. To change the colours, spacing, corner radius or shadow, edit the variables at the top of `style.css` (`:root` for the light palette, `:root[data-theme="dark"]` for the night one).

The page also sets its title and sharing text from `CONFIG`: the tagline when it is shown, otherwise a short line with your name.

## Run it on your computer

Open `index.html` in a browser. Or serve the folder, which behaves more like the real site:

```
python -m http.server 8000
```

Then visit http://localhost:8000.

## Publish with GitHub Pages

Repository → Settings → Pages → Deploy from a branch → `main` / root → Save. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`. A missing page shows `404.html`.

## Files

- `index.html`: the page structure.
- `style.css`: colours, fonts and layout.
- `script.js`: your `CONFIG` plus the page behaviour.
- `404.html`: the "page not found" page.
- `images/`: the avatar and the portrait photo. Replace a file with another of the same name to change it.

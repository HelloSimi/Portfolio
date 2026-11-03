# Simran Rekhi – portfolio

A small personal website: plain HTML, CSS and JavaScript. No build step, nothing to install.

## Change the text and links

Open `script.js`. The block at the very top, called `CONFIG`, is the only part you need to edit. Change a value, save, and refresh the page.

- `name`: your name, shown big at the top.
- `tagline`, `about`, `skills`, `contactText`: the texts for each section.
- `links`: the buttons in the Contact section. Add a line for each one, for example email or LinkedIn (examples are in the file, just remove the `//`).
- `githubUser`: your GitHub username. Your public repositories are listed as projects automatically.
- `badge`: the short text that circles around the avatar.
- `credit`: `false` by default. Set it to `true` to show a small "Design and code by Simran Rekhi" line in the footer, linking to this repository.

Keep the quotes and commas as they are in the file. If the page goes blank, a quote or comma was probably removed.

## Show or hide sections

`sections` has one switch for each part of the page: `tagline`, `about`, `skills`, `treks` (the Trails list), `projects` and `contact`. Set a switch to `true` to show that part and `false` to hide it. A hidden part disappears completely, including its link in the top menu, and the page spacing adjusts by itself. Your text stays in `CONFIG`, so you can turn a part on later by changing one word.

The portrait photo has its own switch, `photo`. It puts the cut-out photo in the camp scene next to the avatar, and when the About text is on it also appears beside that text. Set it to `false` and the avatar keeps camp on her own.

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

## Day, evening and night

The site opens in Day. The three small buttons in the top corner (sun, sunset and moon) switch the whole page and the camp scene to Day, Evening or Night, and the choice is remembered in that browser. To change the colours, spacing, corner radius or shadow, edit the variables at the top of `style.css`: `:root` holds the Day palette, `:root[data-theme="evening"]` the Evening one and `:root[data-theme="dark"]` the Night one.

The page also sets its title and sharing text from `CONFIG`: the tagline when it is shown, otherwise a short line with your name.

## Optional pose pictures

The two characters roam the valley using the original pictures, and the scene needs nothing else. To give them more poses, put transparent PNGs with the feet at the bottom edge in `images/poses/` and list them in `images/poses/poses.json`:

```
{
  "c-walk-right-1.png": { "facing": "right", "kind": "stand", "set": "c" },
  "c-walk-right-2.png": { "facing": "right", "kind": "stand", "set": "c" },
  "c-sit.png": { "facing": "right", "kind": "sit", "set": "c" },
  "b-walk-away-1.png": { "facing": "back", "kind": "stand", "set": "b" }
}
```

List only files that are really in the folder. Sets `a` and `c` belong to the avatar and set `b` to the portrait; a file name starting `avatar-` or `person-`, or `"who": "avatar"` or `"who": "person"`, works too. When sets `a` and `c` offer the same pose, the avatar uses `c`.

The name says what a picture is for: `walk-right`, `walk-away`, `walk-front` (numbered ones play in turn as she walks), `sit`, `sit-talk`, `sit-mug`, `carry-wood`, `toast`, `hold-mug`, `wave`, `look-mountains`, `river-lean`, `crouch-fire` and `talk`.

Sideways pictures are mirrored for the other direction; add `"mirror": false` if the art should not be flipped. Two more settings are optional: `"height"` sets the picture's height as a share of her standing height, and `"hands"` says where the hands are, so carried things line up, for example `[[0.3, 0.6], [0.7, 0.6]]` as left and right positions measured across and down the picture. Anything not listed keeps the original artwork.

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
- `images/poses/`: optional pose pictures and their list, `poses.json`.

## Licence and credits

The code is MIT licensed (see `LICENSE`). Anyone may use, copy and change it, as long as the copyright notice and licence text stay with it.

If you use this site as a template, please credit the author in your site footer. This is a polite request, not a legal condition. Setting `credit: true` in `CONFIG` adds the line for you.

The MIT licence covers the code only. The images in the `images/` folder and all personal content (name, photos, cartoon avatar and written text) are not covered by it. They remain the owner's and must not be reused without permission.

# WarmUpCoffee

**WarmUpCoffee**: a simple web app that shows a coffee shop's products (name, description, price).

## Run it

Browsers block `fetch()` when a page is opened straight from a file, so start a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Structure

```
index.html                        # page shell
style.css                         # styles
js/app.js                         # rendering (sections → source groups → categories)
js/dataSource.js                  # where product data comes from (the only file to change for real services)
data/bakery.json                  # temporary local bakery data
data/drive_coffee_shop_menu.json  # copy of the Google Drive coffee menu
data/starbucks_menu.json          # copy of the StarbucksData menu
```

## Data sources

The page has two sections. Coffee is split into one group per source of origin.

| Section | Group (source of origin) | File | Items shown | Copied from |
|---------|--------------------------|------|-------------|-------------|
| Bakery  | Local sample | `data/bakery.json` | 12 | Temporary, until the real bakery service exists |
| Coffee  | Google Drive · Coffee Shop Menu | `data/drive_coffee_shop_menu.json` | 8 | `coffee_shop_menu.json` in Google Drive, copied 2026-11-23 |
| Coffee  | GitHub · Starbucks Spain | `data/starbucks_menu.json` | 90 drinks, by category | `data/menu.json` in [dyave/StarbucksData](https://github.com/dyave/StarbucksData) at commit `a04fd85` (menu collected 2026-11-12), copied 2026-11-23 |

The coffee files are **snapshots**: the website can't read the originals (the StarbucksData repo is private and the Drive file needs a Google sign-in). They don't update on their own. To refresh them, copy the source files again over the ones in `data/`.

Notes on the coffee data:

- **No prices.** Neither source publishes them, so drink cards show "Price not available".
- **Google Drive:** only items with `IsAvailable: true` are shown.
- **Starbucks Spain:** only the drinks (`bebidas`) section is shown, grouped by Starbucks' own categories (Espresso, Frappuccino®, Matcha, …). A drink listed in several categories appears once, under its first one. The Hot/Cold and Seasonal labels come from the source, which guessed them from product names.

Each source's format is converted in `js/dataSource.js` to the shape the page uses:

```json
{ "id": "bak-001", "name": "Butter Croissant", "description": "…", "price": 2.20, "category": null, "tags": [] }
```

`price` may be `null`. `category` (optional) splits a group into sub-headings, and `tags` show as small labels.

To plug in a real service, edit the `load` function of that group in `js/dataSource.js`.

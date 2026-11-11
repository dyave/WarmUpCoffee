# Warm-up Coffee

**ComfyCoffee**: a simple web app that shows a coffee shop's products (name, description, price).

## Run it

Browsers block `fetch()` when a page is opened straight from a file, so start a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Structure

```
index.html          # page shell
style.css           # styles
js/app.js           # rendering
js/dataSource.js    # where product data comes from (the only file to change for real services)
data/bakery.json    # temporary local bakery data
```

## Data sources

| Section | Source | Status |
|---------|--------|--------|
| Bakery  | `data/bakery.json` (local sample) | Temporary, until the real service exists |
| Coffee  | External service | Not available yet; shown as "Coming soon" |

Every product has this shape:

```json
{ "id": "bak-001", "name": "Butter Croissant", "description": "…", "price": 2.20 }
```

To plug in a real service, edit the `load` function of that source in `js/dataSource.js` (and set `available: true` for coffee).

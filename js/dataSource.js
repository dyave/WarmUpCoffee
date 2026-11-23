// The only place that knows where product data comes from.
// Each section has one or more groups, one per source of origin.
// A group's load() returns a Promise of products shaped like:
//   { id, name, description, price, category?, tags? }
// price may be null when the source doesn't publish one.
// category (optional) splits a group into sub-headings, in order of first appearance.

const sections = [
  {
    key: "bakery",
    label: "Bakery",
    groups: [
      {
        key: "bakery-local",
        label: null,
        // Temporary local data until the bakery service exists.
        load: () => fetchJson("data/bakery.json"),
      },
    ],
  },
  {
    key: "coffee",
    label: "Coffee",
    groups: [
      {
        key: "coffee-drive",
        label: "Google Drive · Coffee Shop Menu",
        note: "Copy of coffee_shop_menu.json from Google Drive.",
        load: loadDriveCoffee,
      },
      {
        key: "coffee-starbucks",
        label: "GitHub · Starbucks Spain",
        note: "Copy of data/menu.json from the StarbucksData repository (collected 2026-11-12).",
        load: loadStarbucksDrinks,
      },
    ],
  },
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
  return res.json();
}

// Drive file: [{ ID, Name, Description, IsAvailable }], no prices.
async function loadDriveCoffee() {
  const rows = await fetchJson("data/drive_coffee_shop_menu.json");
  return rows
    .filter((r) => r.IsAvailable)
    .map((r) => ({ id: r.ID, name: r.Name, description: r.Description, price: null }));
}

// StarbucksData menu: only the "bebidas" (drinks) section, grouped by its categories.
// Cross-listed drinks are shown once, under their first category.
async function loadStarbucksDrinks() {
  const menu = await fetchJson("data/starbucks_menu.json");
  const drinks = menu.sections.find((s) => s.id === "bebidas");
  const categoryName = new Map(drinks.categories.map((c) => [c.id, c.name]));
  const order = new Map(drinks.categories.map((c, i) => [c.id, i]));

  return menu.products
    .filter((p) => p.section === "bebidas")
    .sort((a, b) => order.get(a.categories[0]) - order.get(b.categories[0]))
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.subgroup || null,
      price: p.price_eur,
      category: categoryName.get(p.categories[0]),
      tags: [
        p.temperature === "hot" && "Hot",
        p.temperature === "cold" && "Cold",
        p.seasonal && "Seasonal",
      ].filter(Boolean),
    }));
}

export function getSections() {
  return sections;
}

// The only place that knows where product data comes from.
// Each source returns a Promise of an array of { id, name, description, price }.
// When a real service becomes available, change the matching source here.

const sources = {
  bakery: {
    label: "Bakery",
    available: true,
    // Temporary local data until the bakery service exists.
    load: () => fetchJson("data/bakery.json"),
  },
  coffee: {
    label: "Coffee",
    // Coffee products will come from another service that isn't available yet.
    available: false,
    load: async () => [],
  },
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status}) for ${url}`);
  return res.json();
}

export function getSources() {
  return Object.entries(sources).map(([key, s]) => ({ key, ...s }));
}

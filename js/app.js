import { getSources } from "./dataSource.js";

const price = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const menu = document.getElementById("menu");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function productCard(p) {
  const card = el("article", "card");
  const head = el("div", "card-head");
  head.append(el("h3", "card-name", p.name), el("span", "card-price", price.format(p.price)));
  card.append(head, el("p", "card-desc", p.description));
  return card;
}

async function renderSection(source) {
  const section = el("section", "section");
  section.append(el("h2", "section-title", source.label));
  const body = el("div", "grid");
  section.append(body);
  menu.append(section);

  if (!source.available) {
    body.replaceWith(el("p", "status", "Coming soon."));
    return;
  }

  body.append(el("p", "status", "Loading…"));
  try {
    const items = await source.load();
    body.replaceChildren();
    if (!items.length) {
      body.append(el("p", "status", "No products right now."));
      return;
    }
    items.forEach((p) => body.append(productCard(p)));
  } catch (err) {
    console.error(err);
    body.replaceChildren(el("p", "status error", "Couldn't load products. Please try again later."));
  }
}

getSources().forEach(renderSection);

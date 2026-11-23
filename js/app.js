import { getSections } from "./dataSource.js";

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
  const priceText = p.price == null ? "Price not available" : price.format(p.price);
  const priceClass = p.price == null ? "card-price missing" : "card-price";
  head.append(el("h3", "card-name", p.name), el("span", priceClass, priceText));
  card.append(head);
  if (p.description) card.append(el("p", "card-desc", p.description));
  if (p.tags?.length) {
    const tags = el("div", "tags");
    p.tags.forEach((t) => tags.append(el("span", "tag", t)));
    card.append(tags);
  }
  return card;
}

function grid(items) {
  const g = el("div", "grid");
  items.forEach((p) => g.append(productCard(p)));
  return g;
}

// Split items into sub-headings by category, keeping the order they arrive in.
function byCategory(items) {
  const groups = new Map();
  items.forEach((p) => {
    if (!groups.has(p.category)) groups.set(p.category, []);
    groups.get(p.category).push(p);
  });
  return groups;
}

async function renderGroup(group, container) {
  const wrap = el("div", "group");
  if (group.label) {
    const head = el("div", "group-head");
    head.append(el("h3", "group-title", group.label));
    const count = el("span", "group-count");
    head.append(count);
    wrap.append(head);
    if (group.note) wrap.append(el("p", "group-note", group.note));
    group.countNode = count;
  }
  const body = el("div", "group-body");
  body.append(el("p", "status", "Loading…"));
  wrap.append(body);
  container.append(wrap);

  try {
    const items = await group.load();
    body.replaceChildren();
    if (group.countNode) group.countNode.textContent = `${items.length} items`;
    if (!items.length) {
      body.append(el("p", "status", "No products right now."));
      return;
    }
    if (items.some((p) => p.category)) {
      byCategory(items).forEach((list, name) => {
        body.append(el("h4", "category-title", `${name} (${list.length})`), grid(list));
      });
    } else {
      body.append(grid(items));
    }
  } catch (err) {
    console.error(err);
    body.replaceChildren(el("p", "status error", "Couldn't load products. Please try again later."));
  }
}

function renderSection(section) {
  const node = el("section", "section");
  node.append(el("h2", "section-title", section.label));
  menu.append(node);
  section.groups.forEach((g) => renderGroup(g, node));
}

getSections().forEach(renderSection);

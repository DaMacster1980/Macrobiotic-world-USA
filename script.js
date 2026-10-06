const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const cartCount = document.querySelector(".cart-count");
const cartButton = document.querySelector(".cart-button");
const cartDrawer = document.querySelector(".cart-drawer");
const drawerBackdrop = document.querySelector(".drawer-backdrop");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const toast = document.querySelector(".toast");
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#product-search");
const searchFeedback = document.querySelector(".search-feedback");
const productGrid = document.querySelector("#product-grid");
const productEmpty = document.querySelector(".product-empty");
const homeSearchResults = document.querySelector("#search-results");
const homeFeaturedGrid = document.querySelector("#home-featured-products");
const catalogStorageKey = "mwusa-catalog-edits-v1";
function loadCatalogRecords() {
  const imported = (window.MWUSA_CATALOG || []).map((product) => ({ ...product }));
  try {
    const saved = JSON.parse(localStorage.getItem(catalogStorageKey) || "null");
    if (!saved) return imported;
    const edits = saved.edits && typeof saved.edits === "object" ? saved.edits : {};
    const editedProducts = imported.map((product) => ({ ...product, ...(edits[product.id] || {}) }));
    const additions = Array.isArray(saved.additions) ? saved.additions.filter((product) => product && product.id && product.handle && product.name).map((product) => ({ ...product, ...(edits[product.id] || {}) })) : [];
    return [...editedProducts, ...additions];
  } catch {
    return imported;
  }
}
let catalog = loadCatalogRecords();
let categoryLabels = [...new Set(catalog.map((product) => product.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
const pageType = document.body.dataset.pageType || "";
const initialFeaturedProductIds = [
  catalog.find((product) => product.handle === "organic-bio-moringa-powder")?.id,
  catalog.find((product) => product.handle === "organic-bio-oregano-herb-tea")?.id,
  catalog.find((product) => product.handle === "organic-bio-pumpkin-protein")?.id,
  catalog.find((product) => /lion.?s mane/i.test(product.name) && /powder/i.test(product.name))?.id
].filter(Boolean);
const productSettingsKey = "mwusa-product-settings-v1";

function loadProductSettings() {
  const defaults = { liveIds: [...initialFeaturedProductIds], featuredIds: [...initialFeaturedProductIds] };
  try {
    const saved = JSON.parse(localStorage.getItem(productSettingsKey) || "null");
    if (!saved || !Array.isArray(saved.liveIds) || !Array.isArray(saved.featuredIds)) return defaults;
    const knownIds = new Set(catalog.map((product) => product.id));
    return {
      liveIds: [...new Set(saved.liveIds.filter((id) => knownIds.has(id)))],
      featuredIds: [...new Set(saved.featuredIds.filter((id) => knownIds.has(id)))].filter((id) => saved.liveIds.includes(id))
    };
  } catch {
    return defaults;
  }
}

let productSettings = loadProductSettings();

function saveProductSettings() {
  try {
    localStorage.setItem(productSettingsKey, JSON.stringify(productSettings));
    return true;
  } catch {
    return false;
  }
}

function readCatalogEdits() {
  try {
    return JSON.parse(localStorage.getItem(catalogStorageKey) || "null") || { edits: {}, additions: [] };
  } catch {
    return { edits: {}, additions: [] };
  }
}

function saveCatalogEdit(product, isNew = false) {
  const saved = readCatalogEdits();
  const record = {
    name: product.name,
    handle: product.handle,
    category: product.category,
    description: product.description,
    image: product.image,
    images: product.images,
    priceTHB: product.priceTHB,
    priceUSD: product.priceUSD,
    potentialBenefits: product.potentialBenefits,
    benefitDisclaimer: product.benefitDisclaimer,
    descriptionReview: "needs-review"
  };
  if (isNew) saved.additions = [...(saved.additions || []), product];
  else saved.edits = { ...(saved.edits || {}), [product.id]: record };
  try {
    localStorage.setItem(catalogStorageKey, JSON.stringify(saved));
    return true;
  } catch {
    return false;
  }
}

function initializeProductManager() {
  const list = document.querySelector("#manager-products");
  const search = document.querySelector("#manager-search");
  const category = document.querySelector("#manager-category");
  const status = document.querySelector("#manager-save-status");
  const counts = document.querySelector("#manager-counts");
  const dataQuality = document.querySelector("#manager-data-quality");
  const pagination = document.querySelector("#manager-pagination");
  const markupInput = document.querySelector("#manager-markup");
  const exchangeInput = document.querySelector("#manager-exchange");
  const priceEstimate = document.querySelector("#manager-price-estimate");
  const addProductButton = document.querySelector("#manager-add-product");
  const editor = document.querySelector("#manager-product-editor");
  const editorForm = document.querySelector("#manager-product-form");
  const editorCategoryList = document.querySelector("#manager-category-options");
  let managerPage = 1;
  const perPage = 40;

  refreshCategoryChoices();

  function refreshCounts() {
    counts.textContent = `${catalog.length.toLocaleString()} imported · ${productSettings.liveIds.length} live in this preview · ${productSettings.featuredIds.length} selected for homepage`;
    const missingPhotos = catalog.filter((product) => !product.image).length;
    const missingDescriptions = catalog.filter((product) => !product.description).length;
    dataQuality.textContent = `${missingPhotos} products need a photo · ${missingDescriptions} need a description · Review MWC source copy before enabling products.`;
  }

  function refreshCategoryChoices() {
    category.replaceChildren(new Option("All categories", "all"), ...categoryLabels.map((label) => new Option(label, label)));
    editorCategoryList.replaceChildren(...categoryLabels.map((label) => {
      const option = document.createElement("option");
      option.value = label;
      return option;
    }));
  }

  function openEditor(product = null) {
    editorForm.reset();
    editorForm.elements.productId.value = product?.id || "";
    editorForm.elements.productName.value = product?.name || "";
    editorForm.elements.productCategory.value = product?.category || "";
    editorForm.elements.productDescription.value = product?.description || "";
    editorForm.elements.productImage.value = product?.image || "";
    editorForm.elements.productPriceTHB.value = product?.priceTHB ?? "";
    editorForm.elements.productPriceUSD.value = product?.priceUSD ?? "";
    editorForm.elements.productBenefits.value = product?.potentialBenefits || "";
    editorForm.elements.productDisclaimer.value = product?.benefitDisclaimer || "";
    document.querySelector("#manager-editor-title").textContent = product ? "Edit product details" : "Add a product";
    editor.showModal();
  }
  editor.querySelectorAll("[data-editor-cancel]").forEach((button) => button.addEventListener("click", () => editor.close()));

  function refreshPriceEstimate() {
    const markup = Number(markupInput.value);
    const rate = Number(exchangeInput.value);
    const example = catalog.find((product) => Number.isFinite(product.priceTHB));
    if (!markupInput.value || !exchangeInput.value || !example || markup < 50 || markup > 70 || rate <= 0) {
      priceEstimate.textContent = "No USA prices are set. Confirm markup, exchange rate, and rounding before setting prices.";
      return;
    }
    const estimate = (example.priceTHB * (1 + markup / 100)) / rate;
    priceEstimate.textContent = `Example only: ฿${example.priceTHB.toFixed(2)} for ${example.name} at ${markup}% markup and ${rate} THB per USD is about ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(estimate)} before the final rounding rule.`;
  }

  function makeToggle(labelText, setting, productId, checked) {
    const label = document.createElement("label");
    label.className = "manager-toggle";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.dataset[setting === "live" ? "liveProduct" : "featuredProduct"] = productId;
    const text = document.createElement("span");
    text.textContent = labelText;
    label.append(input, text);
    return label;
  }

  function renderManagerList() {
    const query = search.value.trim().toLocaleLowerCase();
    const categoryValue = category.value;
    const matches = catalog.filter((product) => {
      const categoryMatches = categoryValue === "all" || product.category === categoryValue;
      return categoryMatches && `${product.name} ${product.category}`.toLocaleLowerCase().includes(query);
    });
    const pageCount = Math.max(1, Math.ceil(matches.length / perPage));
    managerPage = Math.min(managerPage, pageCount);
    const shown = matches.slice((managerPage - 1) * perPage, managerPage * perPage);
    list.replaceChildren(...shown.map((product) => {
      const card = document.createElement("article");
      card.className = "manager-product";
      card.dataset.productId = product.id;
      const image = product.image ? document.createElement("img") : document.createElement("div");
      if (product.image) {
        image.src = product.image;
        image.alt = `${product.name} product photo`;
        image.loading = "lazy";
      } else {
        image.className = "manager-no-image";
        image.textContent = "Photo needed";
      }
      const details = document.createElement("div");
      details.className = "manager-product-details";
      const name = document.createElement("h2");
      name.textContent = product.name;
      const group = document.createElement("p");
      group.textContent = `${product.category} · ${product.productType || "MWC catalog"} · ${product.priceTHB == null ? "THB price not listed" : `฿${product.priceTHB.toFixed(2)}`}${product.missingImage ? " · photo missing" : ""}${!product.description ? " · description needed" : ""} · source copy needs review`;
      details.append(name, group);
      const actions = document.createElement("div");
      actions.className = "manager-product-actions";
      actions.append(
        makeToggle("Live on website", "live", product.id, productSettings.liveIds.includes(product.id)),
        makeToggle("Show on homepage", "featured", product.id, productSettings.featuredIds.includes(product.id))
      );
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "manager-edit-button";
      edit.dataset.editProduct = product.id;
      edit.textContent = "Edit";
      actions.append(edit);
      card.append(image, details, actions);
      return card;
    }));
    status.textContent = `Showing ${(managerPage - 1) * perPage + (matches.length ? 1 : 0)}–${Math.min(managerPage * perPage, matches.length)} of ${matches.length} matching products`;
    pagination.replaceChildren();
    if (pageCount > 1) {
      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "catalog-page-button";
      previous.textContent = "Previous";
      previous.disabled = managerPage === 1;
      previous.addEventListener("click", () => { managerPage -= 1; renderManagerList(); });
      const next = document.createElement("button");
      next.type = "button";
      next.className = "catalog-page-button";
      next.textContent = "Next";
      next.disabled = managerPage === pageCount;
      next.addEventListener("click", () => { managerPage += 1; renderManagerList(); });
      const pageLabel = document.createElement("span");
      pageLabel.textContent = `Page ${managerPage} of ${pageCount}`;
      pagination.append(previous, pageLabel, next);
    }
  }

  list.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-live-product], input[data-featured-product]");
    if (!input) return;
    const liveIds = new Set(productSettings.liveIds);
    const featuredIds = new Set(productSettings.featuredIds);
    const id = input.dataset.liveProduct || input.dataset.featuredProduct;
    if (input.dataset.liveProduct) {
      if (input.checked) liveIds.add(id);
      else {
        liveIds.delete(id);
        featuredIds.delete(id);
      }
    } else if (input.checked) {
      liveIds.add(id);
      featuredIds.add(id);
    } else {
      featuredIds.delete(id);
    }
    productSettings = { liveIds: [...liveIds], featuredIds: [...featuredIds] };
    const row = input.closest(".manager-product");
    if (!liveIds.has(id)) row.querySelector("[data-featured-product]").checked = false;
    status.textContent = saveProductSettings() ? "Saved on this device" : "Could not save in this browser";
    refreshCounts();
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-product]");
    if (!button) return;
    openEditor(catalog.find((product) => product.id === button.dataset.editProduct));
  });
  addProductButton.addEventListener("click", () => openEditor());
  editorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = editorForm.elements;
    const id = form.productId.value;
    const name = form.productName.value.trim();
    const categoryName = form.productCategory.value.trim();
    const description = form.productDescription.value.trim();
    const image = form.productImage.value.trim();
    const priceTHB = form.productPriceTHB.value === "" ? null : Number(form.productPriceTHB.value);
    const priceUSD = form.productPriceUSD.value === "" ? null : Number(form.productPriceUSD.value);
    let product;
    const isNew = !id;
    if (isNew) {
      const handleBase = name.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `new-product-${Date.now()}`;
      let handle = handleBase;
      let suffix = 2;
      while (catalog.some((entry) => entry.handle === handle)) handle = `${handleBase}-${suffix++}`;
      product = {
        id: `mwu-${Date.now()}`, handle, name, vendor: "Macrobiotic World USA", category: categoryName,
        productType: categoryName, description, sourceDescription: description, descriptionReview: "needs-review",
        image, images: image ? [image] : [], priceTHB, priceUSD, variants: [], tags: [], sourceUrl: "",
        live: false, featured: false, potentialBenefits: form.productBenefits.value.trim(),
        benefitDisclaimer: form.productDisclaimer.value.trim(), missingImage: !image
      };
      catalog.push(product);
    } else {
      product = catalog.find((entry) => entry.id === id);
      Object.assign(product, {
        name, category: categoryName, description, image, images: image ? [image] : [], priceTHB, priceUSD,
        potentialBenefits: form.productBenefits.value.trim(), benefitDisclaimer: form.productDisclaimer.value.trim(),
        missingImage: !image, descriptionReview: "needs-review"
      });
    }
    const savedSuccessfully = saveCatalogEdit(product, isNew);
    categoryLabels = [...new Set(catalog.map((entry) => entry.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
    refreshCategoryChoices();
    managerPage = isNew ? Math.ceil(catalog.length / perPage) : managerPage;
    renderManagerList();
    refreshCounts();
    status.textContent = savedSuccessfully ? "Saved in this browser preview" : "Could not save in this browser";
    editor.close();
  });
  search.addEventListener("input", () => { managerPage = 1; renderManagerList(); });
  category.addEventListener("change", () => { managerPage = 1; renderManagerList(); });
  markupInput.addEventListener("input", refreshPriceEstimate);
  exchangeInput.addEventListener("input", refreshPriceEstimate);
  refreshPriceEstimate();
  refreshCounts();
  renderManagerList();
}

if (document.body.dataset.pageType === "product-manager") {
  initializeProductManager();
} else {
const cart = new Map();
let toastTimer;
let lastFocusedElement;
let activeCategory = document.body.dataset.category || new URLSearchParams(window.location.search).get("category") || "all";
let catalogPage = 1;
const isHomePage = pageType === "home";

function restoreCart() {
  try {
    const savedItems = JSON.parse(localStorage.getItem("mwusa-cart") || "[]");
    if (!Array.isArray(savedItems)) return;
    for (const [id, quantity] of savedItems) {
      const product = catalog.find((entry) => entry.id === id);
      if (product && Number.isInteger(quantity) && quantity > 0) cart.set(id, { product, quantity });
    }
  } catch {
    localStorage.removeItem("mwusa-cart");
  }
}

restoreCart();

function createImagePlaceholder(product) {
  const placeholder = document.createElement("div");
  placeholder.className = "image-placeholder";
  placeholder.setAttribute("aria-label", `Product image unavailable for ${product.name}`);
  const initials = document.createElement("span");
  initials.className = "placeholder-initials";
  initials.setAttribute("aria-hidden", "true");
  initials.textContent = product.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("");
  placeholder.append(initials);
  return placeholder;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = product.id;
  card.dataset.category = product.category;

  const imageWrap = document.createElement("div");
  imageWrap.className = "product-image-wrap";
  if (product.image) {
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = `${product.name} product packaging`;
    image.loading = "lazy";
    image.addEventListener("error", () => imageWrap.replaceChildren(createImagePlaceholder(product)), { once: true });
    imageWrap.append(image);
  } else {
    imageWrap.append(createImagePlaceholder(product));
  }

  const meta = document.createElement("div");
  meta.className = "product-meta";
  const category = document.createElement("span");
  category.textContent = product.category;
  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = Number.isFinite(product.priceUSD) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.priceUSD) : "Price coming soon";
  meta.append(category, price);

  const title = document.createElement("h3");
  const productLink = document.createElement("a");
  productLink.href = `product.html?handle=${encodeURIComponent(product.handle)}`;
  productLink.textContent = product.name;
  title.append(productLink);
  const description = document.createElement("p");
  description.className = "product-note";
  description.textContent = product.description;

  const detailArea = document.createElement("details");
  detailArea.className = "product-details";
  const detailSummary = document.createElement("summary");
  detailSummary.textContent = "Product details";
  const detailCopy = document.createElement("p");
  detailCopy.textContent = product.details;
  detailArea.append(detailSummary, detailCopy);
  if (product.ingredients?.length) {
    const ingredientList = document.createElement("ul");
    for (const ingredient of product.ingredients) {
      const item = document.createElement("li");
      item.textContent = ingredient;
      ingredientList.append(item);
    }
    detailArea.append(ingredientList);
  }
  const detailsLink = document.createElement("a");
  detailsLink.className = "details-link";
  detailsLink.href = `product.html?handle=${encodeURIComponent(product.handle)}`;
  detailsLink.textContent = "View product details →";
  detailArea.append(detailsLink);

  const addButton = document.createElement("button");
  addButton.className = "add-button";
  addButton.type = "button";
  addButton.dataset.addToCart = "";
  addButton.dataset.productId = product.id;
  addButton.append(document.createTextNode(Number.isFinite(product.priceUSD) ? "Add to bag" : "Coming soon"));
  addButton.disabled = !Number.isFinite(product.priceUSD);
  const plus = document.createElement("span");
  plus.setAttribute("aria-hidden", "true");
  plus.textContent = "+";
  if (!addButton.disabled) addButton.append(plus);

  card.append(imageWrap, meta, title, description, detailArea, addButton);
  return card;
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  if (isHomePage && !query) {
    productGrid.replaceChildren();
    productEmpty.hidden = true;
    homeSearchResults.hidden = true;
    searchFeedback.textContent = "Search the collection.";
    return;
  }
  if (homeSearchResults && (isHomePage || pageType === "catalog")) homeSearchResults.hidden = false;
  if (!productGrid || !productEmpty) return;
  const visibleProducts = catalog.filter((product) => {
    const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      const searchableText = [product.name, product.category, product.productType, product.description, product.details, ...(product.ingredients || [])].join(" ").toLocaleLowerCase();
    return productSettings.liveIds.includes(product.id) && categoryMatch && searchableText.includes(query);
  });
  const sortMode = document.querySelector("#collection-sort")?.value || "featured";
  if (sortMode === "name-asc") visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortMode === "name-desc") visibleProducts.sort((a, b) => b.name.localeCompare(a.name));
  const pageSize = ["catalog", "category"].includes(pageType) ? 24 : visibleProducts.length;
  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  catalogPage = Math.min(catalogPage, pageCount);
  const pageProducts = visibleProducts.slice((catalogPage - 1) * pageSize, catalogPage * pageSize);
  productGrid.replaceChildren(...pageProducts.map(createProductCard));
  productEmpty.hidden = visibleProducts.length > 0;
  searchFeedback.textContent = query ? `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"} found.` : `${visibleProducts.length} live products shown.`;
  const countLabel = document.querySelector("#collection-count");
  if (countLabel) countLabel.textContent = `${visibleProducts.length} live ${visibleProducts.length === 1 ? "product" : "products"}`;
  renderCatalogPagination(pageCount);
}

function renderCatalogPagination(pageCount) {
  const pagination = document.querySelector("#catalog-pagination");
  if (!pagination) return;
  pagination.replaceChildren();
  if (pageCount < 2) return;
  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "catalog-page-button";
    button.textContent = String(page);
    button.setAttribute("aria-current", String(page === catalogPage));
    button.addEventListener("click", () => { catalogPage = page; renderProducts(); });
    pagination.append(button);
  }
}

function initializeCollectionPage() {
  if (!(["catalog", "category"].includes(pageType))) return;
  const title = document.querySelector("#collection-title");
  const description = document.querySelector("#collection-description");
  const filterList = document.querySelector("#category-filter-list");
  const queryParams = new URLSearchParams(window.location.search);
  const query = queryParams.get("q");
  if (query) searchInput.value = query;
  if (activeCategory !== "all" && !categoryLabels.includes(activeCategory)) activeCategory = "all";
  if (title) title.textContent = activeCategory === "all" ? "Explore our collection" : activeCategory;
  if (description) description.textContent = activeCategory === "all" ? "Thoughtfully selected natural foods and everyday essentials." : `Explore ${activeCategory.toLocaleLowerCase()} from the Macrobiotic World USA collection.`;
  if (filterList) {
    const links = [["All products", "all"], ...categoryLabels.map((label) => [label, label])].map(([label, category]) => {
      const link = document.createElement("a");
      link.className = `filter-button${activeCategory === category ? " is-active" : ""}`;
      link.href = category === "all" ? "collection.html" : `collection.html?category=${encodeURIComponent(category)}`;
      link.textContent = label;
      if (activeCategory === category) link.setAttribute("aria-current", "page");
      return link;
    });
    filterList.replaceChildren(...links);
  }
  document.querySelector("#collection-sort")?.addEventListener("change", () => { catalogPage = 1; renderProducts(); });
  searchInput.addEventListener("input", () => { catalogPage = 1; renderProducts(); });
}

function initializeProductDetail() {
  if (pageType !== "product-detail") return;
  const product = catalog.find((entry) => entry.handle === new URLSearchParams(window.location.search).get("handle"));
  const status = document.querySelector("#detail-status");
  const content = document.querySelector("#product-detail-content");
  if (!product) {
    content.hidden = true;
    status.hidden = false;
    status.textContent = "We could not find that product.";
    return;
  }
  if (!productSettings.liveIds.includes(product.id)) {
    content.hidden = true;
    status.hidden = false;
    status.textContent = "This product is saved in the MWU catalog but is not currently live for customers.";
    return;
  }
  document.title = `${product.name} | Macrobiotic World USA`;
  document.querySelector("#detail-breadcrumb").textContent = product.name;
  document.querySelector("#detail-category").textContent = product.category;
  document.querySelector("#detail-title").textContent = product.name;
  document.querySelector("#detail-description").textContent = product.description || "Product description will be added after review.";
  document.querySelector("#detail-price").textContent = Number.isFinite(product.priceUSD) ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.priceUSD) : "USA price to be set";
  const extra = document.querySelector("#detail-extra");
  const typeLine = document.createElement("p");
  typeLine.textContent = product.productType ? `Product type: ${product.productType}` : "";
  const variantWrap = document.querySelector("#detail-variant-wrap");
  const variantSelect = document.querySelector("#detail-variant");
  const variants = (product.variants || []).filter((variant) => variant.name && variant.name !== "Default Title");
  if (variants.length > 1) {
    variantWrap.hidden = false;
    variantSelect.replaceChildren(...variants.map((variant) => new Option(variant.name, variant.id)));
  } else {
    variantWrap.hidden = true;
  }
  const sourceLink = document.createElement("a");
  sourceLink.href = product.sourceUrl;
  sourceLink.target = "_blank";
  sourceLink.rel = "noopener noreferrer";
  sourceLink.textContent = "View source listing ↗";
  extra.replaceChildren(typeLine, sourceLink);
  const gallery = document.querySelector("#detail-main-image-wrap");
  const thumbnails = document.querySelector("#detail-thumbnails");
  const images = product.images || [];
  const setImage = (url, alt) => {
    const image = document.createElement("img");
    image.src = url;
    image.alt = alt;
    image.loading = "lazy";
    gallery.replaceChildren(image);
  };
  if (images.length) {
    setImage(images[0], `${product.name} product photo`);
    thumbnails.replaceChildren(...images.map((url, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `View product photo ${index + 1}`);
      const image = document.createElement("img");
      image.src = url;
      image.alt = "";
      image.loading = "lazy";
      button.append(image);
      button.addEventListener("click", () => setImage(url, `${product.name} product photo ${index + 1}`));
      return button;
    }));
  } else {
    gallery.textContent = "Product photo coming soon";
    thumbnails.replaceChildren();
  }
  const add = document.querySelector("#detail-add");
  add.disabled = !Number.isFinite(product.priceUSD);
  add.textContent = Number.isFinite(product.priceUSD) ? "Add to bag" : "Price coming soon";
  add.dataset.productId = product.id;
  add.addEventListener("click", () => addProduct(product.id));
}

function initializeAdditionalCategoryCards() {
  const container = document.querySelector("#more-categories");
  if (!container) return;
  const featured = new Set(["Herbs & Botanicals", "Mushrooms & Seaweed", "Natural Foods", "Plant Proteins", "Superfoods", "Teas & Herbal Blends"]);
  const additional = categoryLabels.filter((category) => !featured.has(category));
  const cardDetails = {
    "Aromatherapy & Incense": { image: "aromatherapy-incense", description: "Natural aromas, incense and thoughtful home rituals.", action: "Explore Aromatherapy", icon: "<path d='M24 39V24m-8 15h16M17 24c-4-4-3-9 1-12 1-4 3-6 6-8 3 2 5 4 6 8 4 3 5 8 1 12M12 18h5m14 0h5M14 11l-4-3m24 3 4-3'/>" },
    "Body Care": { image: "body-care", description: "Plant-based care for simple everyday routines.", action: "Explore Body Care", icon: "<path d='M24 5s-12 14-12 22a12 12 0 0 0 24 0C36 19 24 5 24 5Z'/><path d='M18 29c2-5 6-8 12-9-1 6-4 10-10 12'/>" },
    "Cereals & Breakfast": { image: "cereals-breakfast", description: "Wholegrain starts and nourishing breakfast staples.", action: "Explore Breakfast", icon: "<path d='M24 41V9m0 9c-7 0-11-4-12-10 7 0 11 3 12 10Zm0 8c7 0 11-4 12-10-7 0-11 3-12 10Zm0 8c-6 0-10-3-11-8 6 0 9 2 11 8Z'/>" },
    "Coffee, Tea & Beverages": { image: "coffee-tea-beverages", description: "Everyday drinks, herbal infusions and pantry blends.", action: "Explore Beverages", icon: "<path d='M10 18h23v12a9 9 0 0 1-9 9h-5a9 9 0 0 1-9-9V18Zm23 3h4a5 5 0 0 1 0 10h-5M17 12c-2-2 2-3 0-6m8 6c-2-2 2-3 0-6'/>" },
    "Condiments & Pantry": { image: "condiments-pantry", description: "Seasonings and pantry companions for everyday meals.", action: "Explore Condiments", icon: "<path d='M18 9V5h12v4m-10 0h8l3 5v21H17V14l3-5Zm-1 11h14M22 26h6'/>" },
    "Dried Fruits & Nuts": { image: "dried-fruits-nuts", description: "Naturally sweet fruit, nuts and wholesome staples.", action: "Explore Fruit & Nuts", icon: "<path d='M24 12c-8-8-17-1-14 8 2 7 7 13 14 18 7-5 12-11 14-18 3-9-6-16-14-8Z'/><path d='M24 12c0-5 3-8 8-9-1 5-3 8-8 9'/>" },
    "Flours & Baking": { image: "flours-baking", description: "Wholegrain flours and natural baking essentials.", action: "Explore Baking", icon: "<path d='M8 23h32l-4 16H12L8 23Zm4 0 8-14h12l8 14M24 9V5m-8 34h16'/>" },
    "Grains, Legumes & Seeds": { image: "grains-legumes-seeds", description: "Everyday grains, pulses and nourishing seeds.", action: "Explore Grains & Seeds", icon: "<path d='M24 41V8m0 13c-8 0-12-4-13-11 7 0 11 3 13 11Zm0 8c8 0 12-4 13-11-7 0-11 3-13 11Zm0-13c5-7 10-8 16-6-3 6-8 8-16 6Z'/>" },
    "Home & Lifestyle": { image: "home-lifestyle", description: "Thoughtful everyday goods for a more natural home.", action: "Explore Home", icon: "<path d='m6 22 18-15 18 15M11 19v20h26V19M20 39V27h8v12'/><path d='M34 11V6h5v9'/>" },
    "Oils & Vinegars": { image: "oils-vinegars", description: "Carefully selected oils and vinegars for the table.", action: "Explore Oils & Vinegars", icon: "<path d='M24 5s-13 15-13 24a13 13 0 0 0 26 0C37 20 24 5 24 5Z'/><path d='M19 30c2 4 5 5 9 5'/>" },
    "Pasta & Noodles": { image: "pasta-noodles", description: "Pantry staples for simple, satisfying meals.", action: "Explore Pasta", icon: "<path d='M8 25h32c-1 9-7 14-16 14S9 34 8 25Zm4-5 12 5m-4-9 9 9m3-12-4 12'/>" },
    "Snacks & Bars": { image: "snacks-bars", description: "Convenient bites made with familiar ingredients.", action: "Explore Snacks", icon: "<path d='M9 24h30a15 15 0 0 1-30 0Zm5-5c1-7 6-12 10-12s9 5 10 12m-20 21h20'/>" },
    "Spreads & Butters": { image: "spreads-butters", description: "Nut and seed spreads for toast, bowls and more.", action: "Explore Spreads", icon: "<path d='M12 14h24l-2 26H14l-2-26Zm4 0V9h16v5m-11 9c4-4 8-4 12-2'/>" },
    "Supplements & Wellness": { image: "supplements-wellness", description: "Browse vitamins, minerals and wellness essentials.", action: "Explore Supplements", icon: "<path d='M14 34a8 8 0 0 1 0-11l11-11a8 8 0 0 1 11 11L25 34a8 8 0 0 1-11 0Z'/><path d='m20 17 11 11'/>" },
    "Vegan Cheese": { image: "vegan-cheese", description: "Plant-based choices for sharing and everyday meals.", action: "Explore Vegan Cheese", icon: "<path d='M8 35 13 9l27 18-1 8H8Zm5-26 3 16m9-11-2 9m8-5-1 7'/>" }
  };
  container.replaceChildren(...additional.map((category) => {
    const details = cardDetails[category];
    const link = document.createElement("a");
    link.className = "catalog-category-tile";
    link.href = `collection.html?category=${encodeURIComponent(category)}`;
    const image = document.createElement("img");
    image.src = `assets/reference/shop-by-product/extra-categories/${details?.image || "grains-legumes-seeds"}.jpg`;
    image.alt = `${category} natural ingredients`;
    image.loading = "lazy";
    image.className = "catalog-category-photo";
    const copy = document.createElement("span");
    copy.className = "catalog-category-copy";
    const icon = document.createElement("span");
    icon.className = "catalog-category-icon";
    icon.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 48 48");
    svg.innerHTML = details?.icon || "<path d='M8 24h32M24 8v32'/>";
    icon.append(svg);
    const title = document.createElement("span");
    title.className = "catalog-category-title";
    title.textContent = category;
    const description = document.createElement("span");
    description.className = "catalog-category-description";
    description.textContent = details?.description || `Browse the ${category.toLocaleLowerCase()} collection.`;
    const action = document.createElement("span");
    action.className = "catalog-category-action";
    action.append(document.createTextNode(details?.action || "Explore products"));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    action.append(arrow);
    copy.append(icon, title, description, action);
    link.append(image, copy);
    return link;
  }));
}

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".product-filters [data-category-filter]").forEach((button) => {
    const isActive = button.dataset.categoryFilter === category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

initializeCollectionPage();
initializeProductDetail();
initializeAdditionalCategoryCards();
renderProducts();

if (homeFeaturedGrid) {
  const featuredProducts = productSettings.featuredIds
    .filter((id) => productSettings.liveIds.includes(id))
    .map((id) => catalog.find((product) => product.id === id)).filter(Boolean);
  homeFeaturedGrid.replaceChildren(...featuredProducts.map(createProductCard));
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function closeNavigation() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

function openCart() {
  lastFocusedElement = document.activeElement;
  drawerBackdrop.hidden = false;
  requestAnimationFrame(() => drawerBackdrop.classList.add("is-open"));
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.inert = false;
  document.body.classList.add("drawer-open");
  cartDrawer.querySelector(".drawer-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.inert = true;
  document.body.classList.remove("drawer-open");
  window.setTimeout(() => { drawerBackdrop.hidden = true; }, 280);
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function getCartCount() {
  return [...cart.values()].reduce((total, item) => total + item.quantity, 0);
}

function getSubtotal() {
  const items = [...cart.values()];
  if (items.some((item) => !Number.isFinite(item.product.priceUSD))) return null;
  return items.reduce((total, item) => total + item.product.priceUSD * item.quantity, 0);
}

function renderCart() {
  const count = getCartCount();
  const subtotal = getSubtotal();
  cartCount.textContent = String(count);
  cartButton.setAttribute("aria-label", `Shopping bag, ${count} ${count === 1 ? "item" : "items"}`);
  document.querySelector(".drawer-count").textContent = `(${count})`;
  document.querySelector(".cart-subtotal").textContent = subtotal === null ? "Pending pricing" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(subtotal);
  cartEmpty.classList.toggle("is-visible", count === 0);
  cartItems.replaceChildren();

  for (const [id, item] of cart) {
    const line = document.createElement("article");
    line.className = "cart-line";
    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = item.product.name;
    const price = document.createElement("span");
    price.className = "cart-line-price";
    price.textContent = Number.isFinite(item.product.priceUSD) ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.product.priceUSD)} each` : "Price coming soon";
    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "cart-line-controls";
    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";
    quantityControl.setAttribute("aria-label", `Quantity for ${item.product.name}`);
    for (const [action, label, text] of [["decrease", "Decrease quantity", "−"], ["increase", "Increase quantity", "+"]]) {
      if (action === "increase") {
        const quantity = document.createElement("span");
        quantity.textContent = String(item.quantity);
        quantityControl.append(quantity);
      }
      const control = document.createElement("button");
      control.type = "button";
      control.dataset.cartAction = action;
      control.dataset.productId = id;
      control.setAttribute("aria-label", label);
      control.textContent = text;
      quantityControl.append(control);
    }
    const remove = document.createElement("button");
    remove.className = "remove-item";
    remove.type = "button";
    remove.dataset.cartAction = "remove";
    remove.dataset.productId = id;
    remove.textContent = "Remove";
    controls.append(quantityControl, remove);
    line.append(details, controls);
    cartItems.append(line);
  }

  try {
    localStorage.setItem("mwusa-cart", JSON.stringify([...cart].map(([id, item]) => [id, item.quantity])));
  } catch {
    announce("Your bag could not be saved on this device.");
  }
}

function addProduct(id) {
  const product = catalog.find((entry) => entry.id === id);
  if (!product || !Number.isFinite(product.priceUSD)) return;
  const existing = cart.get(id);
  cart.set(id, { product, quantity: (existing?.quantity ?? 0) + 1 });
  renderCart();
  announce(`${product.name} added to your bag.`);
}

function handleProductGridClick(event) {
  const button = event.target.closest("[data-add-to-cart]");
  if (button) addProduct(button.dataset.productId);
}

productGrid?.addEventListener("click", handleProductGridClick);
homeFeaturedGrid?.addEventListener("click", handleProductGridClick);

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-cart-action]");
  if (!button) return;
  const { productId, cartAction } = button.dataset;
  const item = cart.get(productId);
  if (!item) return;
  if (cartAction === "remove" || (cartAction === "decrease" && item.quantity === 1)) cart.delete(productId);
  else if (cartAction === "decrease") item.quantity -= 1;
  else if (cartAction === "increase") item.quantity += 1;
  renderCart();
});

cartButton.addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.querySelector(".checkout-button").addEventListener("click", () => announce("Checkout will be connected when the USA payment system is added."));
document.querySelector(".account-button").addEventListener("click", () => announce("Customer accounts will be available when the USA store is connected."));

searchToggle.addEventListener("click", () => {
  const isOpen = searchToggle.getAttribute("aria-expanded") === "true";
  searchToggle.setAttribute("aria-expanded", String(!isOpen));
  searchToggle.setAttribute("aria-label", isOpen ? "Open product search" : "Close product search");
  searchPanel.hidden = isOpen;
  if (!isOpen) searchInput.focus();
});

searchInput.addEventListener("input", renderProducts);
searchInput.addEventListener("keydown", (event) => { if (event.key === "Enter" && !["home", "catalog", "category"].includes(pageType)) { event.preventDefault(); const term = searchInput.value.trim(); window.location.href = `collection.html${term ? `?q=${encodeURIComponent(term)}` : ""}`; } });
const needSearchForm = document.querySelector(".need-search-form");
if (needSearchForm) {
  needSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const rawQuery = document.querySelector("#need-search-input").value.trim();
    if (!rawQuery) return;
    const needCategory = [
      [/digestion|digestive|gut|bloat|stomach/i, "Teas & Herbal Blends"],
      [/energy|vitality|focus|fatigue/i, "Superfoods"],
      [/sleep|relax|stress|calm|anxious/i, "Teas & Herbal Blends"],
      [/immune|immunity/i, "Mushrooms & Seaweed"],
      [/women|hormone/i, "Herbs & Botanicals"],
      [/joint|mobility|flexibility/i, "Supplements & Wellness"],
      [/heart|circulation/i, "Superfoods"],
      [/detox|cleanse|cleansing|liver/i, "Herbs & Botanicals"]
    ].find(([pattern]) => pattern.test(rawQuery))?.[1];
    searchInput.value = needCategory || rawQuery;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    homeSearchResults?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
document.querySelector(".search-clear").addEventListener("click", () => {
  searchInput.value = "";
  renderProducts();
  searchInput.focus();
});

document.querySelectorAll("[data-category-filter]").forEach((control) => {
  control.addEventListener("click", () => {
    const category = control.dataset.categoryFilter;
    if (!category) return;
    setCategory(category === "all" ? "all" : category);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("is-open")) closeCart();
    if (!searchPanel.hidden) {
      searchPanel.hidden = true;
      searchToggle.setAttribute("aria-expanded", "false");
      searchToggle.setAttribute("aria-label", "Open product search");
    }
    closeNavigation();
  }
  if (event.key === "Tab" && cartDrawer.classList.contains("is-open")) {
    const focusable = [...cartDrawer.querySelectorAll("button:not(:disabled), [href], input")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

renderCart();

const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.querySelector("#newsletter-email");
    const message = document.querySelector(".newsletter-message");
    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }
    message.textContent = "Thanks for your interest. Newsletter signup will be connected before launch.";
    email.value = "";
  });
}
}

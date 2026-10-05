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
const catalog = [
  { id: "organic-lions-mane-powder", name: "Organic/Bio Lion's Mane Powder", category: "Mushrooms", description: "Lion's Mane mushroom powder with a seafood-like flavor; the catalogue suggests adding it to smoothies, soups, or teas.", details: "Made from Hericium erinaceus mushroom.", ingredients: ["Lion's Mane mushroom (Hericium erinaceus)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-lions-mane-powder", image: "https://macrobioticworld.com/cdn/shop/files/lions-mane-superfood-powder-100g_17500f24-0552-4757-a468-bb8b46c52b2c_360x.png?v=1759918540" },
  { id: "organic-reishi-powder", name: "Organic/Bio Reishi Powder", category: "Mushrooms", description: "Reishi mushroom powder with a slightly bitter, earthy flavor; listed uses include soups, teas, and smoothies.", details: "Made from Ganoderma lucidum mushroom.", ingredients: ["Reishi mushroom (Ganoderma lucidum)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-reishi-powder", image: "https://macrobioticworld.com/cdn/shop/files/reishi-mushroom-organic-bio-superfood-powder-100g_360x.png?v=1759917266" },
  { id: "organic-chaga-powder", name: "Organic/Bio Chaga Mushroom Powder", category: "Mushrooms", description: "Chaga mushroom powder with a rich, earthy flavor; the catalogue suggests stirring it into hot water or adding it to food.", details: "Made from Inonotus obliquus. The product page lists 100% Chaga mushroom powder.", ingredients: ["Chaga mushroom (Inonotus obliquus)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-chaga-mushroom-powder", image: "https://macrobioticworld.com/cdn/shop/files/chaga-organic-bio-superfood-powder-100g_360x.png?v=1759917115" },
  { id: "organic-turkey-tail-powder", name: "Organic/Bio Turkey Tail Mushroom Powder", category: "Mushrooms", description: "Turkey Tail mushroom powder with a mild, earthy, slightly woodsy flavor; the catalogue lists teas, smoothies, soups, and baked goods as uses.", details: "Made from Coriolus versicolor mushrooms.", ingredients: ["Turkey Tail mushroom (Coriolus versicolor)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-turkey-tail-mushroom-powder", image: "https://macrobioticworld.com/cdn/shop/files/turkey-tail-organic-bio-superfood-powder-100g_360x.png?v=1759918295" },
  { id: "organic-cordyceps-militaris-powder", name: "Organic/Bio Cordyceps Militaris Powder", category: "Mushrooms", description: "Finely milled Cordyceps militaris powder with a rich, earthy flavor and slight umami note.", details: "The catalogue suggests mixing it into smoothies, tea, or recipes.", ingredients: ["Cordyceps militaris mushroom"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-cordyceps-militaris-powder", image: "https://macrobioticworld.com/cdn/shop/files/cordyceps-militaris-superfood-powder-100g_360x.png?v=1759918450" },
  { id: "organic-maitake-powder", name: "Organic/Bio Maitake Powder", category: "Mushrooms", description: "Maitake mushroom powder with an earthy, umami-rich flavor; listed uses include soups, sauces, stews, and smoothies.", details: "Made from Grifola frondosa mushroom.", ingredients: ["Maitake mushroom (Grifola frondosa)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-maitake-powder", image: "https://macrobioticworld.com/cdn/shop/files/maitake-organic-bio-superfood-powder-100g_360x.png?v=1759916260" },
  { id: "organic-shiitake-powder", name: "Organic/Bio Shiitake Mushroom Powder", category: "Mushrooms", description: "Shiitake mushroom powder with an umami, earthy, woody flavor; the catalogue suggests using it in soups, sauces, gravies, teas, or smoothies.", details: "Made from Lentinula edodes mushrooms.", ingredients: ["Shiitake mushroom (Lentinula edodes)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-shiitake-mushroom-powder", image: "https://macrobioticworld.com/cdn/shop/files/shiitake-organic-bio-superfood-powder-100g_360x.png?v=1759916340" },
  { id: "organic-mushroom-complex-powder", name: "Organic/Bio Mushroom Complex Powder", category: "Mushrooms", description: "Bio-organic mushroom powder blend with a listed suggested use of smoothies, coffee, tea, soups, and stews.", details: "The product page says the blend typically includes Lion's Mane, Reishi, Chaga, Turkey Tail, and Shiitake, depending on batch formulation.", ingredients: ["Mushroom blend; formulation varies by batch"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-mushroom-complex-powder", image: "https://macrobioticworld.com/cdn/shop/files/mushroom-complex-organic-bio-superfood-powder-100g_360x.png?v=1759918181" },
  { id: "12-mushroom-extract-complex", name: "12 Mushroom Extract Complex", category: "Mushrooms", description: "A 12-mushroom extract blend in 60-capsule format.", details: "The catalogue lists a serving size of 2 capsules and 30 servings per container.", ingredients: ["Oyster Mushroom", "Tremella", "Shiitake", "Poria cocos", "Reishi", "Agaricus blazei Murill", "Chaga", "Cordyceps militaris", "Lion's Mane", "Maitake", "Phellinus igniarius", "Turkey Tail"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/12-mushroom-extract-complex", image: "https://macrobioticworld.com/cdn/shop/files/41_organic-bio-12-mushroom-extract-complex-60-veggie-capsule_360x.png?v=1766140343" },
  { id: "15-mushroom-extract-complex", name: "15 Mushroom Extract Complex", category: "Mushrooms", description: "A 15-mushroom extract blend in 60-capsule format.", details: "The catalogue lists a serving size of 2 capsules and 30 servings per container.", ingredients: ["Tremella", "Shiitake", "Cordyceps militaris", "King Trumpet", "Black Fungus", "Chaga", "Reishi", "Lion's Mane", "Agaricus blazei Murill", "Maitake", "Oyster Mushroom", "Turkey Tail", "Phellinus igniarius", "Poria cocos", "Phellinus linteus"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/15-mushroom-extract-complex", image: "https://macrobioticworld.com/cdn/shop/files/37_organic-bio-15-mushroom-extract-complex-60-veggie-capsule_360x.png?v=1766141447" },
  { id: "organic-moringa-powder", name: "Organic/Bio Moringa Powder", category: "Superfoods", description: "Moringa powder with a subtly earthy flavor; listed uses include smoothies, salads, soups, and hot water.", details: "Made from Moringa oleifera. The catalogue lists a 100g size.", ingredients: ["Moringa (Moringa oleifera)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-moringa-powder", image: "https://cdn.shopify.com/s/files/1/0058/6157/2706/files/39.png?v=1759906820" },
  { id: "organic-black-maca-powder", name: "Organic/Bio Black Maca Powder", category: "Superfoods", description: "Black maca root powder with a malt-like, earthy flavor; the catalogue suggests smoothies, coffee, baking, and soups.", details: "Made from Lepidium meyenii root grown in Peru.", ingredients: ["Black maca root (Lepidium meyenii)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-black-maca-powder", image: "https://macrobioticworld.com/cdn/shop/files/MacrobioticWorld_Organic_Bio_Black_Maca_Superfood_Powder_100g_360x.png?v=1759906880" },
  { id: "organic-white-maca-powder", name: "Organic/Bio White Maca Powder", category: "Superfoods", description: "White maca powder with a mildly earthy, nutty flavor; listed uses include smoothies, oatmeal, and baked goods.", details: "Made from Lepidium meyenii grown in the high Andes of Peru.", ingredients: ["White maca (Lepidium meyenii)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-white-maca-powder", image: "https://macrobioticworld.com/cdn/shop/files/macrobioticworld-organic-bio-white-maca-superfood-powder-100g_360x.png?v=1759906877" },
  { id: "organic-wheatgrass-powder", name: "Organic/Bio Wheatgrass Powder", category: "Superfoods", description: "Wheatgrass powder with a slightly bitter, earthy flavor reminiscent of fresh greens; the catalogue lists smoothies, salads, and water as uses.", details: "Made from young shoots of Triticum aestivum.", ingredients: ["Wheatgrass (Triticum aestivum)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-wheatgrass-powder", image: "https://macrobioticworld.com/cdn/shop/files/86_360x.png?v=1759906794" },
  { id: "organic-spirulina", name: "Organic/Bio Spirulina Powder", category: "Superfoods", description: "Spirulina powder with an earthy taste and a hint of umami; the catalogue suggests smoothies, juices, and salads.", details: "Made from Arthrospira platensis, a blue-green algae.", ingredients: ["Spirulina (Arthrospira platensis)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-spirulina-powder", image: "https://macrobioticworld.com/cdn/shop/files/spirulina-organic-bio-superfood-powder-100g_360x.png?v=1759906840" },
  { id: "organic-chlorella", name: "Organic/Bio Chlorella Powder", category: "Superfoods", description: "Chlorella powder with a mild, earthy flavor and deep green color; listed uses include smoothies, soups, sauces, and salads.", details: "Made from Chlorella spp. microalgae.", ingredients: ["Chlorella spp. powder"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-chlorella-powder", image: "https://macrobioticworld.com/cdn/shop/files/chlorella-organic-bio-superfood-powder-100g_360x.png?v=1759906775" },
  { id: "organic-psyllium-husk", name: "Organic/Bio 98% Psyllium Husk", category: "Superfoods", description: "Psyllium husk with a mildly nutty flavor and gelling property, used in a variety of dishes.", details: "The product page identifies psyllium husk as derived from Plantago seeds and lists 150g and 1kg sizes.", ingredients: ["Psyllium husk (Plantago)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-98-purity-psyllium-husk-purity", image: "https://macrobioticworld.com/cdn/shop/files/PsylliumHuskBgTransparentMockup_360x.png?v=1760395873" },
  { id: "organic-dandelion-root-powder", name: "Organic/Bio Dandelion Roots Powder", category: "Superfoods", description: "Dandelion root powder; the catalogue suggests blending into smoothies or juice, stirring into hot water, or adding to recipes.", details: "The product page lists dandelion root as the ingredient.", ingredients: ["Dandelion root"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-dandelion-roots-powder", image: "https://macrobioticworld.com/cdn/shop/files/dandelion-root-organic-bio-superfood-powder-100g_360x.png?v=1759911188" },
  { id: "organic-milk-thistle-powder", name: "Organic/Bio Milk Thistle Powder", category: "Superfoods", description: "Milk thistle powder with a subtle, nutty flavor; the catalogue lists smoothies, juices, water, soups, and salads as uses.", details: "Made from Milk Thistle (Silybum marianum). The product page notes it contains naturally occurring silymarin.", ingredients: ["Milk Thistle (Silybum marianum)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-milk-thistle-powder", image: "https://macrobioticworld.com/cdn/shop/files/milk-thistle-organic-bio-superfood-powder-100g_360x.png?v=1759906851" },
  { id: "organic-super-greens", name: "Organic/Bio Super Greens Superfood", category: "Superfoods", description: "Green powder blend with a mildly earthy taste and a hint of sweetness from cinnamon.", details: "The blend includes wheatgrass, barley grass, spirulina, broken chlorella, alfalfa, cinnamon, and triphala. Suggested uses include smoothies, salads, oatmeal, yogurt, water, or juice.", ingredients: ["Wheatgrass", "Barley grass", "Spirulina", "Broken chlorella", "Alfalfa", "Cinnamon", "Triphala"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-super-greens-superfood-100", image: "https://macrobioticworld.com/cdn/shop/files/SuperGreens_360x.png?v=1760395871" },
  { id: "organic-coconut-protein", name: "Organic/Bio Coconut Protein", category: "Plant Protein", description: "Plant-based protein powder made from organic coconut meat, with a mild, nutty-sweet flavor.", details: "The product page lists 53.4g protein per 100g and a net weight of 500g.", ingredients: ["Organic coconut meat"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-coconut-protein", image: "https://macrobioticworld.com/cdn/shop/files/Coconut_Protein_500g_Mockup_360x.png?v=1761559776" },
  { id: "organic-pumpkin-protein-65", name: "Organic/Bio Pumpkin Protein 65%", category: "Plant Protein", description: "Organic pumpkin seed protein powder with 65% protein content and a subtle nutty flavor.", details: "The catalogue suggests smoothies, baking, or sprinkling over yogurt or cereal.", ingredients: ["Pumpkin seed protein (Cucurbita)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-pumpkin-protein", image: "https://macrobioticworld.com/cdn/shop/files/Pumpkinprotein65_500g_360x.png?v=1759906910" },
  { id: "organic-sunflower-protein-57", name: "Organic/Bio Sunflower Protein 57%", category: "Plant Protein", description: "Organic sunflower seed protein powder with 57% protein content and a subtle nutty, earthy flavor.", details: "The catalogue suggests smoothies, baking, and shakes.", ingredients: ["Sunflower seed protein (Helianthus annuus)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-sunflower-protein-57", image: "https://macrobioticworld.com/cdn/shop/files/SunflowerProtein57_360x.png?v=1759906845" },
  { id: "organic-flaxseed-protein-34", name: "Organic/Bio Flaxseed Protein 34%", category: "Plant Protein", description: "Flaxseed protein powder with a deep, nutty flavor and 34% protein content.", details: "The catalogue lists smoothies, baking, dressings, and sauces as uses.", ingredients: ["Flaxseed (Linum usitatissimum)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-flaxseed-protein", image: "https://macrobioticworld.com/cdn/shop/files/ProteinsTransparentMockups_360x.png?v=1759906910" },
  { id: "organic-quinoa-protein", name: "Organic/Bio Vital Vegan Quinoa Protein", category: "Plant Protein", description: "Organic quinoa protein powder with an earthy, nutty flavor; the catalogue lists smoothies and baking as uses.", details: "Made from Chenopodium quinoa. The product page describes a complete amino acid profile with all nine essential amino acids and lists a 500g size.", ingredients: ["Quinoa (Chenopodium quinoa)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-vital-vegan-quinoa-protein", image: "https://macrobioticworld.com/cdn/shop/files/Quinoaprotein500g_360x.png?v=1759906957" },
  { id: "organic-wormwood-herb-tea", name: "Organic/Bio Wormwood Herb Tea", category: "Herbal & Digestive", description: "A bold, bitter herbal infusion with a distinctive aromatic profile; the catalogue advises enjoying it in moderation.", details: "Ingredients: organic wormwood (Artemisia absinthium). The listed package size is 50g.", ingredients: ["Organic wormwood (Artemisia absinthium)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/wormwood-herb-tea-organic-bio", image: "https://macrobioticworld.com/cdn/shop/files/Copyofwormwoodherbsp_360x.png?v=1765720282" },
  { id: "black-walnut-husk-capsules", name: "Black Walnut Husk Capsules", category: "Herbal & Digestive", description: "Capsules made from dried green walnut hull; the catalogue lists 450mg of black walnut husk powder per capsule.", details: "The product page recommends short-term use only and lists 90 capsules.", ingredients: ["Black walnut husk powder (450mg per capsule)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/symbiosis-black-walnut-husk-capsules", image: "https://macrobioticworld.com/cdn/shop/files/black-walnut-husk-90-capsules-mockup_360x.png?v=1769714942" },
  { id: "black-walnut-husk-powder", name: "Black Walnut Husk Powder", category: "Herbal & Digestive", description: "Powder made from the dried green hull of the Black Walnut (Juglans nigra).", details: "The product page lists 100g and advises against long-term daily consumption.", ingredients: ["Black Walnut hull (Juglans nigra)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/black-walnut-husk-powder", image: "https://macrobioticworld.com/cdn/shop/files/symbiosis-black-walnut-husk-superfood-powder100gmockup_360x.png?v=1763631644" },
  { id: "senna-herbs", name: "Senna Herbs", category: "Herbal & Digestive", description: "Herbal tea made from senna leaves; the product page advises avoiding prolonged use without medical supervision.", details: "The catalogue lists 50g and steeping instructions for preparation as tea.", ingredients: ["Senna leaves"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/symbiosis-senna-herbs", image: "https://macrobioticworld.com/cdn/shop/files/macrobioticworld-organic-bio-senna-50g_360x.png?v=1765085369" },
  { id: "organic-oregano-herb-tea", name: "Organic/Bio Oregano Herb Tea", category: "Herbal & Digestive", description: "Caffeine-free oregano leaf tea with a robust, earthy flavor and a hint of spiciness.", details: "Made from Origanum vulgare leaves. The catalogue lists a 50g size and tea steeping instructions.", ingredients: ["Oregano leaves (Origanum vulgare)"], priceUSD: null, sourceUrl: "https://macrobioticworld.com/products/organic-bio-oregano-herb-tea", image: "https://macrobioticworld.com/cdn/shop/files/macrobioticworld-organic-bio-oregano-50g_360x.png?v=1765341648" }
];
const cart = new Map();
let toastTimer;
let lastFocusedElement;
let activeCategory = document.body.dataset.category || "all";
const isHomePage = document.body.dataset.pageType === "home";

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
  title.textContent = product.name;
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
  if (product.ingredients.length) {
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
  detailsLink.href = product.sourceUrl;
  detailsLink.target = "_blank";
  detailsLink.rel = "noopener noreferrer";
  detailsLink.textContent = "View official catalogue ↗";
  detailArea.append(detailsLink);

  const addButton = document.createElement("button");
  addButton.className = "add-button";
  addButton.type = "button";
  addButton.dataset.addToCart = "";
  addButton.dataset.productId = product.id;
  addButton.append(document.createTextNode("Add to bag"));
  const plus = document.createElement("span");
  plus.setAttribute("aria-hidden", "true");
  plus.textContent = "+";
  addButton.append(plus);

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
  if (homeSearchResults) homeSearchResults.hidden = false;
  const visibleProducts = catalog.filter((product) => {
    const categoryMatch = activeCategory === "all" || product.category === activeCategory;
    const searchableText = [product.name, product.category, product.description, product.details, ...product.ingredients].join(" ").toLocaleLowerCase();
    return categoryMatch && searchableText.includes(query);
  });
  productGrid.replaceChildren(...visibleProducts.map(createProductCard));
  productEmpty.hidden = visibleProducts.length > 0;
  searchFeedback.textContent = query ? `${visibleProducts.length} ${visibleProducts.length === 1 ? "product" : "products"} found.` : `${visibleProducts.length} of ${catalog.length} products shown.`;
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

renderProducts();

if (homeFeaturedGrid) {
  const featuredIds = ["organic-lions-mane-powder", "organic-moringa-powder", "organic-oregano-herb-tea", "organic-pumpkin-protein-65"];
  const featuredProducts = featuredIds.map((id) => catalog.find((product) => product.id === id)).filter(Boolean);
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
  if (!product) return;
  const existing = cart.get(id);
  cart.set(id, { product, quantity: (existing?.quantity ?? 0) + 1 });
  renderCart();
  announce(`${product.name} added to your bag.`);
}

function handleProductGridClick(event) {
  const button = event.target.closest("[data-add-to-cart]");
  if (button) addProduct(button.dataset.productId);
}

productGrid.addEventListener("click", handleProductGridClick);
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
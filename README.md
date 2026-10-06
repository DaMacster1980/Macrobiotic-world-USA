# Macrobiotic World USA

A responsive storefront prototype for the MWU brand. It keeps the existing designed Home, Shop by Product, and Shop by Need pages, with purpose-built collection, product detail, story, recipes, detox, contact, and customer information pages.

## Product catalog

`catalog-data.js` contains 1,679 MWC product records retrieved from its public catalog on 2026-10-06. Records include product names, source descriptions, source type/category, THB reference prices, product options, source links, and MWC-hosted product photo URLs. 1,676 products had at least one image in the feed; three had none. Empty descriptions and imported copy still need review before a public launch. No MWU health benefit text has been added; benefit and disclaimer fields are reserved in each record.

The product photos are loaded from MWC's Shopify image CDN. Confirm permission to reuse the catalog text and photos and move images to an MWU-controlled source before launch if required.

## Pages

- `index.html` — existing MWU homepage design.
- `shop-by-product.html` — existing design with its six featured categories alphabetized and the rest of the catalog categories added below.
- `shop-by-need.html` — existing designed need page.
- `collection.html?category=...` — searchable, sortable, paginated product collections.
- `product.html?handle=...` — dynamic product detail pages with source photos and variants.
- `manage-products.html` — browser preview for adding and editing products, setting a draft USD price, and changing sale and homepage switches. Open this page directly in the preview when you want to manage the catalog.
- `detox-kits.html`, `about.html`, `recipes.html`, `contact.html`, `shipping-returns.html`, `privacy.html`, and `terms.html` — purpose-built brand pages.

## Current limitations before real orders

This is still a static prototype. Product edits, USD draft prices, and admin switches save only in the current browser. They are not secure and do not update a shared catalog for other visitors. A product can be added to the preview bag after a draft USD price is entered, but checkout does not process orders. No database, authenticated admin, inventory sync, customer accounts, shipping rates, legal policies, or payment provider is connected. Prices remain unset until reviewed and entered.

Before launch, connect a real commerce backend and payment provider, confirm all product copy/photos may be reused, review descriptions for the US market, set the THB/USD exchange rate and markup/rounding rule, and complete customer service, shipping, privacy, returns, and terms details.

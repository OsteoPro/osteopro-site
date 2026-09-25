# OsteoPro website

Four static pages made with HTML, CSS and JavaScript. There is no framework, build step, backend, account system or submission form. All contact links use admin@osteopro.com.au.

## Open or host

Extract the ZIP and keep the folder structure together. Open `index.html` to read the site locally. The complete animated scene requires an HTTP(S) origin and access to the external animation libraries; a local file URL can show the static poster instead.

For Cloudflare Pages, use the extracted `osteopro-site` directory as the site root, with no build command and that directory as the output. The four page directories, assets and references must all stay in that root. The canonical domain and sitemap are set to `https://osteopro.com.au`. No repository connection or deployment was performed.

## File map

| File | Purpose |
| --- | --- |
| `index.html` | Home, inline static hero poster, technology strip, clearance systems, about and contact |
| `idiag-m360/index.html` | Idiag M360 copy, product-photo placeholder, notes and status |
| `mobee-med/index.html` | mobee med copy, product-photo placeholder, notes and status |
| `evidence/index.html` | The three supplied study summaries and limitations |
| `assets/css/tokens.css` | Every colour definition and shared design tokens |
| `assets/css/site.css` | Shared layout, responsive styling and reduced-motion rules |
| `assets/js/site.js` | Mobile navigation, conditional library loading and scroll reveals |
| `assets/js/hero.js` | Three.js glass discs, displaced liquid form, scan, parallax and animation lifecycle |
| `reference/reference-mockup.png` | Unchanged supplied design reference; not displayed as site content |
| `reference/logo.png` | Unchanged supplied brand mark, also used as the favicon and touch icon |
| `reference/logo-large.png` | Unchanged larger brand mark, used in the header and Open Graph image metadata |
| `sitemap.xml` | The four canonical page URLs |
| `robots.txt` | Crawler instructions and sitemap location |
| `README.md` | Setup, asset changes and verification notes |

The empty `assets/images/` directory is reserved for supplied product photographs. It is included in the ZIP.

## Product photographs

The attachments did not include standalone photographs of either product. Every product image area is therefore an explicitly labelled placeholder. No product image has been created, extracted from the reference mockup, or substituted.

Put actual photographs at `assets/images/idiag-m360.jpg` and `assets/images/mobee-med.jpg`. Replace the corresponding `figure.photo-placeholder` in both the home card and the product page with a `figure.product-photo` containing an `img`. Preserve the `product-visual` class on the large figure on a product page. Use the correct relative path: `./assets/images/idiag-m360.jpg` from the home page and `../assets/images/idiag-m360.jpg` from its product page. Supply accurate alt text and the photograph's intrinsic width and height. Leave original product branding intact. The stylesheet uses `object-fit: contain` to avoid cropping.

## Colour tokens and branding

Edit colours only in `assets/css/tokens.css`. The five supplied colours are retained as `--base`, `--deep`, `--mid`, `--light` and `--paper`. The single accent is `--accent` (RGB 28, 73, 153), the most frequent exact blue pixel in the supplied `logo-large.png`, occurring 1,308 times. Light tints, glass shading and gradients derive from those tokens. The JavaScript reads the base tokens from computed CSS. No orange has been added.

The original logos remain unchanged. To replace the brand mark later, update the image references in each page's header and metadata as well as its favicon links.

## Animation and fallbacks

Three.js 0.170.0 loads from jsDelivr. GSAP 3.12.5 and ScrollTrigger 3.12.5 load from cdnjs. Version-pinned URLs are in `assets/js/site.js`. These libraries load after page content, and are not bundled into this ZIP. The supplied logo is also the Open Graph image; no separate share artwork was created.

The abstract hero contains 17 glass discs, a noise-displaced background form, a single descending scan, a horizontal light streak, subtle grain and a 0 to −50 angle scale. The angle scale and discs are decorative, not measurement output. Mouse and touch pointer movement provide a small parallax response. The interface includes a motion pause control.

The animation stops when the hero leaves the viewport, when the document is hidden, or when the visitor pauses it. On smaller screens it uses 20 particles instead of 72, reduced geometry, a lower pixel-ratio cap and a 30 fps cap. Desktop animation is capped at 45 fps.

The inline poster is visible before JavaScript loads and remains visible when reduced motion is requested, data-saving mode is enabled, WebGL is unavailable, a library fails, or the graphics context is lost. A reduced-motion preference change removes the scene immediately. Content is visible without JavaScript, including an expanded navigation menu. Scroll reveals are subtle and disabled for reduced motion.

## Future

A `/book/` page with a Calendly embed plus a Stripe payment link can be added later. It is not included or linked from this site. The current contact route is email only.

## Design review

Two review passes were completed against the supplied mockup, colour rules, copy, restricted wording, responsive layout and motion fallbacks.

- Compared the required copy with the brief, word for word, including all three study paragraphs and the two device notes. The required negative distributor statement is retained exactly.
- Searched every delivered file for all restricted terms from the brief. No restricted wording was found. The two device notes retain the brief's permitted wording.
- Confirmed all local page, image, stylesheet, script and section links resolve; verified the sitemap, unique titles, descriptions, Open Graph metadata and one main heading per page.
- Compared the three reference files byte for byte with the attachments: unchanged.
- Checked all four pages at widths of 375, 768, 1280, 1440 and 1920 CSS pixels. There was no horizontal document overflow.
- Captured and visually reviewed each page at 375 and 1440 pixels in both passes, with separate viewport captures of the live WebGL scene. Also reviewed the reduced-motion and no-WebGL posters.
- Corrected the tablet angle-scale position and changed scroll reveals so off-screen content remains visible. Set the navigation enhancement class before first paint to prevent a mobile layout jump.
- Automated axe checks against WCAG 2 A/AA and 2.1 AA reported no violations on the four pages at 375 and 1440 pixels. Checked visible keyboard focus, mobile menu opening and Escape dismissal, product navigation and cross-page section links. Main text/button contrast ratios range from 7.68:1 to 15.29:1.
- Confirmed that motion pause stops WebGL draw calls, resume restarts them, leaving the viewport stops them, and returning restarts them. Changing to reduced motion removes the canvas and restores the poster.
- Checked every page at 200% root text size without horizontal overflow. With JavaScript disabled, the mobile navigation and static poster remain visible.

The browser checks used the exact pinned animation-library versions served from local copies because external CDN access in the test environment was restricted. Those test dependencies, browser files and screenshots are not part of the delivered website.

A local mobile Lighthouse run returned accessibility 100, first contentful paint 1.1 s, largest contentful paint 2.9 s, total blocking time 0 ms and cumulative layout shift 0. Chromium did not provide the tracing screenshots needed for the Speed Index audit, so Lighthouse returned no overall performance score. The mobile performance target of 85+ therefore remains unconfirmed. Production network performance was not measured.

## Not independently verified

- The current regulatory status, study details, credentials, product stock and export conditions stated in the supplied copy. They are reproduced as instructed.
- Real product photographs, because no standalone product photographs were attached.
- Rendering on physical iOS/Android devices, Safari or Firefox; browser testing used headless Chromium with emulated viewport sizes.
- Production CDN availability, hosting latency, Cloudflare configuration, DNS and social-crawler previews. The site was not deployed.
- Delivery by a visitor's email application. The email links and demonstration subject were checked; no message was sent.


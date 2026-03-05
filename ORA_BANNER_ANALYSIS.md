# Ora Cacao Full-Width Banner – Analysis

Reference: [Ceremonial Cacao by Ora Cacao](https://ceremonial-cacao.com/?tw_source=google&tw_adid=558405394764&tw_campaign=15152815586&tw_kwdid=kwd-1480641811394&gad_source=1&gad_campaignid=15152815586&gbraid=0AAAAADM771lWB_o86Cvgi5XdKZHfE-TuB)

---

## 1. Section structure (from source code)

- **Section**: `shopify-section spaced-section spaced-section--full-width banner-section`
- **Asset**: `section-image-banner.css`
- **Main wrapper**: `#Banner-{section_id}.banner.banner--adapt.banner--mobile-bottom`

### Layout

| Part | Role |
|------|------|
| `banner__media` | Full-width image (single `<img>` with responsive srcset) |
| `banner__content` | Overlay container; `image-banner--full-width`; flex alignment |
| `banner__box` | Content box (heading + text blocks + button) |

Content is positioned with **flex**: `align-items: flex-end; justify-content: center` → text sits at **bottom center** over the image.

---

## 2. Aspect ratio & height

- **Aspect ratio**: `padding-bottom: 52.35%` on `::before` / `.banner__media::before` to reserve space (≈ 2000×1047).
- **Variants** set explicit min-heights:
  - `.short`: `min-height: 40rem`
  - `.overlay` / `.overlay-2`: `min-height: 39rem` (50rem on desktop for overlay)
- **Mobile**: `banner--mobile-bottom` stacks content below the image on small screens.

---

## 3. Visual variants (CSS classes on banner)

| Class | Effect |
|-------|--------|
| **Default** | Centered text, transparent media |
| `.short` | 40rem min-height, CTA button `#B99135` |
| `.overlay` | Dark bg `#3d3334`, media opacity 0.1, content box ~70% width (desktop) |
| `.overlay-2` | Gold bg `#B99135`, same min-height |
| `.bean` | Content box on bean PNG (`bean_background.png`), padding 5rem / 10rem 15rem (hero) |
| `.long-bean` | Different bean image (`bean-2.png`), box width 90rem |
| `.tall-bean` | Tall bean image (`bean_tall.png`), 12rem padding |
| `.hero` | Box padding `0 4em 4em` |
| `.welcome` | Mobile: extra bottom padding, content absolutely positioned |
| `.adjust` | Mobile: box max-width 75% (100% under 499px) |

---

## 4. Content (homepage hero)

- **H1**: “CEREMONIAL CACAO”  
  - Font: Font1, 32px mobile / 40px desktop, uppercase, letter-spacing 3px, color #000 on desktop.
- **Line 1**: “Sustained energy. Uplifted mood. Nourished body.”
- **Line 2**: “A magical drinking chocolate made from 100% pure, organic cacao.”
- **CTA**: “Shop CACAO” → `/pages/shop-all`, class `button button--primary`.

Per-block inline styles control font-family (Font1), font-size, and color.

---

## 5. Image

- Single `<img>` in `.banner__media`.
- **Srcset**: 375w, 550w, 750w, 1100w, 1500w, 1780w, 2000w, 3000w, 3840w.
- **Sizes**: `100vw`.
- **Attributes**: `fetchpriority="high"`, `width="2000"`, `height="1047.0"`.
- **Alt**: e.g. “representing Ora's ceremonial cacao shop”.

---

## 6. Technical details

- **IDs**: Section and blocks use stable IDs (`#Banner-{section_id}`, `#Banner-{block_id}`) for scoped CSS.
- **Inline styles**: Block-level `<style>` for heading and text (font, size, color, spacing).
- **Responsive**:  
  - &lt; 499px: adjust box 100% width.  
  - &lt; 749px: mobile-only/desktop-only, welcome/adjust rules, stacked layout.  
  - ≥ 750px: overlay min-heights, box widths, bean padding.

---

## 7. Comparison with Pacha Mana

| Aspect | Ora Cacao banner | Pacha Mana (e.g. Image & text banner) |
|--------|-------------------|----------------------------------------|
| **Structure** | One image + one content box (H1 + 2 lines + 1 CTA) | Background image + overlay + container with heading, subheading, description, features, variants, CTA |
| **Layout** | Content at bottom center over image; mobile: content below | Centered content; optional parallax |
| **Variants** | Many (short, overlay, bean, hero, welcome, adjust) | Settings-driven (padding, colors, overlay) |
| **CSS** | Section/block IDs + inline styles + external CSS | Scoped class names (e.g. `ai-gift-banner__*`) + `{% style %}` |
| **Image** | One hero image, full width, aspect-ratio box | Background image, optional motion/parallax |
| **CTA** | Single primary button | Single configurable button |

Ora’s hero is a **minimal full-width image + one headline, two taglines, one CTA**, with optional overlay/bean styling. Pacha Mana’s “Image & text banner” is **richer in content** (features, variants, description) and more configurable via theme settings rather than CSS variants.

---

## 8. Recreating an Ora-style hero in Pacha Mana

To get a similar “full-width banner”:

1. **Layout**: One full-width image with fixed aspect ratio (e.g. ~52% or 16/9) and a content box overlaid at **bottom center** (`align-items: flex-end; justify-content: center`).
2. **Content**: One heading (H1), two short text lines, one primary CTA.
3. **Responsive**: On mobile, either keep overlay or stack content below image (`banner--mobile-bottom` style).
4. **Optional**: Overlay (solid color + reduced image opacity) and/or a “short” variant with min-height and accent button color.

This can be done by:
- Adding a **preset or layout mode** to the existing **Image & text banner** (e.g. “Hero – heading + 2 lines + CTA only”, content position “bottom center”), or
- Adding a dedicated **Full-width hero** section that only has: image, heading, line 1, line 2, button (link + label).

If you want, the next step can be a concrete Liquid/schema proposal for that hero section or preset.

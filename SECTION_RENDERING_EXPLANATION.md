# Section Rendering Explanation

## Which Sections Qualify for `{%- if is_index -%}` Condition?

### ✅ Sections That SHOULD Be Inside elementor-63 Wrapper (Lines 210-215)

When `is_index` is `true`, ALL sections from `templates/index.json` are rendered via `{{ content_for_layout }}` inside the elementor-63 wrapper:

1. `section_background_motion_MLrtBM` (section-background-motion)
2. `section_animatied_title_9PRf4W` (section-animatied-title)
3. `section_image_with_text_button_pRhDic` (section-image-with-text-button)
4. `section-health-benifits`
5. `section-featured-products`
6. `section-text-images-grid`
7. `section-image-text-dynamicbg`
8. `section-rescent-articles`
9. `section-photo-gallery`
10. `section-faq`

**These are ALL rendered via `{{ content_for_layout }}` on line 215 when `is_index` is true.**

### ❌ Sections That DON'T Qualify (Correctly Outside)

These sections are rendered directly in `theme.liquid` and should NOT be inside the elementor-63 wrapper:

1. **`section-header`** (line 195) - Rendered BEFORE the condition, outside elementor-63 ✅
2. **`section-footer`** (line 227) - Rendered AFTER the condition, outside elementor-63 ✅

These are global sections that appear on all pages, not just the index page.

## The Problem

If sections from `index.json` are appearing in the `{%- else -%}` block (lines 222-223) instead of inside the elementor-63 wrapper (lines 210-215), it means:

1. **The condition isn't matching** - `is_index` is `false` when it should be `true`
2. **Shopify is rendering sections outside the wrapper** - This shouldn't happen, but JavaScript fix handles this

## How `content_for_layout` Works

- When `template.name == 'index'`, Shopify uses `templates/index.json`
- `{{ content_for_layout }}` renders ALL sections listed in the `"order"` array of `index.json`
- These sections should ALL appear inside the elementor-63 wrapper when `is_index` is true
- If `is_index` is false, they appear in the `<main>` tag (lines 222-223)

## Solution

The JavaScript fix (lines 558-601) ensures that even if Shopify renders sections outside the wrapper, they will be moved inside the elementor-63 div automatically.


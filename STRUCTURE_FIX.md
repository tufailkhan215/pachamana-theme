# Elementor Structure Fix - Matching Source HTML

## Problem

The Shopify theme was not matching the source HTML structure (`index-clean.html`). The CSS files (`post-48.css`, `post-63.css`, etc.) target specific Elementor parent classes that weren't present in the Shopify theme structure.

## Source HTML Structure

The source HTML has this nested structure:

```html
<div data-elementor-type="single-page" data-elementor-id="48" class="elementor elementor-48 elementor-location-single post-63 page type-page status-publish hentry">
  <div class="plus_row_scroll_overflow elementor-element elementor-element-c259216 e-con-full e-flex e-con e-parent" data-id="c259216" data-element_type="container">
    <div class="elementor-element elementor-element-73ada70 elementor-widget elementor-widget-theme-post-content" data-id="73ada70" data-element_type="widget" data-widget_type="theme-post-content.default">
      <div class="elementor-widget-container">
        <div data-elementor-type="wp-page" data-elementor-id="63" class="elementor elementor-63">
          <!-- All sections (section-background-motion, section-animatied-title, etc.) are here -->
        </div>
      </div>
    </div>
  </div>
</div>
```

## Solution Applied

### 1. Wrapped Main Content in Elementor Structure

Updated `layout/theme.liquid` to wrap the main content (`{{ content_for_layout }}`) with the proper Elementor structure, but only for the homepage (`template.name == 'index'`):

```liquid
{%- if template.name == 'index' -%}
  <div data-elementor-type="single-page" data-elementor-id="48" class="elementor elementor-48 elementor-location-single post-63 page type-page status-publish hentry">
    <div class="plus_row_scroll_overflow elementor-element elementor-element-c259216 e-con-full e-flex e-con e-parent" data-id="c259216" data-element_type="container">
      <div class="elementor-element elementor-element-73ada70 elementor-widget elementor-widget-theme-post-content" data-id="73ada70" data-element_type="widget" data-widget_type="theme-post-content.default">
        <div class="elementor-widget-container">
          <div data-elementor-type="wp-page" data-elementor-id="63" class="elementor elementor-63">
            {{ content_for_layout }}
          </div>
        </div>
      </div>
    </div>
  </div>
{%- else -%}
  {{ content_for_layout }}
{%- endif -%}
```

### 2. Updated JavaScript Class Verification

Updated the `ensureElementorClasses()` function to verify the new structure:

- Checks for `elementor-48` wrapper
- Checks for `elementor-63` inner wrapper
- Adds classes if missing

## Why This Matters

### CSS File Dependencies

The CSS files use selectors that depend on these parent classes:

- **`post-48.css`**: Targets `.elementor-48 .elementor-element.elementor-element-c259216`
- **`post-63.css`**: Targets `.elementor-63 .elementor-element.elementor-element-13691562` (background motion section)
- **`post-57.css`**: Targets `.elementor-57` (header)
- **`post-191.css`**: Targets `.elementor-191` (footer)

Without these parent classes, the CSS rules won't match and styles won't be applied.

### Elementor Frontend JavaScript

Elementor's frontend JavaScript also expects this structure:
- It looks for `data-elementor-type` and `data-elementor-id` attributes
- It uses these to initialize widgets and apply styles
- Motion effects and animations depend on the proper structure

## Result

Now the Shopify theme structure matches the source HTML:
- ✅ All sections are wrapped in `elementor-48` container
- ✅ All sections are inside `elementor-63` wrapper
- ✅ CSS selectors from `post-*.css` files will match
- ✅ Elementor frontend JavaScript will initialize correctly
- ✅ Background images, colors, and animations will work

## Files Modified

- `layout/theme.liquid` - Added Elementor wrapper structure for homepage
- `layout/theme.liquid` - Updated `ensureElementorClasses()` function

## Testing

After this fix, verify:
1. Background images show (Peruvian patterns, cacao images)
2. Colors match the source design
3. Animations trigger correctly
4. Motion effects work (mouse tracking)
5. All CSS styles are applied

---

**Status:** ✅ Elementor wrapper structure added to match source HTML
**Commit:** Latest - "Add Elementor wrapper structure to match source HTML"


# Elementor CSS Variables Fix

## Problem

CSS files (`post-57.css`, `post-63.css`, `post-191.css`) use Elementor global color variables like:
- `var(--e-global-color-primary)`
- `var(--e-global-color-secondary)`
- `var(--e-global-color-text)`
- `var(--e-global-color-accent)`
- And many more custom color variables

These variables were not defined in the Shopify theme, causing styles to fail.

## Solution Applied

### 1. Found Source Variables

Found all Elementor global variables in `assets/post-15.css`:
```css
.elementor-kit-15 {
  --e-global-color-primary: #333132;
  --e-global-color-secondary: #5C402F;
  --e-global-color-text: #E2AB43;
  --e-global-color-accent: #FFFFFF;
  --e-global-color-58f068d: #044C4B;
  --e-global-color-5abf1e8: #F9F2EF;
  --e-global-color-26ebbe0: #3331324F;
  --e-global-color-5511ca5: #F9F2EFD1;
  --e-global-color-36c98fe: #5C402F85;
  --e-global-color-a92bdc7: #F9F2EF70;
  --e-global-color-77302cc: #E2AB43A1;
  /* Typography variables */
  --e-global-typography-primary-font-family: "OAXACA";
  --e-global-typography-primary-font-size: 28px;
  /* ... more typography variables ... */
}
```

### 2. Added Global CSS Variables

Added all variables to `:root`, `.elementor`, `.elementor-kit-15`, and `body.elementor-page` in `theme.liquid`:

```css
:root,
.elementor,
.elementor-kit-15,
body.elementor-page {
  /* Primary Colors */
  --e-global-color-primary: #333132;
  --e-global-color-secondary: #5C402F;
  --e-global-color-text: #E2AB43;
  --e-global-color-accent: #FFFFFF;
  
  /* Additional Custom Colors */
  --e-global-color-58f068d: #044C4B;
  --e-global-color-5abf1e8: #F9F2EF;
  --e-global-color-26ebbe0: #3331324F;
  --e-global-color-5511ca5: #F9F2EFD1;
  --e-global-color-36c98fe: #5C402F85;
  --e-global-color-a92bdc7: #F9F2EF70;
  --e-global-color-77302cc: #E2AB43A1;
  
  /* Typography Variables */
  --e-global-typography-primary-font-family: "OAXACA", Sans-serif;
  --e-global-typography-primary-font-size: 28px;
  --e-global-typography-secondary-font-family: "Roboto Slab", Sans-serif;
  --e-global-typography-secondary-font-weight: 400;
  --e-global-typography-text-font-family: "Roboto", Sans-serif;
  --e-global-typography-text-font-weight: 400;
  --e-global-typography-accent-font-family: "Roboto", Sans-serif;
  --e-global-typography-accent-font-weight: 500;
  --e-global-typography-ad91809-font-family: "Barlow", Sans-serif;
  --e-global-typography-ad91809-font-size: 18px;
  --e-global-typography-ad91809-font-weight: 500;
}
```

### 3. Added elementor-kit-15 Class to Body

Updated body tag to include Elementor classes:
```liquid
<body class="template-{{ template.name | handle }} elementor-default elementor-template-full-width elementor-kit-15 elementor-page">
```

This ensures:
- CSS variables are available globally
- `post-15.css` selectors match (`.elementor-kit-15`)
- Elementor styles apply correctly

## Color Values

| Variable | Color | Usage |
|----------|-------|-------|
| `--e-global-color-primary` | `#333132` (Dark gray) | Main background colors, navigation backgrounds |
| `--e-global-color-secondary` | `#5C402F` (Brown) | Body background, secondary elements |
| `--e-global-color-text` | `#E2AB43` (Gold) | Text colors, borders, accents |
| `--e-global-color-accent` | `#FFFFFF` (White) | Accent colors, highlights |
| `--e-global-color-5abf1e8` | `#F9F2EF` (Cream) | Light backgrounds, cards |
| `--e-global-color-77302cc` | `#E2AB43A1` (Gold with alpha) | Transparent overlays |

## Files Modified

- `layout/theme.liquid` - Added CSS variables to `:root` and body classes
- `layout/theme.liquid` - Added `elementor-kit-15` class to body element

## Result

✅ All Elementor CSS variables are now defined globally
✅ Colors match the source design
✅ Background colors, text colors, and borders will display correctly
✅ Typography variables ensure correct fonts are used

---

**Status:** ✅ Elementor CSS variables defined globally
**Commit:** Latest - "Add Elementor global color and typography CSS variables"


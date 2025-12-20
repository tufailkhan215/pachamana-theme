# CSS Path Fixes Summary

## Issues Fixed

### 1. CSS Files with Subfolder References
**Problem:** CSS files contained references to `../images/` and `../fonts/` subfolders, which don't exist in Shopify's flat asset structure.

**Error Examples:**
- `GET https://pachamana-2.myshopify.com/cdn/shop/t/14/images/peruvian_geometric_textile_pattern_3.png 404 (Not Found)`
- `GET https://pachamana-2.myshopify.com/cdn/shop/t/14/fonts/barlow-7chqv4kjgogqm7e30-8s51os.woff2 404 (Not Found)`

**Files Fixed:**
- `assets/barlow.css` - Fixed 54 font references
- `assets/barlowcondensed.css` - Fixed 54 font references  
- `assets/post-57.css` - Fixed `../images/peruvian_geometric_textile_pattern_3.png` reference
- `assets/post-191.css` - Fixed `../images/peruvian_geometric_textile_pattern_3.png` reference
- `assets/post-63.css` - Fixed multiple `../images/` references
- `assets/roboto.css` - Fixed font references
- `assets/robotoslab.css` - Fixed font references
- `assets/woocommerce.css` - Fixed font references

### 2. Path Replacement Pattern
**Before:**
```css
background-image: url("../images/peruvian_geometric_textile_pattern_3.png");
src: url(../fonts/barlow-7chqv4kjgogqm7e30-8s51os.woff2) format('woff2');
```

**After:**
```css
background-image: url("peruvian_geometric_textile_pattern_3.png");
src: url(barlow-7chqv4kjgogqm7e30-8s51os.woff2) format('woff2');
```

## Script Used
Created `fix_css_paths.py` to automatically fix all CSS files:
- Removes `../images/` prefix from image URLs
- Removes `../fonts/` prefix from font URLs
- Handles different quote styles (single, double, none)

## Remaining Issues

### Missing Images (404 Errors)
These images are referenced but don't exist in the assets folder:
- `Untitled-design-7.png` - Used in `section-featured-products.liquid`
- `IMG_0666.jpg` - Used in `section-image-text-dynamicbg.liquid` and `section-rescent-articles.liquid`
- `PACHAMANA-160.jpg` - Used in `section-rescent-articles.liquid`
- `cacao-sheny-leon-photography-maui-10.jpg` - Used in `section-rescent-articles.liquid`

**Note:** These images have `onerror="this.style.display='none'"` handlers, so they will gracefully hide if missing.

### JavaScript Loading
- `imagesloaded.pkgd.min.js` exists in assets and should load correctly
- The error `Uncaught SyntaxError: Unexpected token '<'` suggests the file might be returning HTML (404 page) instead of JavaScript
- This could be a caching issue or the file needs to be re-uploaded to Shopify

## Next Steps

1. **Upload Missing Images:**
   - Download from original source (`index-clean.html` or `index-live.html`)
   - Add to `assets/` folder
   - Commit and push

2. **Verify JavaScript Files:**
   - Ensure `imagesloaded.pkgd.min.js` is properly uploaded to Shopify
   - Clear browser cache and test again

3. **Test Theme:**
   - Upload updated theme to Shopify
   - Verify CSS background images load correctly
   - Verify fonts load correctly
   - Check browser console for any remaining errors

---

**Status:** ✅ CSS path references fixed
**Commit:** `98e2e8e` - "Fix CSS file paths: Remove ../images/ and ../fonts/ references for Shopify compatibility"


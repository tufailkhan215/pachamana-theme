# Download ThePlus JavaScript Files

The following JavaScript files need to be manually downloaded and added to `shopify-theme/assets/js/`:

## Required Files

1. **plus-posts-metro-list.min.js**
   - URL: `https://pachamana.com/wp-content/plugins/theplus_elementor_addon/assets/js/main/posts-listing/plus-posts-metro-list.min.js`
   - Save to: `shopify-theme/assets/js/plus-posts-metro-list.min.js`

2. **plus-accordion.min.js**
   - URL: `https://pachamana.com/wp-content/plugins/theplus_elementor_addon/assets/js/main/accordion/plus-accordion.min.js`
   - Save to: `shopify-theme/assets/js/plus-accordion.min.js`
   - **Note:** The theme includes a fallback accordion script, so this file is optional but recommended for full functionality.

3. **gallery-list.min.js**
   - URL: `https://pachamana.com/wp-content/plugins/theplus_elementor_addon/assets/js/main/gallery-listing/gallery-list.min.js`
   - Save to: `shopify-theme/assets/js/gallery-list.min.js`

## Download Instructions

### Method 1: Browser Download (Recommended)

1. Open each URL in your browser
2. Right-click on the page > "Save As" or use Ctrl+S (Windows) / Cmd+S (Mac)
3. Save the file with the exact name to the `shopify-theme/assets/js/` directory
4. Make sure the file extension is `.js` and not `.html` or `.txt`

### Method 2: Using Browser Developer Tools

1. Open the original website: `https://pachamana.com`
2. Open browser Developer Tools (F12)
3. Go to the Network tab
4. Reload the page
5. Filter by "JS" to see JavaScript files
6. Find the files listed above
7. Right-click on each file > "Save As" or "Copy response"
8. Save to `shopify-theme/assets/js/` with the correct filename

### Method 3: Using cURL or wget

```bash
# Using cURL
curl -o shopify-theme/assets/js/plus-posts-metro-list.min.js "https://pachamana.com/wp-content/plugins/theplus_elementor_addon/assets/js/main/posts-listing/plus-posts-metro-list.min.js"

curl -o shopify-theme/assets/js/plus-accordion.min.js "https://pachamana.com/wp-content/plugins/theplus_elementor_addon/assets/js/main/accordion/plus-accordion.min.js"

curl -o shopify-theme/assets/js/gallery-list.min.js "https://pachamana.com/wp-content/plugins/theplus_elementor_addon/assets/js/main/gallery-listing/gallery-list.min.js"
```

## Verification

After downloading, verify the files:

1. Check file sizes (should be > 1KB, typically 5-50KB for minified JS)
2. Open each file in a text editor
3. Should start with `(function`, `!function`, `var`, or `/*` (not `<html>` or `<!DOCTYPE>`)
4. Should contain JavaScript code, not HTML

## Fallback Functionality

- **Accordion**: The theme includes a complete fallback accordion script, so `plus-accordion.min.js` is optional. The accordion will work without it, but the original animation may differ slightly.

- **Gallery**: The gallery may not function fully without `gallery-list.min.js`. Consider using an alternative gallery solution if this file cannot be obtained.

- **Posts Metro List**: Required for the posts listing/metro layout functionality.

## Alternative Solutions

If you cannot obtain these files:

1. **Accordion**: The fallback script is already included and fully functional
2. **Gallery**: Consider using a Shopify-compatible gallery app or custom solution
3. **Posts Metro**: May need to implement a custom solution or use Shopify's native blog features

## After Download

Once all files are downloaded:

1. Verify all three files are in `shopify-theme/assets/js/`
2. Zip the theme folder
3. Upload to Shopify
4. Test the functionality

The theme is configured to load these files from the local assets directory automatically.


# Installation Guide

## Quick Start

1. **Zip the theme folder**
   - Navigate to the `shopify-theme` directory
   - Select all files and folders
   - Create a zip file named `pacha-mana-theme.zip`

2. **Upload to Shopify**
   - Log in to your Shopify admin
   - Go to **Online Store** > **Themes**
   - Click **Add theme** > **Upload zip file**
   - Select `pacha-mana-theme.zip`
   - Wait for upload to complete

3. **Activate the theme**
   - Click **Actions** > **Publish** on the uploaded theme

4. **Customize the theme**
   - Click **Customize** to open the theme editor
   - Configure theme settings (colors, fonts, logo, etc.)
   - Reorder or enable/disable sections as needed

## Theme Structure

The theme includes all necessary files:

- ✅ **12 Section files** - All page sections extracted and converted
- ✅ **Layout file** - Main theme template with all CSS/JS includes
- ✅ **Assets** - All CSS, JavaScript, images, and fonts
- ✅ **Config** - Theme settings schema for customization
- ✅ **Templates** - Homepage template configuration

## Section Order

The homepage sections are arranged in this order:

1. Header (navigation and logo)
2. Background Motion (hero section)
3. Animated Title (rotating headline)
4. Image with Text Button (ceremonial cacao intro)
5. Health Benefits (benefits cards)
6. Featured Products (product grid)
7. Text Images Grid (content grid)
8. Image Text Dynamic BG (dynamic background section)
9. Recent Articles (blog posts)
10. Photo Gallery (image gallery)
11. FAQ (accordion)
12. Footer (links and social)

## Customization

### Theme Settings

Access via **Customize** > **Theme settings**:

- **Colors**: Set accent colors (#5C402F, #E2AB43)
- **Typography**: Choose fonts for headings and body
- **Header**: Upload logo, set shop URL
- **Footer**: Customize copyright text

### Section Settings

Each section can be:
- Enabled/disabled
- Reordered via drag and drop
- Content edited (text, images, links)
- Styling adjusted

## Important Notes

### External Dependencies

Some scripts are loaded from external sources:

1. **CDN Scripts** (can be kept as-is):
   - ImagesLoaded: `cdn.jsdelivr.net`
   - Isotope: `cdn.jsdelivr.net`

2. **Original Server Scripts** (consider downloading):
   - ThePlus Elementor scripts from `pachamana.com`
   - For production, download and host locally for better performance

### Asset Paths

All asset paths have been converted to Shopify Liquid syntax:
- Images: `{{ "image-name.jpg" | asset_url }}`
- CSS: `{{ "style.css" | asset_url | stylesheet_tag }}`
- JS: `{{ "script.js" | asset_url | script_tag }}`

### Browser Compatibility

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Images not showing
- Check that all images are in `assets/images/`
- Verify asset paths use `{{ "filename" | asset_url }}`

### JavaScript errors
- Ensure jQuery loads before Elementor scripts
- Check browser console for specific errors
- Verify all JS files are in `assets/js/`

### Styles not applying
- Check that CSS files are in `assets/css/`
- Verify CSS is loaded in `layout/theme.liquid`
- Clear browser cache

### Accordion not working
- The theme includes fallback JavaScript
- Check that `plus-accordion.min.js` loads (or fallback activates)
- Verify jQuery is loaded

## Support

For issues or questions:
1. Check the README.md for detailed information
2. Review section files for specific functionality
3. Check browser console for JavaScript errors
4. Verify all assets are properly uploaded

## Next Steps

After installation:
1. Upload your logo to theme settings
2. Configure colors to match your brand
3. Update navigation links
4. Add your products
5. Customize section content
6. Test on mobile devices
7. Optimize images for web
8. Set up analytics tracking


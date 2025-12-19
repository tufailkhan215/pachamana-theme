# Pacha Mana Shopify Theme

A complete Shopify theme conversion from the original Pacha Mana website, maintaining all design elements, animations, and functionality.

## Theme Structure

```
shopify-theme/
├── assets/
│   ├── css/          # All CSS stylesheets
│   ├── js/           # All JavaScript files
│   ├── images/       # All images
│   ├── fonts/        # Font files
│   └── webfonts/     # Web fonts (Font Awesome)
├── config/
│   └── settings_schema.json  # Theme customization settings
├── layout/
│   └── theme.liquid  # Main layout template
├── sections/         # All page sections
│   ├── section-header.liquid
│   ├── section-background-motion.liquid
│   ├── section-animatied-title.liquid
│   ├── section-image-with-text-button.liquid
│   ├── section-health-benifits.liquid
│   ├── section-featured-products.liquid
│   ├── section-text-images-grid.liquid
│   ├── section-image-text-dynamicbg.liquid
│   ├── section-rescent-articles.liquid
│   ├── section-photo-gallery.liquid
│   ├── section-faq.liquid
│   └── section-footer.liquid
├── snippets/
│   └── meta-tags.liquid  # SEO meta tags snippet
└── templates/
    └── index.json    # Homepage template configuration
```

## Sections

The theme includes 12 main sections:

1. **section-header** - Header with navigation and logo
2. **section-background-motion** - Hero section with background motion effects
3. **section-animatied-title** - Animated headline section
4. **section-image-with-text-button** - Image with text and CTA button
5. **section-health-benifits** - Health benefits cards section
6. **section-featured-products** - Featured products grid
7. **section-text-images-grid** - Text and images grid layout
8. **section-image-text-dynamicbg** - Image with text and dynamic background
9. **section-rescent-articles** - Recent articles/blog posts
10. **section-photo-gallery** - Photo gallery with metro layout
11. **section-faq** - FAQ accordion section
12. **section-footer** - Footer with links and social media

## Installation

1. Zip the `shopify-theme` folder
2. In your Shopify admin, go to Online Store > Themes
3. Click "Add theme" > "Upload zip file"
4. Select the zip file and upload
5. Customize the theme settings in the theme editor

## Features

- ✅ All original CSS and JavaScript preserved
- ✅ All images and fonts included
- ✅ Animations and interactions working
- ✅ Responsive design maintained
- ✅ Accordion functionality
- ✅ Gallery with metro layout
- ✅ Product integration ready
- ✅ SEO optimized

## Customization

### Theme Settings

Access theme settings in Shopify admin:
- Colors: Customize accent colors
- Typography: Select fonts for headings and body text
- Header: Upload logo and set shop URL
- Footer: Customize copyright text

### Section Settings

Each section can be customized in the theme editor:
- Enable/disable sections
- Reorder sections
- Edit section content
- Adjust spacing and styling

## Dependencies

### External Scripts (CDN)
- ImagesLoaded: https://cdn.jsdelivr.net/npm/imagesloaded@4/
- Isotope: https://cdn.jsdelivr.net/npm/isotope-layout@3/

### External Scripts (Original Server)
- ThePlus Elementor Addon scripts (loaded from original server)
  - plus-posts-metro-list.min.js
  - plus-accordion.min.js
  - gallery-list.min.js

**Note:** For production, you may want to download these scripts and host them locally.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Notes

- Some external scripts are still loaded from the original server. Consider downloading and hosting them locally for better performance and reliability.
- The theme uses jQuery and Elementor frontend scripts. Ensure these are loaded in the correct order.
- Accordion functionality includes fallback JavaScript to ensure it works even if the main script fails to load.

## Support

For issues or questions, please contact the theme developer.


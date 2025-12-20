# Dynamic Sections Guide

This document explains how all sections have been made dynamic for the Shopify theme.

## Global Sections (Same on All Pages)

### Header (`section-header`)
- **Location**: Included in `header-group.liquid` which is loaded in `theme.liquid`
- **Settings**: Logo image, Navigation menu, Social icons (blocks), Cart icon toggle
- **How to Edit**: Go to Theme Editor → Header section

### Footer (`section-footer`)
- **Location**: Included in `footer-group.liquid` which is loaded in `theme.liquid`
- **Settings**: Footer content, links, social media
- **How to Edit**: Go to Theme Editor → Footer section

## Content Sections (Different Per Page)

All content sections can be added/removed/reordered per page in the Theme Editor.

### 1. Background Motion (`section-background-motion`)
- **Dynamic Settings**:
  - Image picker for logo/image
  - Heading text field
- **Default**: Falls back to original image and text if not set

### 2. Animated Title (`section-animatied-title`)
- **Dynamic Settings**:
  - Prefix text (e.g., "OUR CACAO IS ")
  - Rotating text blocks (add/remove/reorder)
- **Default**: Includes 7 preset rotating words

### 3. Image With Text Button (`section-image-with-text-button`)
- **Dynamic Settings**:
  - Image picker
  - Heading text
  - Subheading text
  - Description (textarea)
  - Button text
  - Button URL

### 4. Health Benefits (`section-health-benifits`)
- **Dynamic Settings**:
  - Heading text
  - Subheading text
  - Benefit items (blocks) - each with text and optional link

### 5. Featured Products (`section-featured-products`)
- **Dynamic Settings**:
  - Heading text
  - Product selection (product picker or collection)
  - Number of products to show

### 6. Text Images Grid (`section-text-images-grid`)
- **Dynamic Settings**:
  - Grid items (blocks) - each with image, heading, and description

### 7. Image Text Dynamic BG (`section-image-text-dynamicbg`)
- **Dynamic Settings**:
  - Image picker
  - Heading text
  - Description text
  - Background image

### 8. Recent Articles (`section-rescent-articles`)
- **Dynamic Settings**:
  - Heading text
  - Article/blog selection
  - Number of articles to show

### 9. Photo Gallery (`section-photo-gallery`)
- **Dynamic Settings**:
  - Heading text
  - Gallery images (blocks) - each with image picker

### 10. FAQ (`section-faq`)
- **Dynamic Settings**:
  - Heading text
  - FAQ items (blocks) - each with question and answer

## How to Use

1. **Edit Global Header/Footer**:
   - Go to Online Store → Themes → Customize
   - Click on Header or Footer section
   - Make changes (these apply to all pages)

2. **Edit Page Content**:
   - Go to Online Store → Themes → Customize
   - Navigate to the page you want to edit
   - Add/remove/reorder sections as needed
   - Each section can be customized with its own settings

3. **Add New Sections to a Page**:
   - In Theme Editor, click "Add section"
   - Choose from available sections
   - Configure settings for that section

## Notes

- Header and Footer are set once and appear on all pages
- Content sections can vary per page
- All images can be uploaded through the Theme Editor
- All text content can be edited without code
- Blocks allow for repeatable content (benefits, FAQ items, gallery images, etc.)


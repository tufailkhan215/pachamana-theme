# Detailed Prompt: Create Shopify Loyalty & Rewards Section

## Overview
Create a standalone Shopify section (`sections/section-loyalty-rewards.liquid`) that displays a loyalty and rewards program interface similar to the WooCommerce Loyalty Rewards plugin. The section should be fully customizable through the Shopify theme editor and work independently without external dependencies.

## Functional Requirements

### 1. Section Structure
- **Section Name**: "Loyalty & Rewards"
- **Section ID**: `section-loyalty-rewards`
- **Template Compatibility**: Should work on any page template (page, account, custom templates)
- **Block-based Architecture**: Use Shopify blocks for each earning method/reward opportunity

### 2. Content Areas

#### A. "Ways to Earn Rewards" Section
Display a grid of cards showing different ways customers can earn rewards. Each card should be a block with:
- **Icon/Image**: Customizable icon or image picker
- **Title**: Text input for the earning method name (e.g., "Earn Points for Purchase", "Referral", "Leave a review get $3!")
- **Points/Reward Display**: Text area showing the reward amount (e.g., "2 Points for each $1.00 spent", "+300 Points")
- **Description**: Text area for detailed description (e.g., "Spend $1 → Earn 2 Points. That's 2% back in store credit!")
- **Card Style**: Border, background, hover effects

#### B. "Rewards Opportunities" Section
Display a grid of cards showing redemption/claim opportunities:
- **Icon/Image**: Customizable icon or image picker
- **Title**: Text input (e.g., "Point Conversion")
- **Description**: Text area (e.g., "Click my rewards to claim: 100 points = $1")
- **Action Button** (optional): Link to rewards page or account section

### 3. Theme Customization Settings

#### Color Scheme
- **Primary/Theme Color**: Color picker (default: #e2ab43 - gold)
- **Text Color**: Color picker (default: #1D2327 - dark gray)
- **Border Color**: Color picker (default: #CFCFCF - light gray)
- **Background Color**: Color picker (default: #ffffff - white)
- **Button Text Color**: Color picker (default: #ffffff - white)
- **Table Header Background**: Color picker with opacity (default: #e2ab4330 - gold with 30% opacity)

#### Typography
- **Heading Font**: Font picker or text input
- **Heading Size**: Range slider (14px - 48px, default: 24px)
- **Body Font**: Font picker or text input
- **Body Size**: Range slider (12px - 20px, default: 16px)
- **Card Title Size**: Range slider (16px - 32px, default: 20px)

#### Layout
- **Cards Per Row (Desktop)**: Select dropdown (1, 2, 3, 4 - default: 3)
- **Cards Per Row (Tablet)**: Select dropdown (1, 2, 3 - default: 2)
- **Cards Per Row (Mobile)**: Select dropdown (1, 2 - default: 1)
- **Card Spacing**: Range slider (10px - 60px, default: 20px)
- **Section Padding**: Range sliders for top/bottom (0px - 100px, default: 40px)
- **Section Max Width**: Range slider (800px - 1400px, default: 1200px) or "Full Width" checkbox

#### Card Styling
- **Card Border Width**: Range slider (0px - 5px, default: 1px)
- **Card Border Radius**: Range slider (0px - 30px, default: 8px)
- **Card Background**: Color picker (default: transparent/white)
- **Card Hover Effect**: Checkbox (enable/disable hover transform and shadow)
- **Card Shadow**: Range slider for box-shadow (0px - 20px, default: 0px)
- **Icon Size**: Range slider (32px - 80px, default: 52px)

### 4. Block Settings (for each earning method/reward)

Each block should have:
- **Block Type**: "earning_method" or "reward_opportunity"
- **Block Name**: "Earning Method" or "Reward Opportunity"
- **Settings**:
  - **Icon Type**: Select (Icon, Image, None)
  - **Icon Class** (if Icon type): Text input for icon class (e.g., "wlr wlrf-point_for_purchase")
  - **Icon Image** (if Image type): Image picker
  - **Title**: Text input
  - **Points/Reward Text**: Text input (supports HTML for currency symbols)
  - **Description**: Textarea (supports HTML)
  - **Link URL** (optional): URL input for clickable cards
  - **Link Text** (optional): Text input for link/button text

### 5. CSS Styling Requirements

#### Base Styles
```css
.loyalty-rewards-section {
  /* Container styles with theme colors */
}

.loyalty-rewards-section .section-heading {
  /* Heading with left border accent in theme color */
  border-left: 3px solid [theme-color];
  color: [text-color];
}

.loyalty-rewards-section .rewards-grid {
  /* Grid layout responsive */
  display: grid;
  grid-template-columns: repeat([desktop-columns], 1fr);
  gap: [card-spacing];
}

.loyalty-rewards-section .reward-card {
  /* Card styling */
  border: [border-width] solid [border-color];
  border-radius: [border-radius];
  background: [card-background];
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.loyalty-rewards-section .reward-card:hover {
  /* Hover effects if enabled */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loyalty-rewards-section .reward-icon {
  /* Icon styling */
  color: [theme-color];
  width: [icon-size];
  height: [icon-size];
}

.loyalty-rewards-section .reward-title {
  /* Title styling */
  color: [text-color];
  font-size: [card-title-size];
}

.loyalty-rewards-section .reward-points {
  /* Points/reward text styling */
  color: [text-color];
  font-weight: 600;
}

.loyalty-rewards-section .reward-description {
  /* Description styling */
  color: [text-color];
  font-size: [body-size];
  line-height: 1.6;
}
```

#### Responsive Breakpoints
- **Desktop**: Default grid (3 columns)
- **Tablet** (max-width: 1024px): 2 columns
- **Mobile** (max-width: 768px): 1 column, adjusted padding and font sizes

#### Special Styling
- **Active/Selected State**: Border-bottom accent in theme color (3px solid)
- **Table Styling** (if tables are added later): Header background with theme color opacity, border styling
- **Button Styling**: Theme color background, white text, rounded corners (6px border-radius)

### 6. JavaScript Functionality (if needed)

- **Read More/Less**: If descriptions are long, implement "read more" toggle
- **Smooth Scroll**: If cards link to sections on the same page
- **Animation on Scroll**: Optional fade-in animation when section comes into view

### 7. Schema Structure

```json
{
  "name": "Loyalty & Rewards",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "header",
      "content": "Color Settings"
    },
    {
      "type": "color",
      "id": "theme_color",
      "label": "Theme Color",
      "default": "#e2ab43"
    },
    {
      "type": "color",
      "id": "text_color",
      "label": "Text Color",
      "default": "#1D2327"
    },
    {
      "type": "color",
      "id": "border_color",
      "label": "Border Color",
      "default": "#CFCFCF"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "header",
      "content": "Layout Settings"
    },
    {
      "type": "range",
      "id": "cards_per_row_desktop",
      "label": "Cards Per Row (Desktop)",
      "min": 1,
      "max": 4,
      "step": 1,
      "default": 3
    },
    {
      "type": "range",
      "id": "cards_per_row_tablet",
      "label": "Cards Per Row (Tablet)",
      "min": 1,
      "max": 3,
      "step": 1,
      "default": 2
    },
    {
      "type": "range",
      "id": "cards_per_row_mobile",
      "label": "Cards Per Row (Mobile)",
      "min": 1,
      "max": 2,
      "step": 1,
      "default": 1
    },
    {
      "type": "range",
      "id": "card_spacing",
      "label": "Card Spacing",
      "min": 10,
      "max": 60,
      "step": 5,
      "unit": "px",
      "default": 20
    },
    {
      "type": "header",
      "content": "Section Headings"
    },
    {
      "type": "text",
      "id": "earning_section_title",
      "label": "Ways to Earn Section Title",
      "default": "Ways to earn rewards"
    },
    {
      "type": "text",
      "id": "opportunities_section_title",
      "label": "Rewards Opportunities Section Title",
      "default": "rewards opportunities"
    }
  ],
  "blocks": [
    {
      "type": "earning_method",
      "name": "Earning Method",
      "settings": [
        {
          "type": "select",
          "id": "icon_type",
          "label": "Icon Type",
          "options": [
            { "value": "icon", "label": "Icon Class" },
            { "value": "image", "label": "Image" },
            { "value": "none", "label": "None" }
          ],
          "default": "icon"
        },
        {
          "type": "text",
          "id": "icon_class",
          "label": "Icon Class",
          "info": "CSS class for icon (e.g., 'wlr wlrf-point_for_purchase')",
          "default": ""
        },
        {
          "type": "image_picker",
          "id": "icon_image",
          "label": "Icon Image",
          "info": "Upload an image icon (recommended: 52x52px)"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Title",
          "default": "Earn Points for Purchase"
        },
        {
          "type": "text",
          "id": "points_text",
          "label": "Points/Reward Text",
          "default": "2 Points for each $1.00 spent",
          "info": "Supports HTML for currency symbols"
        },
        {
          "type": "textarea",
          "id": "description",
          "label": "Description",
          "default": "Spend $1 → Earn 2 Points. That's 2% back in store credit!"
        },
        {
          "type": "url",
          "id": "link_url",
          "label": "Link URL (Optional)",
          "info": "Make the card clickable"
        },
        {
          "type": "text",
          "id": "link_text",
          "label": "Link Text (Optional)",
          "default": "Learn More"
        }
      ]
    },
    {
      "type": "reward_opportunity",
      "name": "Reward Opportunity",
      "settings": [
        // Same settings as earning_method
      ]
    }
  ],
  "presets": [
    {
      "name": "Loyalty & Rewards",
      "blocks": [
        {
          "type": "earning_method",
          "settings": {
            "icon_class": "wlr wlrf-point_for_purchase",
            "title": "Earn Points for Purchase",
            "points_text": "2 Points for each $1.00 spent",
            "description": "Spend $1 → Earn 2 Points. That's 2% back in store credit!"
          }
        },
        {
          "type": "earning_method",
          "settings": {
            "icon_class": "wlr wlrf-referral",
            "title": "Referral",
            "points_text": "You get Points : 20%<br>Your friend gets Points : 10%",
            "description": "You earn 20% from their order and your friend gets 10% off their order! Win win!"
          }
        },
        {
          "type": "earning_method",
          "settings": {
            "icon_class": "wlr wlrf-product_review",
            "title": "Leave a review get $3!",
            "points_text": "+300 Points",
            "description": "Leave a review & get $3 off your next order in store credit!"
          }
        },
        {
          "type": "reward_opportunity",
          "settings": {
            "icon_class": "wlr wlrf-points_conversion",
            "title": "Point Conversion",
            "description": "Click my rewards to claim: 100 points = $1"
          }
        }
      ]
    }
  ]
}
```

### 8. Implementation Notes

1. **No External Dependencies**: The section should work without any external JavaScript libraries or plugins
2. **Shopify Native**: Use only Shopify Liquid, CSS, and vanilla JavaScript
3. **Accessibility**: Include proper ARIA labels, semantic HTML, keyboard navigation support
4. **Performance**: Optimize images, use CSS for animations (not JavaScript where possible)
5. **SEO Friendly**: Use proper heading hierarchy (h2, h3, etc.)
6. **Mobile First**: Design responsive from mobile up
7. **Theme Integration**: Use Shopify theme color variables if available, but allow overrides

### 9. Testing Checklist

- [ ] Section displays correctly on desktop, tablet, and mobile
- [ ] All color settings work and apply correctly
- [ ] Grid layout adjusts based on settings
- [ ] Cards are clickable if link URL is provided
- [ ] Icons display correctly (both icon class and image types)
- [ ] Text supports HTML (currency symbols, line breaks)
- [ ] Hover effects work (if enabled)
- [ ] Section works in Shopify theme editor
- [ ] Section can be added/removed from pages
- [ ] Blocks can be reordered
- [ ] Default preset creates a functional section

### 10. Additional Features (Optional Enhancements)

- **Animation on Scroll**: Fade-in animation when section enters viewport
- **Read More/Less**: Toggle for long descriptions
- **Badge/Status Indicators**: Show "New" or "Popular" badges on cards
- **Progress Bars**: Visual progress indicators for earning goals
- **Countdown Timers**: For limited-time offers
- **Customer-Specific Content**: Show different content for logged-in customers
- **Integration Hooks**: Placeholder for future loyalty program API integration

## Deliverables

1. **Main Section File**: `sections/section-loyalty-rewards.liquid`
   - Complete Liquid template with schema
   - Inline CSS (or reference to external stylesheet)
   - Optional JavaScript for interactions

2. **Documentation**: 
   - How to add the section to a page
   - How to customize colors and layout
   - How to add/remove earning methods
   - How to configure blocks

3. **Default Content**: 
   - Preset with 3 earning methods and 1 reward opportunity matching the original design

## Design Reference

- **Original Colors**: 
  - Theme: #e2ab43 (gold)
  - Text: #1D2327 (dark gray)
  - Border: #CFCFCF (light gray)
  - Background: #ffffff (white)

- **Original Layout**: 
  - 3 cards per row on desktop
  - Card-based design with icons
  - Left border accent on headings
  - Clean, modern aesthetic

- **Original Functionality**:
  - Static display (no dynamic point calculations)
  - Informational cards
  - Optional clickable links

---

**Note**: This section should be informational/display-only. Actual point tracking, calculations, and redemption should be handled by a separate Shopify app or custom backend integration.

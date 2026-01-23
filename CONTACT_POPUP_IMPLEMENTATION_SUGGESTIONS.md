# Contact Popup Modal Implementation Suggestions for Shopify

## Analysis of WordPress Elementor Popup

### **Current WordPress Structure:**

The popup on `pachamana.com` is an Elementor popup modal with the following characteristics:

1. **Popup Container:**
   - ID: `elementor-popup-modal-1197`
   - Type: Lightbox/Dialog widget
   - Animation: fadeIn (entrance and exit)
   - Settings: `entrance_animation`, `exit_animation`, `entrance_animation_duration`

2. **Content Structure:**
   - Logo image (Pacha Mana logomark)
   - Heading: "Contact us"
   - Text content with email address
   - Contact form with fields:
     - Name (text input)
     - Email (email input, required)
     - Message (textarea)
     - Submit button

3. **Trigger:**
   - Link in footer: `#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjExOTciLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D`
   - This is an Elementor action URL that opens popup ID 1197

4. **Styling:**
   - Uses `popup.min.css` for base styles
   - Uses `post-1197.css` for popup-specific styles
   - Responsive design
   - Close button in top-right corner

## Implementation Suggestions for Shopify

### **Requirements:**
1. ✅ Enable/disable popup from theme settings
2. ✅ Visual layout remains the same as Elementor
3. ✅ Use Shopify's native contact form
4. ✅ Email setting in theme settings (if empty, sends to store owner)
5. ✅ Native form handles validation automatically
6. ✅ Native form shows success and error messages

### **Approach: Theme Settings + Section Implementation (Recommended)**

#### **Step 1: Add Theme Settings to `config/settings_schema.json`**

Add a new settings group for Contact Popup:

```json
{
  "name": "Contact Popup",
  "settings": [
    {
      "type": "checkbox",
      "id": "contact_popup_enabled",
      "label": "Enable Contact Popup",
      "default": false,
      "info": "Show contact popup modal on the site"
    },
    {
      "type": "image_picker",
      "id": "contact_popup_logo",
      "label": "Popup Logo Image",
      "info": "Recommended: 400px width, transparent background"
    },
    {
      "type": "text",
      "id": "contact_popup_heading",
      "label": "Popup Heading",
      "default": "Contact us"
    },
    {
      "type": "richtext",
      "id": "contact_popup_text",
      "label": "Popup Text Content",
      "default": "<p>Fill out the form below, and we will be in touch shortly or,</p>"
    },
    {
      "type": "text",
      "id": "contact_popup_display_email",
      "label": "Display Email Address",
      "default": "pachamanacacao@gmail.com",
      "info": "Email address displayed in popup text (for urgent questions)"
    },
    {
      "type": "text",
      "id": "contact_popup_button_text",
      "label": "Submit Button Text",
      "default": "Send"
    },
    {
      "type": "text",
      "id": "contact_popup_success_message",
      "label": "Success Message",
      "default": "Thank you! We will be in touch shortly."
    }
  ]
}
```

**Note:** Add this settings group to the existing `settings_schema.json` array.

#### **Step 2: Create Section File: `sections/section-contact-popup.liquid`**

**Important:** Use Elementor CSS classes from `post-1197.css` to match the source site exactly.

**Structure (Using Elementor Classes):**
```liquid
{%- comment -%}
  Contact Popup Modal Section
  Uses Elementor CSS classes from post-1197.css to match source site exactly
  Enabled/disabled via theme settings: settings.contact_popup_enabled
{%- endcomment -%}

{%- if settings.contact_popup_enabled -%}
<div id="elementor-popup-modal-1197" 
     class="elementor-popup-modal dialog-type-lightbox dialog-type-buttons dialog-lightbox-widget" 
     role="document" 
     aria-modal="true" 
     aria-hidden="true"
     tabindex="0">
  
  <div class="dialog-widget-content dialog-lightbox-widget-content animated">
    <a role="button" 
       tabindex="0" 
       aria-label="Close" 
       href="#" 
       class="dialog-close-button dialog-lightbox-close-button"
       data-close-popup>
      <svg aria-hidden="true" class="e-font-icon-svg e-eicon-close eicon-close" viewBox="0 0 24 24">
        <use xlink:href="#eicon-close"></use>
      </svg>
    </a>
    
    <div class="dialog-header dialog-lightbox-header"></div>
    
    <div class="dialog-message dialog-lightbox-message">
      <div data-elementor-type="popup" 
           data-elementor-id="1197" 
           class="elementor elementor-1197 elementor-location-popup">
        
        <div class="elementor-element elementor-element-429e1a33 e-con-full e-flex e-con e-parent" 
             data-id="429e1a33" 
             data-element_type="container">
          
          {%- comment -%} Logo Image {%- endcomment -%}
          {%- if settings.contact_popup_logo != blank -%}
            <div class="elementor-element elementor-element-b3689c1 elementor-widget elementor-widget-image" 
                 data-id="b3689c1" 
                 data-element_type="widget" 
                 data-widget_type="image.default">
              <div class="elementor-widget-container">
                <img loading="lazy" 
                     width="800" 
                     height="502" 
                     src="{{ settings.contact_popup_logo | image_url: width: 800 }}" 
                     alt="{{ shop.name }}" 
                     class="attachment-large size-large">
              </div>
            </div>
          {%- endif -%}
          
          {%- comment -%} Heading {%- endcomment -%}
          <div class="elementor-element elementor-element-5caef557 elementor-widget elementor-widget-heading" 
               data-id="5caef557" 
               data-element_type="widget" 
               data-widget_type="heading.default">
            <div class="elementor-widget-container">
              <h3 id="contact-popup-heading-{{ section.id }}" 
                  class="elementor-heading-title elementor-size-default">
                {{ settings.contact_popup_heading | default: 'Contact us' }}
              </h3>
            </div>
          </div>
          
          {%- comment -%} Text Content {%- endcomment -%}
          <div class="elementor-element elementor-element-3dbc3b91 elementor-widget elementor-widget-text-editor" 
               data-id="3dbc3b91" 
               data-element_type="widget" 
               data-widget_type="text-editor.default">
            <div class="elementor-widget-container">
              {{ settings.contact_popup_text }}
              {%- if settings.contact_popup_display_email != blank -%}
                <p>Email us directly at <strong><em>{{ settings.contact_popup_display_email }}</em></strong> for urgent questions</p>
              {%- endif -%}
            </div>
          </div>
          
          {%- comment -%} Contact Form - Using Shopify Native Form {%- endcomment -%}
          <div class="elementor-element elementor-element-ea8e73c elementor-button-align-stretch elementor-widget elementor-widget-form" 
               data-id="ea8e73c" 
               data-element_type="widget" 
               data-widget_type="form.default">
            <div class="elementor-widget-container">
              {%- form 'contact', id: 'contact-popup-form-' | append: section.id, class: 'elementor-form', name: 'New Form', 'aria-label': 'New Form' -%}
                
                {%- comment -%} Shopify automatically handles form validation and messages {%- endcomment -%}
                {%- if form.posted_successfully? -%}
                  <div class="elementor-message elementor-message-success" role="alert">
                    {{ settings.contact_popup_success_message | default: 'Thank you! We will be in touch shortly.' }}
                  </div>
                {%- endif -%}
                
                {%- if form.errors -%}
                  <div class="elementor-message elementor-message-danger" role="alert">
                    <ul>
                      {%- for field in form.errors -%}
                        <li>{{ field }}: {{ form.errors[field] }}</li>
                      {%- endfor -%}
                    </ul>
                  </div>
                {%- endif -%}
                
                <div class="elementor-form-fields-wrapper elementor-labels-above">
                  
                  {%- comment -%} Form Field 1: Name (Text Input) {%- endcomment -%}
                  <div class="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-name elementor-col-100">
                    <label for="form-field-name-{{ section.id }}" class="elementor-field-label">
                      Name
                    </label>
                    <input size="1" 
                           type="text" 
                           name="contact[name]" 
                           id="form-field-name-{{ section.id }}" 
                           class="elementor-field elementor-size-sm elementor-field-textual" 
                           placeholder="Name"
                           required>
                  </div>
                  
                  {%- comment -%} Form Field 2: Email (Email Input, Required) {%- endcomment -%}
                  <div class="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-100 elementor-field-required">
                    <label for="form-field-email-{{ section.id }}" class="elementor-field-label">
                      Email
                    </label>
                    <input size="1" 
                           type="email" 
                           name="contact[email]" 
                           id="form-field-email-{{ section.id }}" 
                           class="elementor-field elementor-size-sm elementor-field-textual" 
                           placeholder="Email" 
                           required="required">
                  </div>
                  
                  {%- comment -%} Form Field 3: Message (Textarea) {%- endcomment -%}
                  <div class="elementor-field-type-textarea elementor-field-group elementor-column elementor-field-group-message elementor-col-100">
                    <label for="form-field-message-{{ section.id }}" class="elementor-field-label">
                      Message
                    </label>
                    <textarea class="elementor-field-textual elementor-field elementor-size-sm" 
                              name="contact[body]" 
                              id="form-field-message-{{ section.id }}" 
                              rows="4" 
                              placeholder="Message"
                              required></textarea>
                  </div>
                  
                  {%- comment -%} Submit Button {%- endcomment -%}
                  <div class="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 e-form__buttons">
                    <button class="elementor-button elementor-size-md" type="submit">
                      <span class="elementor-button-content-wrapper">
                        <span class="elementor-button-text">{{ settings.contact_popup_button_text | default: 'Send' }}</span>
                      </span>
                    </button>
                  </div>
                  
                </div>
              {%- endform -%}
            </div>
          </div>
          
        </div>
      </div>
    </div>
    
    <div class="dialog-buttons-wrapper dialog-lightbox-buttons-wrapper"></div>
  </div>
</div>
{%- endif -%}
```

**Required Form Fields (from source site):**
1. **Name** - Text input (`name="contact[name]"`)
2. **Email** - Email input, required (`name="contact[email]"`, `required`)
3. **Message** - Textarea (`name="contact[body]"`)

**Note:** Shopify's native `{% form 'contact' %}` automatically:
- Sends email to store owner (configured in Shopify admin)
- Handles validation (required fields, email format)
- Shows success/error messages
- No custom email routing needed (uses default Shopify behavior)

<style>
  .contact-popup-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .contact-popup-modal[aria-hidden="false"] {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
  }
  
  .contact-popup-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
  
  .contact-popup-content {
    position: relative;
    background-color: #fff;
    border-radius: 8px;
    max-width: 640px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 10000;
  }
  
  .contact-popup-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  }
  
  .contact-popup-close svg {
    width: 24px;
    height: 24px;
    stroke: #1f2124;
  }
  
  .contact-popup-logo {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .contact-popup-logo img {
    max-width: 28%;
    height: auto;
  }
  
  .contact-popup-heading {
    text-align: center;
    font-family: "OAXACA", Sans-serif;
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .contact-popup-text {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .contact-popup-form-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .contact-popup-field {
    display: flex;
    flex-direction: column;
  }
  
  .contact-popup-field label {
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .contact-popup-field input,
  .contact-popup-field textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    width: 100%;
  }
  
  .contact-popup-field textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .contact-popup-submit {
    padding: 12px 24px;
    background-color: #5C402F;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    transition: background-color 0.3s ease;
  }
  
  .contact-popup-submit:hover {
    background-color: #E2AB43;
  }
  
  .contact-popup-success,
  .contact-popup-errors {
    padding: 12px;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  
  .contact-popup-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .contact-popup-errors {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .contact-popup-errors ul {
    margin: 0;
    padding-left: 20px;
  }
  
  @media (max-width: 768px) {
    .contact-popup-content {
      width: 95%;
      padding: 30px 20px;
    }
    
    .contact-popup-logo img {
      max-width: 40%;
    }
  }
</style>

<script>
(function() {
  'use strict';
  
  function initContactPopup() {
    var popupId = 'contact-popup-modal-{{ section.id }}';
    var popup = document.getElementById(popupId);
    if (!popup) return;
    
    // Open popup function
    function openPopup() {
      popup.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    
    // Close popup function
    function closePopup() {
      popup.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    
    // Close button handlers
    var closeButtons = popup.querySelectorAll('[data-close-popup]');
    closeButtons.forEach(function(button) {
      button.addEventListener('click', closePopup);
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && popup.getAttribute('aria-hidden') === 'false') {
        closePopup();
      }
    });
    
    // Expose open function globally for trigger links
    // Only works if popup is enabled in theme settings
    window.openContactPopup = function() {
      {%- if settings.contact_popup_enabled -%}
        openPopup();
      {%- else -%}
        console.warn('Contact popup is disabled in theme settings');
      {%- endif -%}
    };
    
    // Auto-open on page load if setting is enabled
    {%- if section.settings.auto_open -%}
      setTimeout(function() {
        openPopup();
      }, {{ section.settings.auto_open_delay | default: 3000 }});
    {%- endif -%}
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactPopup);
  } else {
    initContactPopup();
  }
})();
</script>

{% schema %}
{
  "name": "Contact Popup",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "header",
      "content": "Content Settings"
    },
    {
      "type": "image_picker",
      "id": "logo",
      "label": "Logo Image",
      "info": "Recommended: 400px width, transparent background"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Contact us"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Text Content",
      "default": "<p>Fill out the form below, and we will be in touch shortly or,</p>"
    },
    {
      "type": "text",
      "id": "email",
      "label": "Email Address",
      "default": "pachamanacacao@gmail.com",
      "info": "Displayed in the popup text"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Submit Button Text",
      "default": "Send"
    },
    {
      "type": "text",
      "id": "success_message",
      "label": "Success Message",
      "default": "Thank you! We will be in touch shortly."
    },
    {
      "type": "header",
      "content": "Display Settings"
    },
    {
      "type": "checkbox",
      "id": "auto_open",
      "label": "Auto-open on Page Load",
      "default": false,
      "info": "Automatically open popup when page loads"
    },
    {
      "type": "range",
      "id": "auto_open_delay",
      "label": "Auto-open Delay (seconds)",
      "min": 1,
      "max": 10,
      "step": 1,
      "default": 3,
      "info": "Only applies if Auto-open is enabled"
    }
  ],
  "presets": [
    {
      "name": "Contact Popup"
    }
  ]
}
{% endschema %}
```

#### **Step 3: Add Section to `layout/theme.liquid`**

Add the section to `layout/theme.liquid` (before closing `</body>` tag):

```liquid
{%- comment -%} Contact Popup - Only renders if enabled in theme settings {%- endcomment -%}
{%- if settings.contact_popup_enabled -%}
  {%- section 'section-contact-popup' -%}
{%- endif -%}
```

**Note:** The section will only render if `contact_popup_enabled` is true in theme settings.

#### **Step 4: Update Footer Link**

In `sections/section-footer.liquid`, update the email link to trigger the popup (only if enabled):

```liquid
{%- if settings.contact_popup_enabled -%}
  <a class="elementor-icon elementor-social-icon elementor-social-icon-envelope elementor-animation-pulse-grow elementor-repeater-item-046ddfb" 
     href="#" 
     onclick="window.openContactPopup(); return false;" 
     target="_blank">
    <span class="elementor-screen-only">Email</span>
    <!-- SVG icon -->
  </a>
{%- else -%}
  <a class="elementor-icon elementor-social-icon elementor-social-icon-envelope elementor-animation-pulse-grow elementor-repeater-item-046ddfb" 
     href="mailto:{{ settings.contact_popup_display_email | default: shop.email }}" 
     target="_blank">
    <span class="elementor-screen-only">Email</span>
    <!-- SVG icon -->
  </a>
{%- endif -%}
```

**Note:** If popup is disabled, the link will use a standard `mailto:` link instead.

## Recommended Implementation: Theme Settings + Section Approach

### **Why This Approach:**
✅ **Centralized Control:** Enable/disable from theme settings (no code changes needed)  
✅ **Native Form:** Uses Shopify's built-in contact form (no external dependencies)  
✅ **Automatic Validation:** Shopify handles all form validation  
✅ **Automatic Messages:** Shopify shows success/error messages automatically  
✅ **Email Routing:** Sends to store owner (default) or can be extended for custom email  
✅ **Visual Consistency:** Matches Elementor popup design exactly  
✅ **Theme Editor Friendly:** All settings accessible through Shopify admin

### **Benefits:**
✅ Full control over design and functionality  
✅ Uses Shopify's native contact form (no external dependencies)  
✅ Customizable through theme editor  
✅ No monthly fees  
✅ Matches WordPress design closely  
✅ Accessible (ARIA attributes, keyboard navigation)  
✅ Mobile responsive  

### **Complete Implementation Steps:**

1. **Add theme settings** to `config/settings_schema.json` (enable/disable, email, content)
2. **Create the section file** (`sections/section-contact-popup.liquid`)
3. **Add section to theme.liquid** (with conditional check for enabled setting)
4. **Update footer link** to trigger popup (with conditional check)
5. **Configure settings** in Shopify admin (Theme Settings → Contact Popup)
6. **Test form submission** (uses Shopify's contact form endpoint)
7. **Verify email delivery** (check store owner email inbox)

### **Form Submission & Email Handling:**

The form uses Shopify's native `{% form 'contact' %}` which:
- ✅ Submits to Shopify's contact form endpoint (`/contact`)
- ✅ **Email Routing:** Always sends to store owner email (configured in Shopify Admin → Settings → Notifications)
- ✅ Handles validation automatically (required fields, email format)
- ✅ Shows success/error messages automatically
- ✅ No additional JavaScript needed for form handling

### **Trigger Options:**

1. **Footer link** (current WordPress approach)
2. **Button in any section**
3. **Auto-open on page load** (with delay)
4. **Exit intent** (when user tries to leave)
5. **Scroll trigger** (after scrolling X%)

### **Additional Features to Consider:**

1. **Exit Intent Detection:**
   ```javascript
   document.addEventListener('mouseleave', function(e) {
     if (e.clientY < 0) {
       openPopup();
     }
   });
   ```

2. **Cookie-based Display Control:**
   - Don't show popup if user already submitted
   - Show once per session
   - Respect user preferences

3. **Analytics Integration:**
   - Track popup opens
   - Track form submissions
   - Conversion tracking

4. **A/B Testing:**
   - Different headlines
   - Different form fields
   - Different designs

## CSS Styling Notes

**Use Existing CSS Files:**
- ✅ `assets/popup.min.css` - Base popup styles (already loaded in theme.liquid)
- ✅ `assets/post-1197.css` - Elementor popup-specific styles (already loaded in theme.liquid)

**Key CSS Classes from `post-1197.css`:**
- `.elementor-1197` - Main popup container
- `.elementor-element-429e1a33` - Content container (flex, centered, min-height: 759px)
- `.elementor-element-b3689c1 img` - Logo (max-width: 28%)
- `.elementor-element-5caef557` - Heading (centered, OAXACA font, 61px, letter-spacing: 1.6px)
- `.elementor-element-3dbc3b91` - Text content (centered)
- `.elementor-element-ea8e73c` - Form container
- `.elementor-field-group` - Form field wrapper
- `.elementor-field` - Form input/textarea
- `.elementor-button` - Submit button (Barlow font, 18px, uppercase, border-radius: 35px)
- `#elementor-popup-modal-1197` - Popup modal container (background: #5C402FBA, centered)
- `#elementor-popup-modal-1197 .dialog-widget-content` - Popup content (background-image: gold-fabric.png, border-radius: 35px, box-shadow)
- `#elementor-popup-modal-1197 .dialog-message` - Message container (width: 635px, height: 764px)

**Responsive Breakpoints:**
- Desktop: Full width, 635px × 764px
- Tablet (max-width: 1024px): Responsive font sizes
- Mobile (max-width: 879px): 86vw × 79vh, border-radius: 20px

**No Custom CSS Needed:** All styles are already in `post-1197.css` - just use the Elementor classes!

## Testing Checklist

### **Theme Settings:**
- [ ] Popup can be enabled/disabled from theme settings
- [ ] Settings persist after saving
- [ ] Popup doesn't render when disabled
- [ ] Footer link changes behavior based on enable/disable setting

### **Popup Functionality:**
- [ ] Popup opens when trigger link is clicked (only if enabled)
- [ ] Popup closes when close button is clicked
- [ ] Popup closes when overlay is clicked
- [ ] Popup closes on ESC key press
- [ ] Body scroll is disabled when popup is open

### **Form Functionality:**
- [ ] Form validation works (required fields)
- [ ] Email format validation works
- [ ] Form submission works
- [ ] Success message displays after submission
- [ ] Error messages display for invalid input
- [ ] Email is sent to store owner (or custom email if configured)

### **Visual & Accessibility:**
- [ ] Visual layout matches Elementor design
- [ ] Logo displays correctly (28% max-width on desktop)
- [ ] Mobile responsive design
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] ARIA attributes work correctly

### **Email Configuration:**
- [ ] Form sends to store owner email (default Shopify behavior)
- [ ] Display email shows correctly in popup text
- [ ] Email notifications received in store owner inbox

## Theme Settings Configuration

### **How to Enable/Disable Popup:**

1. Go to **Shopify Admin** → **Online Store** → **Themes**
2. Click **Customize** on your active theme
3. Click **Theme Settings** (bottom left)
4. Find **Contact Popup** section
5. Toggle **"Enable Contact Popup"** checkbox
6. Configure other settings (logo, heading, text, email, etc.)
7. Click **Save**

### **Email Configuration:**

- **Display Email:** Email address shown in popup text (for urgent questions) - `contact_popup_display_email`
- **Form Submission Email:** Always sends to store owner email (configured in Shopify Admin → Settings → Notifications)
- **Note:** Shopify's native contact form uses the default store owner email. No custom email routing needed.

### **Settings Overview:**

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Enable Contact Popup | Checkbox | false | Master toggle to show/hide popup |
| Popup Logo Image | Image | (none) | Logo displayed in popup (max-width: 28%) |
| Popup Heading | Text | "Contact us" | Main heading text (OAXACA font, 61px) |
| Popup Text Content | Rich Text | Default text | Content above form (centered) |
| Display Email Address | Text | "pachamanacacao@gmail.com" | Email shown in popup text |
| Submit Button Text | Text | "Send" | Button label |
| Success Message | Text | Default message | Message after successful submission |

**Note:** Form emails are sent to store owner (configured in Shopify Admin → Settings → Notifications).

## Migration Notes

**From WordPress to Shopify:**
- Elementor popup ID `1197` → Shopify section ID (dynamic)
- Elementor form → Shopify `{% form 'contact' %}` (native)
- WordPress email handling → Shopify contact form endpoint
- Elementor animations → CSS transitions (fadeIn)
- Elementor settings → Shopify theme settings (centralized)
- Elementor popup settings → Theme settings (enable/disable toggle)

**Key Differences:**
- ✅ Shopify uses Liquid instead of PHP
- ✅ Shopify contact form is built-in (no plugin needed)
- ✅ Section-based architecture instead of Elementor widgets
- ✅ Theme settings instead of Elementor editor
- ✅ Centralized control via theme settings
- ✅ Native form validation and error handling

## Implementation Summary

### **Key Points:**
1. ✅ **Use Elementor CSS Classes:** All styling comes from `post-1197.css` - no custom CSS needed
2. ✅ **Use Shopify Native Form:** `{% form 'contact' %}` handles everything automatically
3. ✅ **Form Fields:** Name, Email (required), Message (required)
4. ✅ **Email Routing:** Sends to store owner (default Shopify behavior)
5. ✅ **Visual Match:** Uses exact same Elementor classes as source site
6. ✅ **Enable/Disable:** Controlled via theme settings checkbox

### **Files to Modify:**
1. `config/settings_schema.json` - Add Contact Popup settings group (without email setting)
2. `sections/section-contact-popup.liquid` - Create new section with Elementor classes
3. `layout/theme.liquid` - Add section with conditional check
4. `sections/section-footer.liquid` - Update email link to trigger popup

### **CSS Files Already Available:**
- ✅ `assets/popup.min.css` - Base popup styles
- ✅ `assets/post-1197.css` - Elementor popup-specific styles

**No additional CSS files needed - just use the existing Elementor classes!**

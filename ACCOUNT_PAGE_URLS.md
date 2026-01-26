# My Account Page URLs - Access Guide

## Shopify Customer Account Routes

Shopify automatically provides these URL routes for customer account pages. The templates we created will be used when customers visit these URLs.

---

## **Main Account Pages**

### **1. Account Dashboard**
**URL:** `/account`  
**Template:** `templates/customers/account.liquid`  
**Access:** 
- ✅ Logged in customers: Full access
- ❌ Not logged in: Redirects to `/account/login`

**What it shows:**
- Welcome message with customer name
- Account information (email, orders count, total spent)
- Quick links to orders and addresses
- Recent orders list
- Logout button

---

### **2. Login/Register Page**
**URL:** `/account/login`  
**Template:** `templates/customers/login.liquid`  
**Access:** 
- ✅ Everyone: Can access (logged in or not)
- If already logged in: May redirect to `/account`

**What it shows:**
- Login form (left column)
- Registration form (right column)
- Password recovery form (toggle via #recover anchor)

**Alternative URLs:**
- `/account/login#recover` - Shows password recovery form instead of login form

---

### **3. Orders List**
**URL:** `/account/orders`  
**Template:** `templates/customers/orders.liquid`  
**Access:** 
- ✅ Logged in customers: Full access
- ❌ Not logged in: Redirects to `/account/login`

**What it shows:**
- List of all customer orders
- Order number, date, status, total
- Link to individual order details

---

### **4. Order Details**
**URL:** `/account/orders/[ORDER_ID]`  
**Example:** `/account/orders/1234567890`  
**Template:** `templates/customers/order.liquid`  
**Access:** 
- ✅ Logged in customers: Can only view their own orders
- ❌ Not logged in: Redirects to `/account/login`
- ❌ Wrong order ID: Shows error or redirects

**What it shows:**
- Complete order information
- Order items with images
- Shipping and billing addresses
- Order summary (subtotal, discounts, shipping, tax, total)

**How to get order URL:**
- From orders list page (click on order number)
- From account dashboard (click on recent order)
- Order object provides: `{{ order.customer_url }}`

---

### **5. Address Management**
**URL:** `/account/addresses`  
**Template:** `templates/customers/addresses.liquid`  
**Access:** 
- ✅ Logged in customers: Full access
- ❌ Not logged in: Redirects to `/account/login`

**What it shows:**
- Form to add new address
- List of all saved addresses
- Edit/delete functionality for each address
- Set default address option

---

### **6. Logout**
**URL:** `/account/logout`  
**Access:** 
- ✅ Logged in customers: Logs out and redirects
- ❌ Not logged in: Redirects to home or login

**Behavior:**
- Logs out the customer
- Clears session
- Redirects to home page or login page

---

## **Liquid Route Helpers**

In your templates, you can use these Liquid route helpers:

```liquid
{{ routes.account_url }}              → /account
{{ routes.account_login_url }}        → /account/login
{{ routes.account_register_url }}     → /account/register
{{ routes.account_orders_url }}       → /account/orders
{{ routes.account_addresses_url }}    → /account/addresses
{{ routes.account_logout_url }}       → /account/logout
```

**Example usage:**
```liquid
<a href="{{ routes.account_url }}">My Account</a>
<a href="{{ routes.account_login_url }}">Login</a>
<a href="{{ routes.account_orders_url }}">View Orders</a>
```

---

## **How to Access from Your Store**

### **Option 1: Direct URL**
Simply type in your browser:
```
https://your-store.myshopify.com/account
https://your-store.myshopify.com/account/login
https://your-store.myshopify.com/account/orders
```

### **Option 2: Through Header Link**
We added an account link in the header (`sections/section-header.liquid`):
- **When logged in:** Shows "My Account (Name)" → Links to `/account`
- **When not logged in:** Shows "Login" → Links to `/account/login`

### **Option 3: From Navigation Menu**
You can add account links to your navigation menu in Shopify Admin:
1. Go to **Online Store → Navigation**
2. Add menu items:
   - "My Account" → `/account`
   - "Login" → `/account/login`
   - "Orders" → `/account/orders`

### **Option 4: From Footer**
Add account links to your footer section for easy access.

---

## **Testing the Pages**

### **Test as Guest (Not Logged In):**
1. Visit: `https://your-store.myshopify.com/account/login`
   - Should show login and registration forms
2. Try to visit: `https://your-store.myshopify.com/account`
   - Should redirect to `/account/login`

### **Test as Logged In Customer:**
1. Log in through `/account/login`
2. Visit: `https://your-store.myshopify.com/account`
   - Should show account dashboard
3. Visit: `https://your-store.myshopify.com/account/orders`
   - Should show orders list
4. Visit: `https://your-store.myshopify.com/account/addresses`
   - Should show address management

---

## **Custom Domain URLs**

If you have a custom domain (e.g., `pachamana.com`), the URLs will be:

```
https://pachamana.com/account
https://pachamana.com/account/login
https://pachamana.com/account/orders
https://pachamana.com/account/addresses
```

---

## **Redirect Behavior**

### **After Login:**
- Default: Redirects to `/account`
- Custom: Use `return_to` parameter
  ```
  /account/login?return_to=/account/orders
  ```

### **After Registration:**
- Default: Redirects to `/account`
- Custom: Use `return_to` parameter in registration form

### **After Logout:**
- Default: Redirects to home page (`/`)
- Can be customized in Shopify settings

---

## **Order URLs**

### **Getting Order URL in Liquid:**
```liquid
{% for order in customer.orders %}
  <a href="{{ order.customer_url }}">View Order #{{ order.order_number }}</a>
{% endfor %}
```

### **Order URL Format:**
```
/account/orders/[ORDER_ID]
```

**Example:**
- Order ID: `1234567890`
- URL: `/account/orders/1234567890`

---

## **Password Recovery URL**

**URL:** `/account/login#recover`  
**Behavior:**
- Shows password recovery form
- Hides login form
- JavaScript toggles between forms

**How to link:**
```liquid
<a href="{{ routes.account_login_url }}#recover">Lost your password?</a>
```

---

## **Quick Reference Table**

| Page | URL | Template | Requires Login |
|------|-----|----------|----------------|
| Account Dashboard | `/account` | `account.liquid` | ✅ Yes |
| Login/Register | `/account/login` | `login.liquid` | ❌ No |
| Orders List | `/account/orders` | `orders.liquid` | ✅ Yes |
| Order Details | `/account/orders/[ID]` | `order.liquid` | ✅ Yes |
| Addresses | `/account/addresses` | `addresses.liquid` | ✅ Yes |
| Logout | `/account/logout` | (automatic) | ✅ Yes |

---

## **Troubleshooting**

### **Page Not Found (404):**
- ✅ Make sure templates are in `templates/customers/` folder
- ✅ Check template file names match exactly:
  - `login.liquid` (not `login-page.liquid`)
  - `account.liquid` (not `account-page.liquid`)
  - `orders.liquid` (not `order-list.liquid`)
  - `order.liquid` (not `order-details.liquid`)
  - `addresses.liquid` (not `address.liquid`)

### **Redirect Loop:**
- Check if customer is logged in: `{% if customer %}`
- Verify redirect URLs are correct
- Check Shopify account settings

### **Template Not Loading:**
- Clear browser cache
- Check Shopify theme editor
- Verify template syntax (no Liquid errors)

---

## **Best Practices**

1. **Always use route helpers** instead of hardcoded URLs:
   ```liquid
   ✅ Good: {{ routes.account_url }}
   ❌ Bad: /account
   ```

2. **Check login status** before showing account links:
   ```liquid
   {% if customer %}
     <a href="{{ routes.account_url }}">My Account</a>
   {% else %}
     <a href="{{ routes.account_login_url }}">Login</a>
   {% endif %}
   ```

3. **Provide clear navigation** between account pages:
   - Add "Back to Account" links
   - Add breadcrumbs if needed
   - Keep navigation consistent

4. **Handle redirects properly:**
   - After login: Redirect to intended page
   - After logout: Redirect to home or login
   - After registration: Redirect to account dashboard

---

## **Summary**

**To access My Account page:**
1. **Direct URL:** `https://your-store.myshopify.com/account`
2. **Header link:** Click "My Account" or "Login" in header
3. **Navigation menu:** Add to main menu in Shopify Admin
4. **From other pages:** Use `{{ routes.account_url }}` in links

**All account pages are automatically available** once the templates are uploaded to Shopify. No additional configuration needed!

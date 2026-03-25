(function () {
  const getYukoCartEarnImageContent = () => {
    const src =
      window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.config?.message_icon
        ?.url;
    if (!src) {
      return null;
    }
    let imageElement = document.createElement("img");
    imageElement.className = "yuko_cart_earn_message_icon";
    imageElement.src = src;
    imageElement.width = 20;
    imageElement.height = 20;
    imageElement.alt = "Cart earn message";
    return imageElement;
  };

  const getYukoCartEarnContent = (earning) => {
    const container = document.createDocumentFragment();
    const imageElement = getYukoCartEarnImageContent();
    if (imageElement) {
      container.appendChild(imageElement);
    }

    const earningTypeLabel = window.YukoUtil.getYukoLabel(
      earning.earning_type,
      earning.earning_value
    );
    const messageText = window.YukoLoyalty.getYukoCartEarnWidgetConfig()
      ?.config?.message?.replace(/\[points_value\]/g, earning.earning_value)
      .replace(/\[points_label\]/g, earningTypeLabel);

    const messageElement = document.createElement("span");
    messageElement.className = "yuko-loyalty-cart-earning-message";
    messageElement.textContent = messageText;
    container.appendChild(messageElement);
    return container;
  };

  const applyYukoCartEarnStyle = () => {
    const elements = document.querySelectorAll(".yuko-cart-earn-block");
    const style = window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.style || {
      border_color: "#ffffff",
      background_color: "#e3dada",
      text_color: "#000000",
      padding: 10,
      width: 100,
      height: null,
    };

    elements.forEach((el) => {
      const {
        border_color,
        background_color,
        text_color,
        padding,
        width,
        height,
      } = style;
      const paddingValue =
        padding !== undefined && padding !== null ? `${padding}px` : "10px";
      const widthValue =
        width !== undefined && width !== null ? `${width}%` : "100%";
      const heightValue =
        height !== undefined && height !== null ? `${height}px` : "auto";

      // Set CSS custom properties for dynamic values (can be overridden by custom CSS)
      el.style.setProperty("--yuko-border-color", border_color);
      el.style.setProperty("--yuko-background-color", background_color);
      el.style.setProperty("--yuko-text-color", text_color);
      el.style.setProperty("--yuko-padding", paddingValue);
      el.style.setProperty("--yuko-width", widthValue);
      el.style.setProperty("--yuko-height", heightValue);

      el.style.cssText += `
                display: flex !important;
                border: 1px solid var(--yuko-border-color) !important;
                background-color: var(--yuko-background-color) !important;
                color: var(--yuko-text-color) !important;
                align-items: center;
                border-radius: 8px;
                padding: var(--yuko-padding) !important;
                width: var(--yuko-width) !important;
                height: var(--yuko-height) !important;
                margin-bottom: 5px;
                flex-direction: row;
                gap: 12px;
              `;
    });

    // Apply custom CSS if provided (with higher specificity to override inline styles)
    if (
      style.custom_css &&
      typeof style.custom_css === "string" &&
      style.custom_css.trim()
    ) {
      const styleId = "yuko-cart-earn-block-custom-css";
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      // Inject custom CSS directly so nested selectors work properly
      // Custom CSS will override inline styles because it's in a stylesheet
      styleElement.textContent = style.custom_css;
    }
  };

  const updateYukoCartEarnBlockMessage = async (cartData) => {
    let customer = window?.Shopify?.yukoCustomer;

    // Enrich all cart items with collection IDs
    if (cartData?.items && cartData.items.length > 0) {
      // Use Promise.all to enrich all items in parallel
      await Promise.all(
        cartData.items.map(async (item) => {
          const enrichedProduct = await window.YukoUtil.enrichProductWithTags(
            item
          );
          item.tags = enrichedProduct?.tags || [];
        })
      );
    }

    let params = {
      calculate_based_on: "cart",
      cart: cartData,
      customer: customer,
      currency: window?.Shopify?.currency,
      store_currency_price:
        cartData?.items_subtotal_price / window?.Shopify?.currency?.rate / 100,
    };
    let earning = window?.yukoCalculation?.calculate(params);
    if (
      earning === null ||
      earning === undefined ||
      earning?.earning_value === 0
    ) {
      return;
    }
    let content = getYukoCartEarnContent(earning);
    const messageElements = document.querySelectorAll(".yuko-cart-earn-block");
    messageElements.forEach((el) => {
      el.innerHTML = "";
      el.appendChild(content.cloneNode(true));
    });
    applyYukoCartEarnStyle();
  };

  const hideYukoCartEarnMessage = () => {
    const elements = document.querySelectorAll(".yuko-cart-earn-block");
    elements.forEach((el) => {
      const parent = el?.parentElement;
      const shouldHide =
        parent &&
        (parent.classList.contains("shopify-block") ||
          parent.classList.contains("shopify-app-block") ||
          parent.getAttribute("data-block-handle") ===
            "reviews-yuko-embed-assets");
      if (shouldHide) {
        parent.style.display = "none";
      }
      el.style.display = "none";
    });
  };

  document.addEventListener("yuko:cart:fetch:success", function (response) {
    if (window?.Shopify?.yukoApp?.features?.loyalty === false) {
      return;
    }
    if (!window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.is_enabled) {
      return;
    }
    const cartData =
      response.detail && response.detail.cartData
        ? response.detail.cartData
        : null;
    if (cartData) {
      updateYukoCartEarnBlockMessage(cartData);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    if (window?.Shopify?.yukoApp?.features?.loyalty === false) {
      return;
    }
    if (!window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.is_enabled) {
      return;
    }

    // Check if loyalty is enabled before initializing
    window.YukoLoyalty.fetchYukoCartData().then(() => {
      window.YukoLoyalty.setupYukoCartObservers();
    });
  });

  // Listen for cart update events to reinitialize observer
  document.addEventListener(
    "cart:updated",
    window?.YukoLoyalty?.reinitializeYukoCartObserver
  );
  document.addEventListener(
    "cartUpdated",
    window?.YukoLoyalty?.reinitializeYukoCartObserver
  );
  document.addEventListener(
    "cart:build",
    window?.YukoLoyalty?.reinitializeYukoCartObserver
  );
  document.addEventListener(
    "cart:refresh",
    window?.YukoLoyalty?.reinitializeYukoCartObserver
  );
  document.addEventListener(
    "ajaxCart.afterCartLoad",
    window?.YukoLoyalty?.reinitializeYukoCartObserver
  );
  document.addEventListener(
    "cart:requestComplete",
    window?.YukoLoyalty?.reinitializeYukoCartObserver
  );
})();
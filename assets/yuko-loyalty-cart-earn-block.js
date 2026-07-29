(function () {
  const getYukoCartEarnImageContent = () => {
    const icon =
      window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.config?.message_icon;
    const U = window.YukoUtil;
    if (U && U.renderIconEl) {
      const el = U.renderIconEl(icon, {
        label: "Cart earn message",
        fontClass: "yuko_cart_earn_message_icon",
        imgClass: "yuko_cart_earn_message_icon",
      });
      if (el) {
        el.classList.add("yk-icon-20");
      }
      return el;
    }
    return null;
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
    const pointsToCashRate = parseFloat(window?.Shopify?.yukoApp?.loyalty?.settings?.general_settings?.points_to_cash_rate) || 0.01;
    const cashValue = (earning.earning_value * pointsToCashRate).toFixed(2);
    const cf = window.YukoThemeCurrencyUtils.getThemeCurrencyFormat('<span class="price-with-currency"> Rs. {{amount}} </span>');
    const formattedCashValue = window.YukoThemeCurrencyUtils.formatCurrency(cashValue, cf);
    const messageText = window.YukoLoyalty.getYukoCartEarnWidgetConfig()
      ?.config?.message?.replace(/\[points_value\]/g, earning.earning_value)
      .replace(/\[points_label\]/g, earningTypeLabel)
      .replace(/\[points_cash_value\]/g, formattedCashValue);

    const messageElement = document.createElement("span");
    messageElement.className = "yuko-loyalty-cart-earning-message";
    messageElement.innerHTML = messageText;
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

      el.style.setProperty("--yuko-border-color", border_color);
      el.style.setProperty("--yuko-background-color", background_color);
      el.style.setProperty("--yuko-text-color", text_color);
      el.style.setProperty("--yuko-padding", paddingValue);
      el.style.setProperty("--yuko-width", widthValue);
      el.style.setProperty("--yuko-height", heightValue);
      el.style.display = "flex";
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

  function isEditorMode() {
    try {
      return !!(window?.Shopify && window.Shopify.designMode);
    } catch (e) {
      return false;
    }
  }

  document.addEventListener("yuko:cart:fetch:success", function (response) {
    const editorMode = isEditorMode();
    if (!editorMode) {
      if (window?.Shopify?.yukoApp?.features?.loyalty === false) {
        return;
      }
      if (!window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.is_enabled) {
        return;
      }
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
    const editorMode = isEditorMode();
    if (!editorMode) {
      if (window?.Shopify?.yukoApp?.features?.loyalty === false) {
        return;
      }
      if (!window.YukoLoyalty.getYukoCartEarnWidgetConfig()?.is_enabled) {
        return;
      }
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

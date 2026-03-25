(function () {
  const getYukoWidgetConfig = () => {
    return window?.Shopify?.yukoApp?.loyalty?.widgets
      ?.yuko_loyalty_product_widget;
  };

  // image content
  const getYukoWidgetImageContent = () => {
    let src = getYukoWidgetConfig()?.config?.message_icon?.url;
    if (!src) {
      return null;
    }
    let image = document.createElement("img");
    image.className = "yuko-loyalty-product-message-icon";
    image.src = src;
    image.width = 20;
    image.height = 20;
    image.style.width = "20px";
    image.style.height = "20px";
    image.alt = "product message icon";
    return image;
  };

  // message content
  const getYukoWidgetMessageContent = (earningValue, earningType) => {
    const container = document.createDocumentFragment();

    // Add image if available
    const imageElement = getYukoWidgetImageContent();
    if (imageElement) {
      container.appendChild(imageElement);
    }

    // Create and add message
    const earningTypeLabel = window.YukoUtil.getYukoLabel(
      earningType,
      earningValue
    );
    const messageText = getYukoWidgetConfig()
      ?.config?.message?.replace(/\[points_value\]/g, earningValue)
      .replace(/\[points_label\]/g, earningTypeLabel);

    const messageElement = document.createElement("span");
    messageElement.className = "yuko-loyalty-product-message";
    messageElement.textContent = messageText;
    container.appendChild(messageElement);

    return container;
  };

  const applyYukoProductMessageStyles = (content) => {
    const styles = getYukoWidgetConfig()?.style || {
      border_color: "#000000",
      background_color: "#ffffff",
      text_color: "#000000",
      padding: 10,
      width: 100,
      height: null,
    };

    const productMessageElements = document.querySelectorAll(
      ".yuko-loyalty-product-content"
    );

    const paddingValue =
      styles.padding !== undefined && styles.padding !== null
        ? `${styles.padding}px`
        : "10px";
    const widthValue =
      styles.width !== undefined && styles.width !== null
        ? `${styles.width}%`
        : "100%";
    const heightValue =
      styles.height !== undefined && styles.height !== null
        ? `${styles.height}px`
        : "auto";

    productMessageElements.forEach(function (element) {
      const combinedStyles = `display: flex !important; border: 1px solid ${styles.border_color} !important; background-color: ${styles.background_color} !important; color: ${styles.text_color} !important; padding: ${paddingValue} !important; width: ${widthValue} !important; height: ${heightValue} !important; align-items: center; border-radius: 8px; flex-direction: row; gap: 12px;`;

      // Clear existing content and append new content
      element.innerHTML = "";
      element.appendChild(content.cloneNode(true));
      element.setAttribute("style", combinedStyles);
    });
  };

  const handleYukoProductMessage = async (product) => {
    // Enrich product with collection data from Shopify API
    //const enrichedProduct = await window.YukoUtil.enrichProductWithCollections(product);
    let customer = window?.Shopify?.yukoCustomer;

    // Prepare initial params to check if segments are needed
    let params = {
      product: product,
      calculate_based_on: "product",
      customer: customer,
      currency: window?.Shopify?.currency,
      store_currency_price:
        product?.price / window?.Shopify?.currency?.rate / 100,
    };

    // Only fetch customer segments if there are segment conditions
    /*if (window.YukoUtil.needsCustomerSegments(params)) {
            customer = await window.YukoUtil.enrichCustomerWithSegments(customer);
            params.customer = customer;
        }*/

    let earning = window?.yukoCalculation?.calculate(params);
    if (
      earning === null ||
      earning === undefined ||
      earning?.earning_value === 0
    ) {
      return;
    }

    let earningValue = earning?.earning_value;
    let earningType = earning?.earning_type;
    let message = getYukoWidgetMessageContent(earningValue, earningType);
    applyYukoProductMessageStyles(message);
  };

  const hideYukoProductMessage = () => {
    const elements = document.querySelectorAll(".yuko-loyalty-product-content");
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
  // Auto-initialize if earn is enabled
  document.addEventListener("DOMContentLoaded", function () {
    if (window?.Shopify?.yukoApp?.features?.loyalty === false) {
      return;
    }
    if (!getYukoWidgetConfig()?.is_enabled) {
      return;
    }
    if (window.PUB_SUB_EVENTS) {
      window.subscribe(PUB_SUB_EVENTS.variantChange, (e) => {
        handleYukoProductMessage(e.data.variant);
      });
    }
    handleYukoProductMessage(window?.Shopify?.yukoProduct);
  });
})();
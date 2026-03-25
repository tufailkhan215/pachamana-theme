document.addEventListener("DOMContentLoaded", function () {
    if (window?.Shopify?.yukoApp?.features?.loyalty === false) {
        return;
    }
    if (!window.YukoLoyalty.getYukoCartRedeemWidgetConfig()?.is_enabled) {
        return;
    }
    if (window?.YukoUtil?.isBannedCustomer()) {
        return;
      }
    const container_list = document.querySelectorAll('[data-yuko-cart-redeem-block]');
    if (!container_list?.length) {
        return;
    }

    console.log("calling 222")
    const blocks = Array.from(container_list).map((container) => {

        const messageEl = container.querySelector(
            "[data-yuko-cart-redeem-message]"
        );
        const iconEl = container.querySelector(
            "[data-yuko-cart-redeem-icon]"
        );
        const buttonEl = container.querySelector(
            "[data-yuko-cart-redeem-action]"
        );
        const block = {
            container,
            messageEl,
            iconEl,
            buttonEl,
            customerLoggedIn: Boolean(window?.Shopify?.yukoCustomer?.id),
            isUpdating: false,
            needsUpdate: false,
        };
        window.YukoLoyaltyCartRedeem.hideYukoCartRedeemBlock(block);
        return block;
    }).filter(Boolean);
    if (!blocks.length) {
        return;
    }

    blocks.forEach((block) => window.YukoLoyaltyCartRedeem.refreshYukoCartRedeemBlock(block));
    window.YukoLoyaltyCartRedeem.setupYukoCartRedeemListeners(blocks);
});
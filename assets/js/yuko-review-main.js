(function () {
    const yukoModules = {};

    function loadJsFile(widgetKey, widgetSrc, widgetData) {
        return import(widgetSrc)
            .then((module) => {
                yukoModules[widgetKey] = module;
                module.loadIframe(widgetData);
                return module;
            })
            .catch((error) => {
                console.error(`Error loading ${widgetKey}:`, error);
            });
    }

    // Widget-specific loaders returning Promises
    function loadFloatingProductWidget(widgetData) {
        const widgetSrc = widgetData?.yuko_widget_src?.sidebar;
        if (!widgetSrc) return Promise.resolve();

        return loadJsFile(
            CONSTANTS.YUKO_FLOATING_PRODUCT_WIDGET,
            widgetSrc,
            widgetData,
        ).then((module) => {
            yukoModules[CONSTANTS.YUKO_FLOATING_PRODUCT_WIDGET] = module;
        });
    }

    function loadReviewFormWidget(widgetData) {
        const widgetSrc = widgetData?.yuko_widget_src?.review_form;
        if (!widgetSrc) return Promise.resolve();

        return loadJsFile(
            CONSTANTS.YUKO_REVIEW_FORM_WIDGET,
            widgetSrc,
            widgetData,
        ).then((module) => {
            yukoModules[CONSTANTS.YUKO_REVIEW_FORM_WIDGET] = module;
        });
    }

    // Product widget JS is no longer needed - iframe and message handlers are in PHP template
    // Keeping this function stub for backward compatibility
    function loadProductWidget(widgetData) {
        return Promise.resolve();
    }

    function loadAllReviewsWidget(widgetData) {
        const widgetSrc = widgetData?.yuko_widget_src?.all_reviews_widget;
        if (!widgetSrc) return Promise.resolve();

        return loadJsFile(
            CONSTANTS.YUKO_ALL_REVIEWS_WIDGET,
            widgetSrc,
            widgetData,
        ).then((module) => {
            yukoModules[CONSTANTS.YUKO_ALL_REVIEWS_WIDGET] = module;
        });
    }

    function loadOrderReviewForm(widgetData) {
        const widgetSrc = widgetData?.yuko_widget_src?.order_review_form;
        if (!widgetSrc) return Promise.resolve();

        return loadJsFile(
            CONSTANTS.YUKO_ORDER_FORM_WIDGET,
            widgetSrc,
            widgetData,
        ).then((module) => {
            yukoModules[CONSTANTS.YUKO_ORDER_FORM_WIDGET] = module;
        });
    }

    function loadQnaFormWidget(widgetData) {
        const widgetSrc = widgetData?.yuko_widget_src?.qna_form;
        if (!widgetSrc) return Promise.resolve();

        return loadJsFile(
            CONSTANTS.YUKO_QNA_FORM_WIDGET,
            widgetSrc,
            widgetData,
        ).then((module) => {
            yukoModules[CONSTANTS.YUKO_QNA_FORM_WIDGET] = module;
        });
    }

    function loadCarousalWidget(widgetData) {
        const widgetSrc = widgetData?.yuko_widget_src?.carousal_widget;
        if (!widgetSrc) return Promise.resolve();

        return loadJsFile(
            CONSTANTS.YUKO_CAROUSAL_WIDGET,
            widgetSrc,
            widgetData,
        ).then((module) => {
            yukoModules[CONSTANTS.YUKO_CAROUSAL_WIDGET] = module;
        });
    }

    //load the constants
    const widgetData = window.yukoReviewsData ?? {};
    const yuko_constant_url = widgetData?.yuko_widget_src?.yuko_constants;
    const yuko_security_utils_url =
        widgetData?.yuko_widget_src?.yuko_security_utils;
    let CONSTANTS = null;
    let validatePostMessage = null;

    Promise.all([import(yuko_constant_url), import(yuko_security_utils_url)])
        .then(([constantsModule, securityUtilsModule]) => {
            CONSTANTS = constantsModule.CONSTANTS;
            validatePostMessage = securityUtilsModule.validatePostMessage;
            // Main logics
            const reviewFormStatus =
                widgetData?.review_form_widget?.widget_status ?? false;
            const QnaFormStatus = widgetData?.qna_form_widget?.widget_status ?? false;
            const floatingProductStatus =
                widgetData?.floating_product_widget?.widget_status ?? false;
            const productWidgetStatus =
                widgetData?.product_widget?.widget_status ?? false;
            const allReviewsWidgetStatus =
                widgetData?.all_reviews_widget?.widget_status ?? false;
            const isWantToShowOrderReviewForm =
                widgetData?.order_review_form_widget?.is_want_to_show ?? false;
            const carousalWidgetStatus =
                widgetData?.carousal_widget?.widget_status ?? false;

            if (floatingProductStatus) {
                loadFloatingProductWidget(widgetData);
            }

            // Product widget iframe is now created in PHP template
            // Only load JS if needed for message handling (lazy load on demand)
            // Removed automatic loading to avoid issues with defer/async scripts

            if (allReviewsWidgetStatus) {
                loadAllReviewsWidget(widgetData);
            }

            if (isWantToShowOrderReviewForm) {
                loadOrderReviewForm(widgetData);
            }

            if (carousalWidgetStatus) {
                const iframeContainers = document.querySelectorAll(
                    ".yuko-reviews-carousal-widget-iframe-container",
                );
                if (iframeContainers.length > 0) {
                    loadCarousalWidget(widgetData);
                }
            }

            window.addEventListener("message", (event) => {
                if (!validatePostMessage(event, widgetData)) return;

                switch (event.data.type) {
                    case CONSTANTS.OPEN_REVIEW_FORM_WIDGET:
                        if (reviewFormStatus) {
                            loadReviewFormWidget(widgetData);
                        }
                        break;
                    case CONSTANTS.OPEN_STORE_REVIEW_FORM_WIDGET:
                        // Enhanced security for store review form
                        if (reviewFormStatus) {
                            const updatedWidgetData = {
                                ...widgetData,
                                store_reviews: true,
                            };
                            loadReviewFormWidget(updatedWidgetData);
                        }
                        break;

                    case CONSTANTS.YUKO_PREFERENCE_SETTINGS:
                        // Handled inline in product-widget.php template
                        break;

                    case CONSTANTS.CLOSE_FLOATING_PRODUCT:
                        // closeFloatingProduct is now in sidebar widget module
                        if (yukoModules[CONSTANTS.YUKO_FLOATING_PRODUCT_WIDGET]) {
                            yukoModules[
                                CONSTANTS.YUKO_FLOATING_PRODUCT_WIDGET
                                ].closeFloatingProduct();
                        } else if (floatingProductStatus) {
                            loadFloatingProductWidget(widgetData).then(() => {
                                yukoModules[
                                    CONSTANTS.YUKO_FLOATING_PRODUCT_WIDGET
                                    ]?.closeFloatingProduct();
                            });
                        }
                        break;

                    case CONSTANTS.CLOSE_REVIEW_FORM:
                        yukoModules[CONSTANTS.YUKO_REVIEW_FORM_WIDGET]?.closeReviewForm();
                        break;

                    case CONSTANTS.QNA_REVIEW_FORM:
                        yukoModules[CONSTANTS.YUKO_QNA_FORM_WIDGET]?.closeQnaForm();
                        break;

                    case CONSTANTS.CLOSE_ORDER_REVIEW_FORM:
                        yukoModules[
                            CONSTANTS.YUKO_ORDER_FORM_WIDGET
                            ]?.closeOrderReviewForm();
                        break;

                    case CONSTANTS.REVIEW_FORM_IFRAME_RESIZE:
                        yukoModules[CONSTANTS.YUKO_ORDER_FORM_WIDGET]?.setIframeHeightWidth(
                            event.data.height,
                            event.data.width,
                        );
                        break;

                    case CONSTANTS.REVIEW_ANOTHER_ITEM:
                        yukoModules[
                            CONSTANTS.YUKO_ORDER_FORM_WIDGET
                            ]?.removeExistingContainerAndOpen(event.data.value);
                        break;

                    case CONSTANTS.OPEN_QNA_FORM_WIDGET:
                        if (QnaFormStatus) {
                            loadQnaFormWidget(widgetData);
                        }
                        break;
                }
            });

            const wrappers = document.querySelectorAll(
                ".r_rw_rating_widget_outer_container_wrapper",
            );

            wrappers.forEach((wrapper) => {
                wrapper.addEventListener("click", () => {
                    const productId = wrapper.getAttribute("data-id");
                    if (!productId) return;

                    const targetWidget = document.querySelector(
                        `.yuko-reviews-product-widget-iframe-container[data-target-id="${productId}"]`,
                    );

                    if (targetWidget) {
                        targetWidget.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }
                });
            });
        })
        .catch((error) => {
            console.error("Failed to load yuko constants:", error);
        });
})();

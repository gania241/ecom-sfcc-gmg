'use strict';

/**
 * @description The basket OCAPI hook (validateBasket) function used for modifing basket response during OCAPI Basket retrive / view
 * @param {Object} basketResponse - OCAPI Basket Response
 * @param {boolean} duringSubmit - Submit flag
 * @returns {dw.system.Status} The status OK object.
 */
exports.validateBasket = function validateBasket(basketResponse, duringSubmit) {
    const Logger = require('dw/system/Logger').getLogger('basketHook', 'get');
    const ProductMgr = require('dw/catalog/ProductMgr');
    const Status = require('dw/system/Status');
    const chain = require('*/cartridge/scripts/chain');
    try {
        var productItems = basketResponse.productItems;
        if (productItems.length) {
            productItems.toArray().forEach(function (productItem) {
                let product = ProductMgr.getProduct(productItem.productId);
                if (!empty(product)) {
                    productItem.c_discountPercentage = chain.safeGet(product, 'custom.discountPercentage', '');
                    productItem.c_maxOrderQuantity = chain.safeGet(product, 'custom.maxOrderQuantity', '');
                    productItem.c_brand = product.getBrand();
                }
            });
        }
    } catch (e) {
        Logger.error('Error during basket response edit via validateBasket OCAPI hook : {0}', e.message);
    }
    return new Status(Status.OK);
};

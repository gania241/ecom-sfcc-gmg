'use strict';

/**
 * @namespace CheckoutServices extended
 */

var server = require('server');
server.extend(module.superModule);

/**
 * CheckoutServices-PlaceOrder : The CheckoutServices-PlaceOrder append call after places the order
 * @name Base/CheckoutServices-PlaceOrder
 * @function
 * @memberof CheckoutServices
 * @param {Function}  middware event before view
 */
server.append('PlaceOrder', function (req, res, next) {
    this.on('route:BeforeComplete', function (req, res) {
        var viewData = res.getViewData();
        var orderID = viewData.orderID;
        var orderToken = viewData.orderToken;
        const OrderMgr = require('dw/order/OrderMgr');
        const HookMgr = require('dw/system/HookMgr');
        if (!empty(orderID) && !empty(orderToken)) {
            var order = OrderMgr.getOrder(orderID, orderToken);
            if (!empty(order)) {
                if (HookMgr.hasHook('dw.sfcc.storefront.afterOrderPlace')) {
                    HookMgr.callHook('dw.sfcc.storefront.afterOrderPlace', 'afterOrderPlace', order);
                }
            }
        }
    });
    next();
});

module.exports = server.exports();

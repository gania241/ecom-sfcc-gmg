'use strict';

/**
 * @description The order hook (afterOrderPlace) function used for sending SMS
 * @param {dw.order.Order} order - The SFCC API order
 * @returns {dw.system.Status} The status OK object.
 */
exports.afterOrderPlace = function afterOrderPlace(order) {
    const Logger = require('dw/system/Logger').getLogger('afterOrderPlace', 'afterOrderPlace');
    const Status = require('dw/system/Status');
    const chain = require('*/cartridge/scripts/chain');
    try {
        var customerPhone = chain.safeGet(order, 'billingAddress.phone', null);
        var orderNo = order.orderNo;
        if (!empty(customerPhone)) {
            let status = require('*/cartridge/scripts/services/smsService').send(customerPhone, orderNo);
            if (!status.ok) {
                Logger.error('Error response during afterOrderPlace SMS : {0}', status);
            }
        }
    } catch (e) {
        Logger.error('Error during afterOrderPlace SMS : {0}', e.message);
    }
    return new Status(Status.OK);
};


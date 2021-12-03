'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const StringUtils = require('dw/util/StringUtils');
const chain = require('*/cartridge/scripts/chain');
const smsUtil = require('*/cartridge/scripts/util/smsUtil');

/**
 * @description Internal function to execute SMS service call
 * @param {object} reqData - SMS service payload as URL encoded data
 * @returns {dw.svc.Result} The service response
 */
function _send(reqData) {
    return LocalServiceRegistry.createService(smsUtil.SMS_SERVICE_ID, {
        createRequest: function (svc, payload) {
            svc.addHeader('Authorization', chain.safeGet(svc, 'configuration.credential.custom.smsApiKey', ''));
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.setRequestMethod('POST');
            return payload;
        },
        parseResponse: function (svc, responseData) {
            return responseData;
        }
    }).call(reqData);
};

/**
 * @description Function to prepare the SMS payload and execute SMS service call
 * @param {dw.order.Order} order - The SFCC API order
 * @param {string} orderNo - Order number
 * @returns {dw.svc.Result} The service response
 */
exports.send = function send(customerPhone, orderNo) {
    var message = StringUtils.format(smsUtil.SMS_DEFAULT_MESSAGE, orderNo);
    var reqBody = 'message=' + encodeURIComponent(message) + '&language=english&route=q&numbers=' + encodeURIComponent(customerPhone);
    return _send(reqBody);
};

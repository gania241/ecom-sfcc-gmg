'use strict';

const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('app_assignment_ext/cartridge/scripts/hooks/ocapi/basket', function () {
    class Status {
        static OK = true;
        constructor(flag) {
            this.success = flag;
        }
    };
    var basket = proxyquire('../../../../../../../cartridges/app_assignment_ext/cartridge/scripts/hooks/ocapi/basket', {
        'dw/system/Logger': {
            getLogger: function (logName, fileName) {
                return {
                    error: function (msg, args) {
                    }
                }
            }
        },
        'dw/catalog/ProductMgr': {
            getProduct: function (pid) {
                return {
                    custom: {
                        discountPercentage: 50,
                        maxOrderQuantity: 30
                    },
                    getBrand: function () {
                        return 'PUMA'
                    }
                }
            }
        },
        'dw/system/Status': Status,
        '*/cartridge/scripts/chain': {
            safeGet: function (object, chain, defaultValue) {
                if (object === null || object !== Object(object)) {
                    return defaultValue;
                }
                if (!chain) {
                    return object;
                }
                var prop,
                    props = chain.split('.');
                for (var q = 0, len = props.length; q < len; q++) {
                    prop = props[q];
                    if (prop in object && typeof object[prop] !== 'undefined' && object[prop] !== null) {
                        object = object[prop];
                    } else {
                        return defaultValue;
                    }
                }
                return object;
            }
        }
    });
    it('Case1: It shoud add the product attributes to productItems response obj', function () {
        global.empty = function empty(input) {
            return (input === null);
        };
        var itemList = [{
            price: 120.00,
            tax: 34.90,
            productName: 'puma red',
            productId: '1002346'
        }];
        var items = {
            length: 1,
            toArray: function () {
                return itemList;
            }
        };
        var basketResponse = {
            productItems: items
        };
        let status = basket.validateBasket(basketResponse);
        assert.equal(itemList[0].c_discountPercentage, 50);
        assert.equal(itemList[0].c_maxOrderQuantity, 30);
        assert.equal(itemList[0].c_brand, 'PUMA');
        assert.equal(status.success, true);
    });

    it('Case2: It shoud not add the product attributes to productItems response obj if any exception occurs', function () {
        global.empty = function empty(input) {
            return (input === null);
        };
        var itemList = [{
            price: 120.00,
            tax: 34.90,
            productName: 'puma red',
            productId: '1002346'
        }];
        var items = {
            toArray: function () {
                return itemList;
            }
        };
        var basketResponse = {
            productItems: items
        };
        let status = basket.validateBasket(basketResponse);
        expect(itemList[0]).to.not.have.property('c_discountPercentage');
        expect(itemList[0]).to.not.have.property('c_maxOrderQuantity');
        expect(itemList[0]).to.not.have.property('c_brand');
    });
});

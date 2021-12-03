'use strict';

const chai = require('chai');
const assert = chai.assert;
const chain = require('../../../../../cartridges/app_assignment_ext/cartridge/scripts/chain');

describe('app_assignment_ext/cartridge/scripts/chain', function () {
    var data = {
        item: {
            price: {
                sales: {
                    value: 12.00
                }
            }
        }
    };
    it('Case1: It shoud return the chain obj prop value', function () {
        assert.equal(chain.safeGet(data, 'item.price.sales.value', 0), 12.00);
    });

    it('Case2: It shoud return default value if any prop is not available in object chain', function () {
        assert.equal(chain.safeGet(data, 'item.price.list.value', null), null);
    });
});

'use strict';

/**
 * @module chain
 * @description should be used in server side js files to retrieve chaining properties from a base object.
 */
module.exports = {
    /**
     * @description Safe extraction from tree chain object
     * @param {Object} object parent object for lookup
     * @param {String} chain lookup chain string
     * @param {Object} defaultValue default value if nothing found from chain
     * @returns {Object} last chain key value from parent object
     */
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
};

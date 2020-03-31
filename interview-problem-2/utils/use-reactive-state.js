"use strict";
// https://github.com/tedstoychev/use-reactive-state/blob/master/index.js

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var cache = Symbol('cache');
function useReactiveState(initialState) {
    var _a = react_1.useState(initialState), state = _a[0], setState = _a[1];
    var stateCopy = __assign({}, state);
    return new Proxy(stateCopy, {
        // Recursively proxify 'stateCopy'
        get: function (target, key) {
            if (
            // if the property is any kind of object (object, array, function)
            typeof target[key] === 'object'
                && target[key] !== null
                || typeof target[key] === 'function') {
                if (!target[cache]) {
                    target[cache] = {};
                }
                if (!target[cache][key]) {
                    target[cache][key] = new Proxy(target[key], this);
                }
                return target[cache][key];
            }
            else {
                return Reflect.get(target, key); // default behavior
            }
        },
        set: function (target, key, value) {
            var status = Reflect.set(target, key, value); // default behavior
            if (target[cache] && target[cache][key]) {
                delete target[cache][key];
            }
            setState(stateCopy); // call 'setState' with the updated 'stateCopy'
            return status;
        },
        defineProperty: function (target, key, descriptor) {
            var status = Reflect.defineProperty(target, key, descriptor); // default behavior
            if (target[cache] && target[cache][key]) {
                delete target[cache][key];
            }
            setState(stateCopy); // call 'setState' with the updated 'stateCopy'
            return status;
        },
        deleteProperty: function (target, key) {
            var status = Reflect.deleteProperty(target, key); // default behavior
            if (target[cache] && target[cache][key]) {
                delete target[cache][key];
            }
            setState(stateCopy); // call 'setState' with the updated 'stateCopy'
            return status;
        }
    });
}
exports.default = useReactiveState;

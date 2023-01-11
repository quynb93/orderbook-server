"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = void 0;
var generateRandomNumber = function (min, max) {
    return Math.random() * (max - min) + min;
};
exports.generateRandomNumber = generateRandomNumber;

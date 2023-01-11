"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBookService = void 0;
var numbers_1 = require("../../utils/numbers");
var bittrex_1 = require("../bittrex");
var OrderBookService = /** @class */ (function () {
    function OrderBookService() {
    }
    OrderBookService.prototype.getBidListByPrice = function (summaryEntry) {
        var _a;
        var currentDate = new Date();
        var timePeriod = currentDate.setSeconds(currentDate.getSeconds() - 30);
        if (!this.orderbooks ||
            (((_a = this.orderbooks) === null || _a === void 0 ? void 0 : _a.timestamp) && this.orderbooks.timestamp < timePeriod)) {
            this.orderbooks = {
                bid: this.generateOrderEntriesByPrice(Number(summaryEntry.high), OrderBookService.MAX_DEPTH_DEFAULT, OrderBookService.BID_CONSTRAINT, "bid"),
                ask: this.generateOrderEntriesByPrice(Number(summaryEntry.low), OrderBookService.MAX_DEPTH_DEFAULT, OrderBookService.ASK_CONSTRAINT, "ask"),
                timestamp: Date.now(),
            };
        }
        return this.orderbooks;
    };
    OrderBookService.prototype.publishOrderbookEvent = function (socket) {
        return __awaiter(this, void 0, void 0, function () {
            var ethBtcSummary, orderbooks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bittrex_1.BittrexService.getMarketSummaryBySymbol(bittrex_1.MarketSymbol.ETH_BTC)];
                    case 1:
                        ethBtcSummary = _a.sent();
                        orderbooks = this.getBidListByPrice(ethBtcSummary);
                        socket.emit(OrderBookService.ORDER_BOOKS_EVENTS, orderbooks);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrderBookService.prototype.generateOrderEntriesByPrice = function (price, limit, constraint, side) {
        var entries = [];
        for (var i = 1; i <= limit; i++) {
            var isFirstOrder = i === 1;
            var entry = this.generateUniqueOrderBookEntry(entries, price, constraint, side, isFirstOrder);
            entries.push(entry);
        }
        return entries;
    };
    OrderBookService.prototype.generateUniqueOrderBookEntry = function (entries, maxPrice, constraint, side, isFirst) {
        if (isFirst === void 0) { isFirst = false; }
        var size = this.generateUniqueSize(entries);
        var price = maxPrice;
        if (!isFirst) {
            var latestPrice = entries[entries.length - 1].price;
            var min = this.isBuySide(side) ? price / 10 : latestPrice;
            var max = this.isBuySide(side) ? latestPrice : constraint;
            price = this.generateUniquePrice(entries, min, max);
        }
        return {
            size: size,
            price: price,
        };
    };
    OrderBookService.prototype.isBuySide = function (side) {
        return side === "bid";
    };
    OrderBookService.prototype.generateUniquePrice = function (entries, min, max) {
        var price = (0, numbers_1.generateRandomNumber)(min, max);
        if (entries.find(function (entry) { return entry.price === price; })) {
            return this.generateUniquePrice(entries, min, max);
        }
        return price;
    };
    OrderBookService.prototype.generateUniqueSize = function (entries) {
        var size = Math.random();
        if (entries.find(function (entry) { return entry.size === size; })) {
            return this.generateUniqueSize(entries);
        }
        return size;
    };
    OrderBookService.MAX_DEPTH_DEFAULT = 15;
    OrderBookService.BID_CONSTRAINT = 5;
    OrderBookService.ASK_CONSTRAINT = 150;
    OrderBookService.ORDER_BOOKS_EVENTS = "orderbooks";
    return OrderBookService;
}());
var singleton = new OrderBookService();
exports.OrderBookService = singleton;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
var order_books_1 = require("./order-books");
function routes(app) {
    app.use("/api/orderbooks", order_books_1.getOrderBooksRouter);
}
exports.routes = routes;

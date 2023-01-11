import { Express } from "express";

import { getOrderBooksRouter } from "./order-books";

function routes(app: Express) {
  app.use("/api/orderbooks", getOrderBooksRouter);
}

export { routes };

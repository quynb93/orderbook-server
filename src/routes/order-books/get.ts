import express, { Request, Response } from "express";

import { BittrexService, MarketSymbol } from "../../services/bittrex";
import { OrderBookService } from "../../services/order-books";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const ethBtcSummary = await BittrexService.getMarketSummaryBySymbol(
    MarketSymbol.ETH_BTC
  );

  const orderbooks = OrderBookService.getBidListByPrice(ethBtcSummary);

  return res.status(201).json(orderbooks);
});

export { router as getOrderBooksRouter };

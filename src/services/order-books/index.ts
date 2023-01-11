import { Socket } from "socket.io";
import { OrderBook, OrderBookEntry } from "../../models/orderbook";
import { SummaryEntry } from "../../models/summary";
import { generateRandomNumber } from "../../utils/numbers";
import { BittrexService, MarketSymbol } from "../bittrex";

type Side = "bid" | "ask";

class OrderBookService {
  private static readonly MAX_DEPTH_DEFAULT = 15;
  private static readonly BID_CONSTRAINT = 5;
  private static readonly ASK_CONSTRAINT = 150;

  private static readonly ORDER_BOOKS_EVENTS = "orderbooks";

  orderbooks?: OrderBook;

  public getBidListByPrice(summaryEntry: SummaryEntry): OrderBook {
    const currentDate = new Date();
    const timePeriod = currentDate.setSeconds(currentDate.getSeconds() - 30);

    if (
      !this.orderbooks ||
      (this.orderbooks?.timestamp && this.orderbooks.timestamp < timePeriod)
    ) {
      this.orderbooks = {
        bid: this.generateOrderEntriesByPrice(
          Number(summaryEntry.high),
          OrderBookService.MAX_DEPTH_DEFAULT,
          OrderBookService.BID_CONSTRAINT,
          "bid"
        ),
        ask: this.generateOrderEntriesByPrice(
          Number(summaryEntry.low),
          OrderBookService.MAX_DEPTH_DEFAULT,
          OrderBookService.ASK_CONSTRAINT,
          "ask"
        ),
        timestamp: Date.now(),
      };
    }

    return this.orderbooks;
  }

  public async publishOrderbookEvent(socket: Socket) {
    const ethBtcSummary = await BittrexService.getMarketSummaryBySymbol(
      MarketSymbol.ETH_BTC
    );
    const orderbooks = this.getBidListByPrice(ethBtcSummary);
    socket.emit(OrderBookService.ORDER_BOOKS_EVENTS, orderbooks);
  }

  private generateOrderEntriesByPrice(
    price: number,
    limit: number,
    constraint: number,
    side: Side
  ): OrderBookEntry[] {
    const entries: OrderBookEntry[] = [];

    for (let i = 1; i <= limit; i++) {
      const isFirstOrder = i === 1;
      const entry = this.generateUniqueOrderBookEntry(
        entries,
        price,
        constraint,
        side,
        isFirstOrder
      );
      entries.push(entry);
    }

    return entries;
  }

  private generateUniqueOrderBookEntry(
    entries: OrderBookEntry[],
    maxPrice: number,
    constraint: number,
    side: Side,
    isFirst = false
  ): OrderBookEntry {
    const size = this.generateUniqueSize(entries);
    let price = maxPrice;

    if (!isFirst) {
      const latestPrice = entries[entries.length - 1].price;
      const min = this.isBuySide(side) ? price / 10 : latestPrice;
      const max = this.isBuySide(side) ? latestPrice : constraint;

      price = this.generateUniquePrice(entries, min, max);
    }

    return {
      size,
      price,
    };
  }

  private isBuySide(side: Side): boolean {
    return side === "bid";
  }

  private generateUniquePrice(
    entries: OrderBookEntry[],
    min: number,
    max: number
  ): number {
    const price = generateRandomNumber(min, max);

    if (entries.find((entry) => entry.price === price)) {
      return this.generateUniquePrice(entries, min, max);
    }

    return price;
  }

  private generateUniqueSize(entries: OrderBookEntry[]): number {
    const size = Math.random();

    if (entries.find((entry) => entry.size === size)) {
      return this.generateUniqueSize(entries);
    }

    return size;
  }
}

const singleton = new OrderBookService();
export { singleton as OrderBookService };

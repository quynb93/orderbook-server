export type OrderBookEntry = {
  size: number;
  price: number;
};

export type OrderBook = {
  bid: OrderBookEntry[];
  ask: OrderBookEntry[];
  timestamp?: number;
};

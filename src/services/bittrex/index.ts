import fetch from "node-fetch";

import { SummaryEntry } from "../../models/summary";

export enum MarketSymbol {
  ETH_BTC = "ETH-BTC",
}

class BittrexService {
  private static readonly BITTREX_API_URL = "https://api.bittrex.com/v3";

  public async getMarketSummaryBySymbol(
    marketSymbol: string
  ): Promise<SummaryEntry> {
    const url = this.getMarketSummaryUrl(marketSymbol);
    const res = await fetch(url);

    return await res.json();
  }

  private getMarketSummaryUrl(marketSymbol: string): string {
    return `${BittrexService.BITTREX_API_URL}/markets/${marketSymbol}/summary`;
  }
}

const singleton = new BittrexService();
export { singleton as BittrexService };

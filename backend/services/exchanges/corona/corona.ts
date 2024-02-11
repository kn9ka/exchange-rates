import { Exchange } from "../types";
import { GetExchangeRateResponse, Currency } from "./types";

const DEFAULT_SEARCH_PARAMS = {
  receivingCountryId: "GEO",
  paymentMethod: "debitCard",
  receivingAmount: "10000",
  receivingMethod: "cash",
  sendingCountryId: "RUS",
};

export class CoronaExchange extends Exchange {
  SITE_URL = "https://koronapay.com";
  API_URL = `${this.SITE_URL}/transfers/online/api/transfers/tariffs`;
  NAME = "Золотая корона";

  private parseRate(rate: number) {
    return Number(rate.toFixed(2));
  }

  async getExchangeRate(inCurrency: Currency, outCurrency: Currency) {
    const urlSearchParams = new URLSearchParams({
      sendingCurrencyId: inCurrency,
      receivingCurrencyId: outCurrency,
      ...DEFAULT_SEARCH_PARAMS,
    });

    const url = `${this.API_URL}?${urlSearchParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const [json] = (await response.json()) as GetExchangeRateResponse;
      return this.parseRate(json.exchangeRate);
    } catch (err) {
      // @TODO: log error
      console.error(err);
      return null;
    }
  }
}

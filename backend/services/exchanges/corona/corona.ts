import { Exchange } from "../types";
import { GetExchangeRateResponse } from "./types";
import { Currency } from "../types";

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
  private ALLOWED_CURRENCIES = [Currency.GEL, Currency.USD, Currency.EUR];
  private MAIN_CURRENCY = Currency.RUB;
  private CURRENCY_MAP = {
    [Currency.RUB]: "810",
    [Currency.USD]: "840",
    [Currency.GEL]: "981",
    [Currency.EUR]: "978",
  };

  private parseRate(rate: number) {
    return Number(rate.toFixed(2));
  }

  async getExchangeRate(inCurrency: Currency, outCurrency: Currency) {
    const urlSearchParams = new URLSearchParams({
      sendingCurrencyId: this.CURRENCY_MAP[inCurrency],
      receivingCurrencyId: this.CURRENCY_MAP[outCurrency],
      ...DEFAULT_SEARCH_PARAMS,
    });

    const url = `${this.API_URL}?${urlSearchParams.toString()}`;

    try {
      const response = await fetch(url);

      console.log(url, response.status);

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

  get allowedCurrencies() {
    return this.ALLOWED_CURRENCIES;
  }

  get mainCurrency() {
    return this.MAIN_CURRENCY;
  }

  get url() {
    return this.SITE_URL;
  }
}

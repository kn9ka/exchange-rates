export abstract class Exchange {
  abstract getExchangeRate(
    currencyIn: string,
    currencyOut: string
  ): Promise<number | null>;

  abstract get allowedCurrencies(): Currency[];
  abstract get mainCurrency(): Currency;
  abstract get url(): string;
}

export const ExchangeServiceName = {
  Corona: "corona",
  Contact: "contact",
  CBR: "cbr",
} as const;

export type ExchangeServiceName =
  (typeof ExchangeServiceName)[keyof typeof ExchangeServiceName];

export const Currency = {
  RUB: "RUB",
  USD: "USD",
  GEL: "GEL",
  EUR: "EUR",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

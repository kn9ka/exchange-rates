export abstract class Exchange {
  abstract getExchangeRate(
    currencyIn: string,
    currencyOut: string
  ): Promise<number | null>;

  abstract get allowedCurrencies(): string[];
  abstract get mainCurrency(): string;
  abstract get url(): string;
}

export const ExchangeServiceName = {
  Corona: "corona",
  Contact: "contact",
  CBR: "cbr",
} as const;

export type ExchangeServiceName =
  (typeof ExchangeServiceName)[keyof typeof ExchangeServiceName];

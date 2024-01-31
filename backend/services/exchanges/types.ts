export abstract class Exchange {
  abstract getExchangeRate(
    currencyIn: string,
    currencyOut: string
  ): Promise<number | null>;
}

export const ExchangeServiceName = {
  Corona: "Corona",
  Contact: "Contact",
  CBR: "CBR",
} as const;

export type ExchangeServiceName =
  (typeof ExchangeServiceName)[keyof typeof ExchangeServiceName];

export abstract class Exchange {
  abstract getExchangeRate(
    currencyIn: string,
    currencyOut: string
  ): Promise<number | null>;
}

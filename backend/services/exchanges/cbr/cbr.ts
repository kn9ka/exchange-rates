import { Exchange } from "../types";
import { XMLParser } from "fast-xml-parser";
import { Currency, ParsedXMLResponse } from "./types";

const parser = new XMLParser();

export class CBRExchange extends Exchange {
  API_URL = "http://www.cbr.ru/scripts/XML_daily.asp";

  private parseRate(rate: string) {
    return Number(parseFloat(rate.replace(",", ".")).toFixed(2));
  }

  private async parseXML(text: string) {
    const xml: ParsedXMLResponse = parser.parse(text);
    const rates = xml.ValCurs.Valute;

    return rates.reduce<Record<string, number>>((acc, currency) => {
      const { CharCode, Value } = currency;

      if (!acc[CharCode]) {
        acc[CharCode] = this.parseRate(Value);
      }

      return acc;
    }, {});
  }

  async getExchangeRate(
    currencyIn: typeof Currency.RUB,
    currencyOut: Currency
  ) {
    try {
      const response = await fetch(this.API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const rates = await this.parseXML(text);
      return rates[currencyOut];
    } catch (err) {
      // @TODO: log error
      console.error(err);
      return null;
    }
  }
}

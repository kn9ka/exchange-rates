"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CBRExchange = void 0;
const types_1 = require("../types");
const fast_xml_parser_1 = require("fast-xml-parser");
const parser = new fast_xml_parser_1.XMLParser();
class CBRExchange extends types_1.Exchange {
    API_URL = "http://www.cbr.ru/scripts/XML_daily.asp";
    parseRate(rate) {
        return Number(parseFloat(rate.replace(",", ".")).toFixed(2));
    }
    async parseXML(text) {
        const xml = parser.parse(text);
        const rates = xml.ValCurs.Valute;
        return rates.reduce((acc, currency) => {
            const { CharCode, Value } = currency;
            if (!acc[CharCode]) {
                acc[CharCode] = this.parseRate(Value);
            }
            return acc;
        }, {});
    }
    async getExchangeRate(currencyIn, currencyOut) {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const rates = await this.parseXML(text);
            return rates[currencyOut];
        }
        catch (err) {
            // @TODO: log error
            console.error(err);
            return null;
        }
    }
}
exports.CBRExchange = CBRExchange;

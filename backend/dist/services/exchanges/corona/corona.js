"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoronaExchange = void 0;
const types_1 = require("../types");
const DEFAULT_SEARCH_PARAMS = {
    receivingCountryId: "GEO",
    paymentMethod: "debitCard",
    receivingAmount: "10000",
    receivingMethod: "cash",
    sendingCountryId: "RUS",
};
class CoronaExchange extends types_1.Exchange {
    SITE_URL = "https://koronapay.com";
    API_URL = `${this.SITE_URL}/transfers/online/api/transfers/tariffs`;
    parseRate(rate) {
        return Number(rate.toFixed(2));
    }
    async getExchangeRate(inCurrency, outCurrency) {
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
            const [json] = (await response.json());
            return this.parseRate(json.exchangeRate);
        }
        catch (err) {
            // @TODO: log error
            console.error(err);
            return null;
        }
    }
}
exports.CoronaExchange = CoronaExchange;

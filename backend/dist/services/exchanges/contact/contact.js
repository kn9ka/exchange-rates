"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactExchange = void 0;
const types_1 = require("../types");
const types_2 = require("./types");
class ContactExchange extends types_1.Exchange {
    partnerId = null;
    accessToken = null;
    cookies = null;
    SITE_URL = "https://online.contact-sys.com";
    API_URL = `${this.SITE_URL}/api/contact/v2`;
    DEFAULT_AMOUNT = "100.00";
    formId = null;
    cleanCookies(cookies) {
        const TAIL_REFREST_TOKEN_REGEX = /tokenTailRefresh2=([^;]+)/;
        const TAIL_ACCESS_TOKEN_REGEX = /tokenTailAccess2=([^;]+)/;
        const tailAccessMatch = cookies.match(TAIL_ACCESS_TOKEN_REGEX);
        const tailRefreshMatch = cookies.match(TAIL_REFREST_TOKEN_REGEX);
        const access = tailAccessMatch && tailAccessMatch[1];
        const refresh = tailRefreshMatch && tailRefreshMatch[1];
        return `tokenTailRefresh2=${refresh}; tokenTailAccess2=${access}`;
    }
    updateCookies(cookies) {
        this.cookies = this.cleanCookies(cookies);
    }
    exposePartnerId(text) {
        const TOKEN_REGEX = /window\['ONLINE_PARTNER_ID'\] = "([^"]+)"/;
        const match = text.match(TOKEN_REGEX);
        const token = match && match[1];
        return token;
    }
    parseRate(rate) {
        return parseFloat(parseFloat(rate).toFixed(2));
    }
    async enrichedFetch(url, request = {}) {
        const enrichedRequest = {
            ...request,
            headers: {
                "Content-Type": "application/json",
                authorization: `SplitTokenV2 ${this.accessToken}`,
                Cookie: this.cookies ?? "",
                ...(request.headers ?? {}),
            },
        };
        const response = await fetch(url, enrichedRequest);
        this.updateCookies(response.headers.get("Set-Cookie") ?? "");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    }
    async getPartnerId() {
        const response = await this.enrichedFetch(this.SITE_URL);
        const text = await response.text();
        this.partnerId = this.exposePartnerId(text);
        return this.partnerId;
    }
    async getAccessToken() {
        const url = `${this.API_URL}/auth/token`;
        const request = {
            method: "POST",
            body: JSON.stringify({
                tokenType: "SplitTokenV2",
                grantType: "anonymous",
                ticket: this.partnerId,
            }),
        };
        const response = await this.enrichedFetch(url, request);
        const json = (await response.json());
        this.accessToken = json.accessToken;
        return this.accessToken;
    }
    async createExchangeForm(bankCode) {
        const url = `${this.API_URL}/trns/bank`;
        const request = {
            method: "POST",
            body: JSON.stringify({
                bankCode,
            }),
        };
        const response = await this.enrichedFetch(url, request);
        // @TODO: fix as
        const json = (await response.json());
        this.formId = json.id;
        return this.formId;
    }
    async fillExchangeForm(currency) {
        const url = `${this.API_URL}/trns/${this.formId}/fields`;
        const request = {
            method: "PUT",
            body: JSON.stringify({
                trnAmount: `${this.DEFAULT_AMOUNT}`,
                trnCurrency: currency,
            }),
        };
        await this.enrichedFetch(url, request);
    }
    async getRate() {
        const url = `${this.API_URL}/trns/${this.formId}/fees`;
        const request = {
            method: "POST",
        };
        const response = await this.enrichedFetch(url, request);
        // @TODO: fix as
        const json = (await response.json());
        return this.parseRate(json.rate);
    }
    async init() {
        const partnerId = await this.getPartnerId();
        if (partnerId) {
            await this.getAccessToken();
        }
    }
    async getExchangeRate(currencyIn, currency) {
        try {
            if (!this.partnerId) {
                await this.init();
            }
            await this.createExchangeForm(types_2.BankCode.Georgia);
            await this.fillExchangeForm(currency);
            return await this.getRate();
        }
        catch (err) {
            // @TODO: log error
            console.error(err);
            return null;
        }
    }
}
exports.ContactExchange = ContactExchange;

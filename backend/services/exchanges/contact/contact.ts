import { Exchange } from "../types";
import {
  AccessTokenResponse,
  BankCode,
  CreateExchangeFormResponse,
  GetFeeResponse,
} from "./types";
import { Currency } from "../types";

export class ContactExchange extends Exchange {
  SITE_URL = "https://online.contact-sys.com";
  API_URL = `${this.SITE_URL}/api/contact/v2`;

  private partnerId: string | null = "D5267BED-18CC-4661-B03A-65934CAE1CA4";
  private accessToken: string | null = null;
  private cookies: string | null = null;
  private DEFAULT_AMOUNT = "100.00";
  private formId: string | null = null;
  private ALLOWED_CURRENCIES = [Currency.GEL, Currency.USD];
  private MAIN_CURRENCY = Currency.RUB;
  private CURRENCY_MAP = {
    [Currency.RUB]: "RUB",
    [Currency.USD]: "USD",
    [Currency.GEL]: "GEL",
    [Currency.EUR]: "EUR",
  };

  private cleanCookies(cookies: string) {
    const TAIL_REFREST_TOKEN_REGEX = /tokenTailRefresh2=([^;]+)/;
    const TAIL_ACCESS_TOKEN_REGEX = /tokenTailAccess2=([^;]+)/;

    const tailAccessMatch = cookies.match(TAIL_ACCESS_TOKEN_REGEX);
    const tailRefreshMatch = cookies.match(TAIL_REFREST_TOKEN_REGEX);

    const access = tailAccessMatch && tailAccessMatch[1];
    const refresh = tailRefreshMatch && tailRefreshMatch[1];

    return `tokenTailRefresh2=${refresh}; tokenTailAccess2=${access}`;
  }

  private updateCookies(cookies: string) {
    this.cookies = this.cleanCookies(cookies);
  }

  private async exposePartnerId(text: string) {
    const TOKEN_REGEX = /window\['ONLINE_PARTNER_ID'\] = "([^"]+)"/;
    const match = text.match(TOKEN_REGEX);
    const token = match && match[1];
    return token;
  }

  private parseRate(rate: string) {
    return parseFloat(parseFloat(rate).toFixed(2));
  }

  private async enrichedFetch(url: string, request: RequestInit = {}) {
    let enrichedRequest = {
      ...request,
      headers: {
        "Content-Type": "application/json",
        Cookie: this.cookies ?? "",
        ...(this.accessToken
          ? { authorization: `SplitTokenV2 ${this.accessToken}` }
          : {}),
        ...(request.headers ?? {}),
      },
    };

    const response = await fetch(url, enrichedRequest);
    console.log(url, response.status);
    this.updateCookies(response.headers.get("Set-Cookie") ?? "");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  private async getPartnerId() {
    if (this.partnerId) {
      return this.partnerId;
    }
    const response = await this.enrichedFetch(this.SITE_URL);

    const text = await response.text();
    return await this.exposePartnerId(text);
  }

  private async getAccessToken() {
    const url = `${this.API_URL}/auth/token`;
    const request: RequestInit = {
      method: "POST",
      body: JSON.stringify({
        tokenType: "SplitTokenV2",
        grantType: "anonymous",
        ticket: this.partnerId,
      }),
    };

    const response = await this.enrichedFetch(url, request);

    const json = (await response.json()) as AccessTokenResponse;
    this.accessToken = json.accessToken;
    return this.accessToken;
  }

  private async createExchangeForm(bankCode: BankCode) {
    const url = `${this.API_URL}/trns/bank`;
    const request: RequestInit = {
      method: "POST",
      body: JSON.stringify({
        bankCode,
      }),
    };

    const response = await this.enrichedFetch(url, request);
    // @TODO: fix as
    const json = (await response.json()) as CreateExchangeFormResponse;
    this.formId = json.id;
    return this.formId;
  }

  private async fillExchangeForm(currency: Currency) {
    const url = `${this.API_URL}/trns/${this.formId}/fields`;

    const request: RequestInit = {
      method: "PUT",
      body: JSON.stringify({
        trnAmount: `${this.DEFAULT_AMOUNT}`,
        trnCurrency: this.CURRENCY_MAP[currency],
      }),
    };

    await this.enrichedFetch(url, request);
  }

  private async getRate() {
    const url = `${this.API_URL}/trns/${this.formId}/fees`;
    const request: RequestInit = {
      method: "POST",
    };

    const response = await this.enrichedFetch(url, request);
    // @TODO: fix as
    const json = (await response.json()) as GetFeeResponse;
    return this.parseRate(json.rate);
  }

  async init() {
    await this.getPartnerId();

    return await this.getAccessToken();
  }

  async getExchangeRate(currencyIn: typeof Currency.RUB, currency: Currency) {
    try {
      await this.getPartnerId();
      await this.getAccessToken();
      await this.createExchangeForm(BankCode.Georgia);
      await this.fillExchangeForm(currency);
      return await this.getRate();
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

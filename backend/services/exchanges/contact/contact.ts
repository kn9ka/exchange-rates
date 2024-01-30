import { Exchange } from "../types";
import {
  AccessTokenResponse,
  BankCode,
  CreateExchangeFormResponse,
  Currency,
  GetFeeResponse,
} from "./types";

export class ContactExchange extends Exchange {
  partnerId: string | null = null;
  accessToken: string | null = null;
  cookies: string | null = null;

  SITE_URL = "https://online.contact-sys.com";
  API_URL = `${this.SITE_URL}/api/contact/v2`;
  DEFAULT_AMOUNT = "100.00";
  formId: string | null = null;

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

  private exposePartnerId(text: string) {
    const TOKEN_REGEX = /window\['ONLINE_PARTNER_ID'\] = "([^"]+)"/;
    const match = text.match(TOKEN_REGEX);
    const token = match && match[1];
    return token;
  }

  private parseRate(rate: string) {
    return parseFloat(parseFloat(rate).toFixed(2));
  }

  private async enrichedFetch(url: string, request: RequestInit = {}) {
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

  private async getPartnerId() {
    const response = await this.enrichedFetch(this.SITE_URL);

    const text = await response.text();
    this.partnerId = this.exposePartnerId(text);
    return this.partnerId;
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
        trnCurrency: currency,
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
    const partnerId = await this.getPartnerId();

    if (partnerId) {
      await this.getAccessToken();
    }
  }

  async getExchangeRate(currencyIn: typeof Currency.RUB, currency: Currency) {
    try {
      if (!this.partnerId) {
        await this.init();
      }

      await this.createExchangeForm(BankCode.Georgia);
      await this.fillExchangeForm(currency);
      return await this.getRate();
    } catch (err) {
      // @TODO: log error
      console.error(err);
      return null;
    }
  }
}

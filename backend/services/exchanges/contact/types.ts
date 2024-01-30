export const Currency = {
  USD: "USD",
  GEL: "GEL",
  RUB: "RUB",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const BankCode = {
  Georgia: "CFRN",
} as const;

export type BankCode = (typeof BankCode)[keyof typeof BankCode];

export const FeeType = {
  Exact: "EXACT",
} as const;

export type FeeType = (typeof FeeType)[keyof typeof FeeType];

export type AccessTokenResponse = {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  scopes: string[];
  type: string;
};

export type CreateExchangeFormResponse = {
  id: string;
};

export type GetFeeResponse = {
  type: FeeType;
  value: string[];
  rate: string;
  totalAmount: string;
  amount: string;
  currency: Currency;
  payoutAmount: string;
  payoutCurrency: Currency;
  payoutRate: null;
  transactionAmount: string;
  transactionCurrency: Currency;
  payoutToEnterRate: string;
  enterToPayoutRate: string | null;
  additionalInformation: string | null;
};

export const Currency = {
  RUB: "RUB",
  USD: "USD",
  GEL: "GEL",
  EUR: "EUR",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export type Valute = {
  CharCode: string;
  Name: string;
  Nominal: number;
  NumbCode: number;
  Value: string;
  VunitRate: string;
};

export type ParsedXMLResponse = {
  ValCurs: { Valute: Valute[] };
};

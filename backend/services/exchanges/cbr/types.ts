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

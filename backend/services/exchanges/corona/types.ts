export type ExchangeRate = {
  sendingCurrency: {
    id: string;
    code: string;
    name: string;
  };
  sendingAmount: number;
  sendingAmountDiscount: number;
  sendingAmountWithoutCommission: number;
  sendingCommission: number;
  sendingCommissionDiscount: number;
  sendingTransferCommission: number;
  paidNotificationCommission: number;
  receivingCurrency: {
    id: string;
    code: string;
    name: string;
  };
  receivingAmount: number;
  exchangeRate: number;
  exchangeRateType: string;
  exchangeRateDiscount: number;
  profit: number;
  properties: Record<string, unknown>;
};

export type GetExchangeRateResponse = ExchangeRate[];

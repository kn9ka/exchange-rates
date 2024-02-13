import { CBRExchange } from "./cbr";
import { ContactExchange } from "./contact";
import { CoronaExchange } from "./corona";
import { Exchange, ExchangeServiceName } from "./types";

export const ExchangeServices: Record<ExchangeServiceName, Exchange> = {
  [ExchangeServiceName.Corona]: new CoronaExchange(),
  [ExchangeServiceName.CBR]: new CBRExchange(),
  [ExchangeServiceName.Contact]: new ContactExchange(),
};

export { CBRExchange, Currency as CBRCurrency } from "./cbr";
export { ContactExchange, Currency as ContactCurrency } from "./contact";
export { CoronaExchange, Currency as CoronaCurrency } from "./corona";
export * from "./types";

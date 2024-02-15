import { CBRExchange } from "./cbr";
import { ContactExchange } from "./contact";
import { CoronaExchange } from "./corona";
import { Exchange, ExchangeServiceName } from "./types";

export const ExchangeServices: Record<ExchangeServiceName, Exchange> = {
  [ExchangeServiceName.Corona]: new CoronaExchange(),
  [ExchangeServiceName.CBR]: new CBRExchange(),
  [ExchangeServiceName.Contact]: new ContactExchange(),
};

export { CBRExchange } from "./cbr";
export { ContactExchange } from "./contact";
export { CoronaExchange } from "./corona";
export * from "./types";

import { FastifyInstance } from "fastify";
import z from "zod";
import {
  CoronaExchange,
  Currency as CoronaCurrency,
} from "../../services/exchanges/corona";
import {
  ContactExchange,
  Currency as ContactCurrency,
} from "../../services/exchanges/contact";
import {
  CBRExchange,
  Currency as CBRCurrency,
} from "../../services/exchanges/cbr";

const contactService = new ContactExchange();
const coronaService = new CoronaExchange();
const cbrService = new CBRExchange();

export const ratesSchema = {
  response: {
    200: z.record(z.record(z.number().nullable())),
  } as const,
};

const router = async (fastify: FastifyInstance) => {
  const provider = fastify.zodRouter();

  provider.get("/rates", { schema: ratesSchema }, async (_, reply) => {
    // @TODO: fix any
    const cached = await fastify.abscache.get<any>("rates");
    if (cached) {
      return reply.send(cached.item);
    }

    const rates = {
      corona: {
        USD: await coronaService.getExchangeRate(
          CoronaCurrency.RUB,
          CoronaCurrency.USD
        ),
        EUR: await coronaService.getExchangeRate(
          CoronaCurrency.RUB,
          CoronaCurrency.EUR
        ),
        GEL: await coronaService.getExchangeRate(
          CoronaCurrency.RUB,
          CoronaCurrency.GEL
        ),
      },
      contact: {
        USD: await contactService.getExchangeRate(
          ContactCurrency.RUB,
          ContactCurrency.USD
        ),
        GEL: await contactService.getExchangeRate(
          ContactCurrency.RUB,
          ContactCurrency.GEL
        ),
      },
      cbr: {
        USD: await cbrService.getExchangeRate(CBRCurrency.RUB, CBRCurrency.USD),
        EUR: await cbrService.getExchangeRate(CBRCurrency.RUB, CBRCurrency.EUR),
        GEL: await cbrService.getExchangeRate(CBRCurrency.RUB, CBRCurrency.GEL),
      },
    };

    await fastify.cache.set("rates", rates, 1000 * 60);

    reply.send(rates);
  });
};

export default router;

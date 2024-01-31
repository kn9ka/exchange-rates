import { FastifyInstance } from "fastify";
import z from "zod";

import {
  CoronaExchange,
  CoronaCurrency,
  ContactExchange,
  ContactCurrency,
  CBRExchange,
  CBRCurrency,
  ExchangeServiceName,
} from "../../services/exchanges";

const contactService = new ContactExchange();
const coronaService = new CoronaExchange();
const cbrService = new CBRExchange();

export const ratesSchema = {
  response: {
    200: z.record(z.record(z.number().nullable())),
  } as const,
};

export const servicesSchema = {
  response: {
    200: z.array(z.string()),
  },
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
        GEL: await coronaService.getExchangeRate(
          CoronaCurrency.RUB,
          CoronaCurrency.GEL
        ),
        EUR: await coronaService.getExchangeRate(
          CoronaCurrency.RUB,
          CoronaCurrency.EUR
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
        GEL: await cbrService.getExchangeRate(CBRCurrency.RUB, CBRCurrency.GEL),
        EUR: await cbrService.getExchangeRate(CBRCurrency.RUB, CBRCurrency.EUR),
      },
    };

    await fastify.cache.set("rates", rates, 1000 * 60 * 10);

    reply.send(rates);
  });

  provider.get("/services", { schema: servicesSchema }, async (_, reply) => {
    reply.send(Object.values(ExchangeServiceName));
  });
};

export default router;

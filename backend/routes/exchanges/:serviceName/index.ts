import { FastifyInstance } from "fastify";
import z from "zod";
import {
  ExchangeServiceName,
  ExchangeServices,
} from "../../../services/exchanges";

const FIVE_MINUTES = 60 * 1000 * 5;
const CACHE_TIMEOUT = FIVE_MINUTES;

const ratesSchema = {
  params: z.object({
    serviceName: z.union([
      z.literal(ExchangeServiceName.CBR),
      z.literal(ExchangeServiceName.Contact),
      z.literal(ExchangeServiceName.Corona),
    ]),
  }),
  response: {
    200: z.record(z.number().nullable()),
  } as const,
};

const router = async (fastify: FastifyInstance) => {
  const provider = fastify.zodRouter();

  provider.get("/rates", { schema: ratesSchema }, async (req, reply) => {
    const { serviceName } = req.params;

    if (!Object.keys(ExchangeServices).includes(serviceName)) {
      throw new Error(`Service ${serviceName} does not exist`);
    }

    const cached = await fastify.abscache.get<Record<string, number | null>>(
      serviceName
    );

    if (cached && Object.values(cached.item).every((v) => v !== null)) {
      return reply.send(cached.item);
    }

    const exchangeService = ExchangeServices[serviceName];
    const currencies = exchangeService.allowedCurrencies;
    const inCurrency = exchangeService.mainCurrency;

    const rates: Record<string, number | null> = {};

    for (let currency of currencies) {
      rates[currency] = await exchangeService.getExchangeRate(
        inCurrency,
        currency
      );
    }

    await fastify.abscache.set(serviceName, rates, CACHE_TIMEOUT);

    reply.send(rates);
  });
};

export default router;

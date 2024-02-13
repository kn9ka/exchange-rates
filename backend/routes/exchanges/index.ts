import { FastifyInstance } from "fastify";
import z from "zod";

import { ExchangeServices } from "../../services/exchanges";

export const servicesSchema = {
  response: {
    200: z.record(z.object({ url: z.string() })),
  },
};

const router = async (fastify: FastifyInstance) => {
  const provider = fastify.zodRouter();

  provider.get("/", { schema: servicesSchema }, (_, reply) => {
    const services = Object.entries(ExchangeServices).reduce<
      Record<string, { url: string }>
    >((acc, [key, value]) => {
      if (acc[key]) {
        return acc;
      }

      acc[key] = { url: value.url };

      return acc;
    }, {});

    reply.send(services);
  });
};

export default router;

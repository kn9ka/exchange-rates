"use strict";

import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * @see https://github.com/fastify/fastify-cors
 */
const plugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(require("@fastify/cors"), {
    origin: "*",
  });
});

export default plugin;

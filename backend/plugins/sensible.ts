"use strict";

import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

/**
 * @see https://github.com/fastify/fastify-sensible
 */
const plugin = fp(async (fastify: FastifyInstance) => {
  await fastify.register(require("@fastify/sensible"), {
    errorHandler: false,
  });
});

export default plugin;

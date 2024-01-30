"use strict";

import { FastifyBaseLogger, RawServerDefault } from "fastify";
import fp from "fastify-plugin";

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { IncomingMessage, ServerResponse } from "http";

/**
 * @see https://github.com/turkerdev/fastify-type-provider-zod
 */
const plugin = fp((fastify, _, done) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.decorate("zodRouter", fastify.withTypeProvider<ZodTypeProvider>);
  done();
});

export default plugin;

declare module "fastify" {
  interface FastifyInstance {
    zodRouter: () => FastifyInstance<
      RawServerDefault,
      IncomingMessage,
      ServerResponse<IncomingMessage>,
      FastifyBaseLogger,
      ZodTypeProvider
    >;
  }
}

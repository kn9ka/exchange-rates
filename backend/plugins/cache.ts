"use strict";

import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyCaching, { AbstractCacheCompliantObject } from "@fastify/caching";

export const cache = require("abstract-cache")({
  useAwait: true,
});

/**
 * @see https://github.com/fastify/fastify-caching
 */
const plugin = fp((fastify: FastifyInstance, _, done) => {
  fastify.register(fastifyCaching, {
    cache,
  });
  fastify.decorate("abscache", cache);
  done();
});

export default plugin;

type CacheItem<T> = {
  item: T;
  stored: number;
  ttl: number;
};

declare module "fastify" {
  interface FastifyInstance {
    abscache: {
      get<T>(key: string): Promise<CacheItem<T>>;
      set<T>(key: string, value: T): Promise<unknown>;
    };
  }
}

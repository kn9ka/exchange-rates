"use strict";

import path from "node:path";
import AutoLoad from "@fastify/autoload";
import { FastifyInstance, FastifyRegisterOptions } from "fastify";

// Pass --options via CLI arguments in command to enable these options.
export const options = {};

const registerApp = async (
  fastify: FastifyInstance,
  opts: FastifyRegisterOptions<{}>
) => {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({ prefix: "api" }, opts),
  });
};

export default registerApp;

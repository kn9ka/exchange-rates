"use strict";

require("dotenv").config();

import Fastify, { FastifyInstance } from "fastify";
import closeWithGrace from "close-with-grace";

const app: FastifyInstance = Fastify({
  logger: true,
});

const appService = require("./app");
app.register(appService);

const GRACE_DELAY = Number(process.env.FASTIFY_CLOSE_GRACE_DELAY) || 500;
const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;

const closeListeners = closeWithGrace(
  { delay: GRACE_DELAY },
  async ({ err }) => {
    if (err) {
      app.log.error(err);
    }
    await app.close();
  }
);

app.addHook("onClose", (_, done) => {
  closeListeners.uninstall();
  done();
});

app.listen({ port: SERVER_PORT, host: "0.0.0.0" }, (err) => {
  console.log("Server listening on port " + SERVER_PORT);

  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const fastify_1 = __importDefault(require("fastify"));
const close_with_grace_1 = __importDefault(require("close-with-grace"));
const app = (0, fastify_1.default)({
    logger: true,
});
const appService = require("./app.ts");
app.register(appService);
const GRACE_DELAY = Number(process.env.FASTIFY_CLOSE_GRACE_DELAY) || 500;
const SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;
const closeListeners = (0, close_with_grace_1.default)({ delay: GRACE_DELAY }, async ({ err }) => {
    if (err) {
        app.log.error(err);
    }
    await app.close();
});
app.addHook("onClose", (_, done) => {
    closeListeners.uninstall();
    done();
});
app.listen({ port: SERVER_PORT }, (err) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
});

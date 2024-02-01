"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
/**
 * @see https://github.com/fastify/fastify-cors
 */
const plugin = (0, fastify_plugin_1.default)(async (fastify) => {
    await fastify.register(require("@fastify/cors"), {
        origin: "*",
    });
});
exports.default = plugin;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
/**
 * @see https://github.com/turkerdev/fastify-type-provider-zod
 */
const plugin = (0, fastify_plugin_1.default)((fastify, _, done) => {
    fastify.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    fastify.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    fastify.decorate("zodRouter", (fastify.withTypeProvider));
    done();
});
exports.default = plugin;

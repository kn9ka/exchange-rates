"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const caching_1 = __importDefault(require("@fastify/caching"));
exports.cache = require("abstract-cache")({
    useAwait: true,
});
/**
 * @see https://github.com/fastify/fastify-caching
 */
const plugin = (0, fastify_plugin_1.default)((fastify, _, done) => {
    fastify.register(caching_1.default, {
        cache: exports.cache,
    });
    fastify.decorate("abscache", exports.cache);
    done();
});
exports.default = plugin;

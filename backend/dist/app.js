"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const node_path_1 = __importDefault(require("node:path"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
// Pass --options via CLI arguments in command to enable these options.
exports.options = {};
const registerApp = async (fastify, opts) => {
    fastify.register(autoload_1.default, {
        dir: node_path_1.default.join(__dirname, "plugins"),
        options: Object.assign({}, opts),
    });
    fastify.register(autoload_1.default, {
        dir: node_path_1.default.join(__dirname, "routes"),
        options: Object.assign({}, opts),
    });
};
exports.default = registerApp;

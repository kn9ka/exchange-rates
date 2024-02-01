"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesSchema = exports.ratesSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const exchanges_1 = require("../../services/exchanges");
const contactService = new exchanges_1.ContactExchange();
const coronaService = new exchanges_1.CoronaExchange();
const cbrService = new exchanges_1.CBRExchange();
exports.ratesSchema = {
    response: {
        200: zod_1.default.record(zod_1.default.record(zod_1.default.number().nullable())),
    },
};
exports.servicesSchema = {
    response: {
        200: zod_1.default.array(zod_1.default.string()),
    },
};
const router = async (fastify) => {
    const provider = fastify.zodRouter();
    provider.get("/rates", { schema: exports.ratesSchema }, async (_, reply) => {
        // @TODO: fix any
        const cached = await fastify.abscache.get("rates");
        if (cached) {
            return reply.send(cached.item);
        }
        const rates = {
            corona: {
                USD: await coronaService.getExchangeRate(exchanges_1.CoronaCurrency.RUB, exchanges_1.CoronaCurrency.USD),
                GEL: await coronaService.getExchangeRate(exchanges_1.CoronaCurrency.RUB, exchanges_1.CoronaCurrency.GEL),
                EUR: await coronaService.getExchangeRate(exchanges_1.CoronaCurrency.RUB, exchanges_1.CoronaCurrency.EUR),
            },
            contact: {
                USD: await contactService.getExchangeRate(exchanges_1.ContactCurrency.RUB, exchanges_1.ContactCurrency.USD),
                GEL: await contactService.getExchangeRate(exchanges_1.ContactCurrency.RUB, exchanges_1.ContactCurrency.GEL),
            },
            cbr: {
                USD: await cbrService.getExchangeRate(exchanges_1.CBRCurrency.RUB, exchanges_1.CBRCurrency.USD),
                GEL: await cbrService.getExchangeRate(exchanges_1.CBRCurrency.RUB, exchanges_1.CBRCurrency.GEL),
                EUR: await cbrService.getExchangeRate(exchanges_1.CBRCurrency.RUB, exchanges_1.CBRCurrency.EUR),
            },
        };
        await fastify.cache.set("rates", rates, 1000 * 60 * 10);
        reply.send(rates);
    });
    provider.get("/services", { schema: exports.servicesSchema }, async (_, reply) => {
        reply.send(Object.values(exchanges_1.ExchangeServiceName));
    });
};
exports.default = router;

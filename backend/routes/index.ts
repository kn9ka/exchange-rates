import { FastifyInstance } from "fastify";

const router = async (fastify: FastifyInstance) => {
  fastify.get("/ping", async (_, reply) => {
    reply.send("pong");
  });
};
export default router;

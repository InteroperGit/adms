import "dotenv/config"
import Fastify from 'fastify';
import {getServicePort} from "./libs/envUtils";
import {healthRoute} from "./routes/healthRoute";
import {proxyRoute} from "./routes/proxyRoute";
import {strapiRoute} from "./routes/strapiRoute";
import {breadcrumbsRoute} from "./routes/breadcrumbsRoute";
import {formsRoute} from "./routes/formsRoute";
import fastifyCors from '@fastify/cors';
import * as process from "node:process";

const SERVICE_PORT: number = getServicePort();
const ALLOW_SITE_CORS: string[] = process.env.ALLOW_SITE_CORS
    ? process.env.ALLOW_SITE_CORS.split(";")
    : [];

const app = Fastify({
    logger: process.env.NODE_ENV === "development",
});

const bootstrap = async () => {
    await app.register(fastifyCors, {
        origin: ALLOW_SITE_CORS,
    });

    app.register(healthRoute);
    app.register(proxyRoute);
    app.register(strapiRoute);
    app.register(breadcrumbsRoute);
    app.register(formsRoute);

    app.listen({ port: SERVICE_PORT }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        console.log(`🚀 API Gateway listening at ${address}`);
    });
}

bootstrap().catch(console.error);

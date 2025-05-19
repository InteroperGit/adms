import "dotenv/config"
import Fastify from 'fastify';
import {getServicePort} from "./libs/envUtils";
import {healthRoute} from "./routes/healthRoute";
import {proxyRoute} from "./routes/proxyRoute";
import {strapiRoute} from "./routes/strapiRoute";
import {breadcrumbsRoute} from "./routes/breadcrumbsRoute";

const SERVICE_PORT = getServicePort();

const app = Fastify();

app.register(healthRoute);
app.register(proxyRoute);
app.register(strapiRoute);
app.register(breadcrumbsRoute);

app.listen({ port: SERVICE_PORT }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 API Gateway listening at ${address}`);
});
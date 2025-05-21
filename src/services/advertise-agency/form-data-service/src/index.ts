import "dotenv/config"
import Fastify from 'fastify';
import {getNodeEnv, getServicePort} from "./libs/envUtils";
import * as process from "node:process";
import healthRoute from "./routes/healthRoute";
import formRoute from "./routes/formRoute";

const SERVICE_PORT: number = getServicePort();
const NODE_ENV: string = getNodeEnv();

const app = Fastify({
    logger: NODE_ENV === "development",
});

const bootstrap = async () => {
    app.register(healthRoute);
    app.register(formRoute)

    app.listen({ port: SERVICE_PORT }, (err, address) => {
        if (err) {
            app.log.error(err);
            process.exit(1);
        }
        console.log(`🚀 FormDataService listening at ${address}`);
    });
}

bootstrap().catch(console.error);

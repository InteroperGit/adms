import "dotenv/config"
import express, { Request, Response } from 'express';
import {getBreadcrumbs} from "./breadcrumbs.js";
import {getServicePort} from "./libs/envUtils.js";

const app = express();
const HOST = "0.0.0.0";
const port = getServicePort();

app.get(/^\/(.*)/, async (req: Request, res: Response) => {
    const path = `/${req.params[0] ?? ""}`;

    if (!path || path.length <= 1) {
        res.json([]);
        return;
    }

    try {
        const breadcrumbs = await getBreadcrumbs(path);
        res.json(breadcrumbs);
    }
    catch (e) {
        console.error(e);
        res.send("Failed to get breadcrumbs");
    }
});

app.listen(port, HOST, () => {
    console.log(`🚀 Breadcrumbs Service is listening at http://::${port}`);
});

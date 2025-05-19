import "dotenv/config"
import express, { Request, Response } from 'express';
import {getBreadcrumbs} from "./breadcrumbs";
import {getServicePort} from "./libs/envUtils";

const app = express();
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

app.listen(port, () => {
    console.log(`Server running at http://::${port}`);
});

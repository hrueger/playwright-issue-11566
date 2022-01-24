require('dotenv').config();
import express, { Router } from "express"
import packageJSON from "../package.json";
import { firefox, chromium } from "playwright";
import path from "path";

(async () => {
    console.log("Starting headless browser...");

    // works!
    const browser = await chromium.launch({ headless: true });
    // does not work!
    // const browser = await firefox.launch({ headless: true });
    
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.route('**', route => route.continue());
    page.on("console", (message) => {
        console.log("----->", message.text());
    });

    console.log("Starting express server...");

    const app = express();
    app.use(express.json());
    
    const mainRouter = Router();
    mainRouter.get("/", (req, res) => res.send(`Playwright Issue 11566 Testserver v${packageJSON.version}`));
    
    const rendererRouter = Router();
    rendererRouter.get("/", (req, res) => res.sendFile(path.join(__dirname, "../webgldata/index.html")));
    rendererRouter.get("/*", express.static(path.join(__dirname, "../webgldata"), {
        setHeaders: (res, path) => {
            if (path.endsWith(".wasm.gz")) {
                res.set("Content-Type", "application/wasm");
            }
            if (path.endsWith(".gz")) {
                res.set("Content-Encoding", "gzip");
            }
        }
    }));

    const apiRouter = Router();
    apiRouter.get("/version", (req, res) => res.send({ version: packageJSON.version }));
    
    app.use("/", mainRouter);
    app.use("/api", apiRouter);
    app.use("/serveRenderer", rendererRouter)
    
    await new Promise<void>((resolve) => {
        app.listen(8080, () => {
            console.log("Server started on port 8080!");
            resolve();
        });
    });
    console.log("Loading 3D Renderer...");
    
    await page.goto('http://localhost:8080/serveRenderer/');
    
    console.log("Renderer loaded!");
})();

import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs";
import * as http from "http";
import * as https from "https";
import "dotenv/config";

const privateKey = atob(process.env.PRIVATE_KEY);
const certificate = atob(process.env.CERTIFICATE);

const credentials = {
	key: privateKey,
	cert: certificate,
};

const app = express();
app.use(express.static("dist/client/"));
app.use(ssrHandler);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);

console.log("Server listening on port 80");
console.log("Server listening on port 443");

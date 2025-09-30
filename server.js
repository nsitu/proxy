import express from "express";
import { createProxyServer } from "httpxy";

const app = express();
const proxy = createProxyServer({ changeOrigin: true });

app.disable("x-powered-by");
app.set("trust proxy", true);

if (!process.env.PROXY_TARGET) {
    console.error("Please add a PROXY_TARGET environment variable.");
    process.exit(1);
}

// 204 for favicon
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

// Simple public IP check (proxy server's egress IP)
app.get("/ip", async (req, res) => {
    try {
        const r = await fetch("https://api.ipify.org/");
        const ip = await r.text();
        res.type("text/plain").send(ip);
    } catch (err) {
        console.error("IP lookup error:", err);
        res.status(502).send("Bad Gateway");
    }
});

// Catch-all proxy → always forwards to PROXY_TARGET
app.use(async (req, res) => {
    try {
        await proxy.web(req, res, { target: process.env.PROXY_TARGET });
    } catch (error) {
        console.error("Proxy error:", error);
        if (!res.headersSent) res.status(502).send("Bad Gateway");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy listening on http://localhost:${PORT}`);
    console.log(`Forwarding all requests to ${process.env.PROXY_TARGET}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zohoTokenManager_1 = require("./components/zohoTokenManager");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.get("/zoho", async (req, res) => {
    const token = await (0, zohoTokenManager_1.getAccessToken)();
    res.json({
        body: token
    });
});
app.post("/proxy", async (req, res) => {
    const { url, method, headers, data } = req.body;
    const response = await fetch(url, {
        method,
        headers,
        body: data
    });
    const text = await response.text();
    res.json({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
    });
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`PID: ${process.pid}`);
});
function shutdown() {
    console.log("\nStopping server...");
    server.close(() => {
        console.log("Server stopped.");
        process.exit(0);
    });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
//# sourceMappingURL=app.js.map
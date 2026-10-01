"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const database_1 = __importDefault(require("./database"));
const db = new database_1.default();
const getAccessToken = async () => {
    let token = await db.getToken();
    if (!token || isExpired(token)) {
        token = await refreshToken();
        await db.insertToken(token);
    }
    return token.accessToken;
};
exports.getAccessToken = getAccessToken;
const refreshToken = async () => {
    const request = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${process.env.REFRESH_TOKEN}`
    });
    const response = await request.json();
    return {
        accessToken: response.access_token,
        expiresAt: String(Date.now() + Number(response.expires_in) * 1000)
    };
};
const isExpired = (token) => {
    const safetyMarein = 60 * 1000;
    return Date.now() >= Number(token.expiresAt) - safetyMarein;
};
//# sourceMappingURL=zohoTokenManager.js.map
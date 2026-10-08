/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/components/mongodb.ts"
/*!******************************************!*\
  !*** ./src/server/components/mongodb.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDatabase: () => (/* binding */ getDatabase)
/* harmony export */ });
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ "mongodb");
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
}
const client = new mongodb__WEBPACK_IMPORTED_MODULE_0__.MongoClient(uri);
let database = null;
async function getDatabase() {
    if (database) {
        return database;
    }
    await client.connect();
    database = client.db("synapse");
    return database;
}


/***/ },

/***/ "./src/server/components/mongodbTokenStorage.ts"
/*!******************************************************!*\
  !*** ./src/server/components/mongodbTokenStorage.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getToken: () => (/* binding */ getToken),
/* harmony export */   saveToken: () => (/* binding */ saveToken)
/* harmony export */ });
/* harmony import */ var _mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mongodb */ "./src/server/components/mongodb.ts");

const COLLECTION = "tokens";
const TOKEN_KEY = "zoho";
async function getToken() {
    const db = await (0,_mongodb__WEBPACK_IMPORTED_MODULE_0__.getDatabase)();
    return db
        .collection(COLLECTION)
        .findOne({
        key: TOKEN_KEY
    });
}
async function saveToken(token) {
    const db = await (0,_mongodb__WEBPACK_IMPORTED_MODULE_0__.getDatabase)();
    await db.collection(COLLECTION).updateOne({
        key: TOKEN_KEY
    }, {
        $set: {
            key: TOKEN_KEY,
            accessToken: token.accessToken,
            expiresAt: token.expiresAt
        }
    }, {
        upsert: true
    });
}


/***/ },

/***/ "./src/server/components/zohoTokenManager.ts"
/*!***************************************************!*\
  !*** ./src/server/components/zohoTokenManager.ts ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAccessToken: () => (/* binding */ getAccessToken)
/* harmony export */ });
/* harmony import */ var _mongodbTokenStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mongodbTokenStorage */ "./src/server/components/mongodbTokenStorage.ts");

const getAccessToken = async () => {
    let token = await (0,_mongodbTokenStorage__WEBPACK_IMPORTED_MODULE_0__.getToken)();
    if (!token || isExpired(token)) {
        token = await refreshToken();
        await (0,_mongodbTokenStorage__WEBPACK_IMPORTED_MODULE_0__.saveToken)(token);
    }
    return token.accessToken;
};
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
        key: response.key,
        accessToken: response.access_token,
        expiresAt: String(Date.now() + Number(response.expires_in) * 1000)
    };
};
const isExpired = (token) => {
    const safetyMarein = 60 * 1000;
    return Date.now() >= Number(token.expiresAt) - safetyMarein;
};


/***/ },

/***/ "./src/server/middlewares/authorization.ts"
/*!*************************************************!*\
  !*** ./src/server/middlewares/authorization.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requireToken: () => (/* binding */ requireToken)
/* harmony export */ });
const requireToken = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    const authorization = req.get("Authorization");
    if (!authorization) {
        return res.status(401).json({
            status: 401,
            error: "Missing authorization token"
        });
    }
    const [type, token] = authorization.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            status: 401,
            error: "Invalid authorization format"
        });
    }
    if (token !== process.env.API_TOKEN) {
        return res.status(403).json({
            status: 403,
            error: "Invalid token"
        });
    }
    next();
};


/***/ },

/***/ "express"
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
(module) {

module.exports = require("express");

/***/ },

/***/ "mongodb"
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
(module) {

module.exports = require("mongodb");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/server/app.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_zohoTokenManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/zohoTokenManager */ "./src/server/components/zohoTokenManager.ts");
/* harmony import */ var _middlewares_authorization__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./middlewares/authorization */ "./src/server/middlewares/authorization.ts");



const app = express__WEBPACK_IMPORTED_MODULE_0___default()();
app.use(express__WEBPACK_IMPORTED_MODULE_0___default().json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(_middlewares_authorization__WEBPACK_IMPORTED_MODULE_2__.requireToken);
app.get("/zoho", async (req, res) => {
    const token = await (0,_components_zohoTokenManager__WEBPACK_IMPORTED_MODULE_1__.getAccessToken)();
    res.json({
        token
    });
});
app.post("/proxy", async (req, res) => {
    const { url, method = "GET", headers, data } = req.body ?? {};
    if (!url || typeof url !== "string") {
        return res.status(400).json({
            error: "Missing or invalid 'url'"
        });
    }
    const allowedMethods = process.env.ALLOW_METHODS?.split(",") ?? ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if (!allowedMethods.includes(method.toUpperCase())) {
        return res.status(400).json({
            error: `Unsupported HTTP method: ${method}`
        });
    }
    try {
        const normalizedMethod = method.toUpperCase();
        const response = await fetch(url, {
            method: normalizedMethod,
            headers,
            body: ["GET", "HEAD"].includes(normalizedMethod)
                ? undefined
                : data,
            signal: AbortSignal.timeout(30_000)
        });
        const text = await response.text();
        return res.json({
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            body: text
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === "TimeoutError") {
            return res.status(504).json({
                status: 504,
                error: "The remote server did not respond in time"
            });
        }
        return res.status(502).json({
            status: 502,
            error: `${error instanceof Error
                ? error.name
                : "Failed to contact remote server."} ${error instanceof Error
                ? error.message
                : "Unknown reason"}`
        });
    }
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

})();

/******/ })()
;
//# sourceMappingURL=app.js.map
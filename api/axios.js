"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.axios = void 0;
const config_1 = require("./config");
class Axios {
    /**
     * Create a FormData instance based on an object or a form element.
     */
    createDataForm(params) {
        if (params instanceof HTMLFormElement)
            return new FormData(params);
        const data = new FormData();
        for (const key in params) {
            if (params[key] instanceof Blob) {
                data.append(key, params[key], key);
            }
            else {
                data.append(key, params[key]);
            }
        }
        return data;
    }
    /**
     * Performs a GET request.
     */
    async get(url, responseType = "json") {
        return this.ajax(url, {
            method: "GET",
            signal: this.createAbortSignal()
        }, responseType);
    }
    /**
     * Performs a POST request.
     */
    async post(url, upload = this.createDataForm({})) {
        return this.ajax(url, {
            method: "POST",
            body: upload,
            signal: this.createAbortSignal()
        });
    }
    /**
     * Performs a DELETE request.
     */
    async delete(url, upload = null) {
        return this.ajax(url, {
            method: "DELETE",
            body: upload,
            signal: this.createAbortSignal()
        });
    }
    /**
     * Core AJAX function used by all methods.
     */
    async ajax(url, requestInit, responseType = "json", retries = 3) {
        try {
            const timeout = (delay) => new Promise((_, reject) => setTimeout(() => {
                reject(new Response(`Request took too long! Timeout after ${delay} second`, { status: 500 }));
            }, delay * 1000));
            const authHeaders = url.startsWith("api/") ? {
                "Authorization": localStorage.getItem("token") || "",
                "X-Client-ID": localStorage.getItem("id") || ""
            } : {};
            const res = await Promise.race([
                fetch(url, {
                    headers: {
                        ...authHeaders,
                        ...(requestInit.headers || {})
                    },
                    ...requestInit
                }),
                timeout(config_1.TIMEOUT_SEC)
            ]);
            let responseData;
            try {
                responseData = responseType === "json" ? await res.json() : await res.text();
            }
            catch (parseError) {
                throw new Error(res.statusText || `HTTP error! status: ${res.status}`);
            }
            if (!res.ok) {
                const errorMessage = typeof responseData === "object" && responseData.message
                    ? responseData.message
                    : res.statusText || `HTTP error! status: ${res.status}`;
                throw new Error(errorMessage);
            }
            return responseData;
        }
        catch (err) {
            if (retries === 1)
                throw err;
            return this.ajax(url, requestInit, responseType, retries - 1);
        }
    }
    /**
     * Utility for creating an AbortSignal.
     */
    createAbortSignal() {
        const controller = new AbortController();
        return controller.signal;
    }
}
exports.axios = new Axios();
//# sourceMappingURL=axios.js.map
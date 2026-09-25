/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/scss/main.scss"
/*!***********************************!*\
  !*** ./src/client/scss/main.scss ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/client/ts/components/config.ts"
/*!********************************************!*\
  !*** ./src/client/ts/components/config.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_URL: () => (/* binding */ API_URL),
/* harmony export */   TIMEOUT_SEC: () => (/* binding */ TIMEOUT_SEC)
/* harmony export */ });
const TIMEOUT_SEC = 60;
const API_URL = "https://synapse-rouge-two.vercel.app/proxy";
// export const API_URL = "http://localhost:3000/proxy"


/***/ },

/***/ "./src/client/ts/components/error.ts"
/*!*******************************************!*\
  !*** ./src/client/ts/components/error.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CustomError)
/* harmony export */ });
class CustomError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}


/***/ },

/***/ "./src/client/ts/components/helpers.ts"
/*!*********************************************!*\
  !*** ./src/client/ts/components/helpers.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   chevronDown: () => (/* binding */ chevronDown),
/* harmony export */   chevronRight: () => (/* binding */ chevronRight),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   isJsonString: () => (/* binding */ isJsonString),
/* harmony export */   jsonToHtmlList: () => (/* binding */ jsonToHtmlList)
/* harmony export */ });
const chevronRight = `<i class="fa-solid fa-caret-right"></i>`;
const chevronDown = `<i class="fa-solid fa-caret-down"></i>`;
const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
};
const jsonToHtmlList = (data, label) => {
    const hasChildren = data !== null && typeof data === "object";
    // Object
    if (hasChildren && !Array.isArray(data)) {
        const content = Object.entries(data)
            .map(([key, value]) => jsonToHtmlList(value, key))
            .join("");
        return `
            <li class="json-node">
                <div class="json-header">
                    <span class="json-label">${escapeHtml(label || "")}</span>
                    <span class="json-toggle">${chevronDown}</span>
                    <span class="json-label"><span class="context" data-data="${encodeURIComponent(JSON.stringify(data))}">Object (${Object.entries(data).length})</span> {</span>
                </div>
                <ul class="json-children">
                    ${content}
                </ul>
                <div class="json-placeholder">...</div>
                <div class="json-label">}</div>
            </li>
        `;
    }
    // Array
    if (Array.isArray(data)) {
        const content = data
            .map((item, index) => jsonToHtmlList(item, `${index}`))
            .join("");
        return `
            <li class="json-node">
                <div class="json-header">
                    <span class="json-label">${escapeHtml(label || "")}</span>
                    <span class="json-toggle">${chevronDown}</span>
                    <span class="json-label"><span class="context" data-data="${encodeURIComponent(JSON.stringify(data))}">Array (${data.length})</span> [</span>
                </div>
                <ul class="json-children">
                    ${content}
                </ul>
                <div class="json-placeholder">...</div>
                <div class="json-label">]</div>
            </li>
        `;
    }
    // Primitive value
    return `
        <li class="json-value">
            <span class="json-label">${escapeHtml(label || "")}</span><span>${label ? ": " : ""}</span><q class="${data === null ? "null" : typeof data}">${escapeHtml(String(data))}</q>
        </li>
    `;
};
const isJsonString = (text) => {
    try {
        JSON.parse(text);
    }
    catch (e) {
        return false;
    }
    return true;
};


/***/ },

/***/ "./src/client/ts/components/jsonparser.ts"
/*!************************************************!*\
  !*** ./src/client/ts/components/jsonparser.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JSONParser)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/client/ts/components/helpers.ts");
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./popup */ "./src/client/ts/components/popup.ts");


class JSONParser {
    frame;
    popup;
    constructor() {
        this.frame = document.getElementById("frame");
        this.popup = new _popup__WEBPACK_IMPORTED_MODULE_1__["default"]();
    }
    parse(jsonString) {
        let html = jsonString;
        try {
            const jsonObject = JSON.parse(jsonString);
            html = `
                    <ul class="json-root">
                        ${(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.jsonToHtmlList)(jsonObject)}
                    </ul>
                `;
        }
        catch (error) {
            html = String(error);
        }
        return html;
    }
    eventListener() {
        document.addEventListener("click", (event) => {
            const listener = event.target.closest(".json-toggle");
            const header = event.target.closest(".json-header");
            if (!listener)
                return;
            const node = header?.parentElement;
            const children = node?.querySelector(":scope > .json-children");
            const toggle = header?.querySelector(".json-toggle");
            if (!children || !toggle)
                return;
            node?.classList.toggle("children-collapsed");
            children.classList.toggle("collapsed");
            toggle.innerHTML = children.classList.contains("collapsed")
                ? _helpers__WEBPACK_IMPORTED_MODULE_0__.chevronRight
                : _helpers__WEBPACK_IMPORTED_MODULE_0__.chevronDown;
        });
        const contexts = document.querySelectorAll(".context");
        contexts.forEach((context) => {
            context.addEventListener("mouseenter", _ => {
                const rect = context.getBoundingClientRect();
                this.popup.openPopup(rect);
            });
            context.addEventListener("mouseout", _ => {
                this.popup.closePopup();
            });
            context.addEventListener("click", async (event) => {
                const target = event.target;
                if (!target.classList.contains("context"))
                    return;
                const data = decodeURIComponent(target.dataset.data || "");
                await navigator.clipboard.writeText(data);
                this.popup.successPopup(`<i class="fa-solid fa-check" style="color:green;text-shadow: 0 0 2px #fff;"></i> Copied!`);
            });
        });
    }
}


/***/ },

/***/ "./src/client/ts/components/loader.ts"
/*!********************************************!*\
  !*** ./src/client/ts/components/loader.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Loader)
/* harmony export */ });
class Loader {
    loader;
    constructor() {
        this.loader = document.getElementById("loader");
    }
    show() {
        this.loader.style.visibility = "visible";
    }
    hide() {
        this.loader.style.visibility = "hidden";
    }
}


/***/ },

/***/ "./src/client/ts/components/popup.ts"
/*!*******************************************!*\
  !*** ./src/client/ts/components/popup.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Popup)
/* harmony export */ });
class Popup {
    popup;
    popupContent;
    defaultText = `<i class="fa-regular fa-copy"></i> Click to copy`;
    constructor() {
        this.popup = document.querySelector(".popup");
        this.popupContent = document.querySelector(".popup-content");
        this.setPopup(this.defaultText);
    }
    setPopup(text) {
        this.popupContent.innerHTML = text;
    }
    openPopup({ top, left, width }) {
        this.popup.style.display = "block";
        const rect = this.popup.getBoundingClientRect();
        this.popup.style.top = `${top - rect.height - 5}px`;
        this.popup.style.left = `${left - (rect.width - width) / 2}px`;
    }
    closePopup() {
        this.popup.style.display = "none";
        this.setPopup(this.defaultText);
    }
    blinkPopup() {
        this.popup.style.opacity = `0`;
        setTimeout(() => {
            this.popup.style.transition = `opacity 0.1s`;
            this.popup.style.opacity = `1`;
        }, 50);
        setTimeout(() => {
            this.popup.style.transition = ``;
        }, 100);
    }
    successPopup(text) {
        this.setPopup(text);
        this.blinkPopup();
        setTimeout(() => {
            this.setPopup(this.defaultText);
        }, 500);
    }
}


/***/ },

/***/ "./src/client/ts/components/rows.ts"
/*!******************************************!*\
  !*** ./src/client/ts/components/rows.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Rows)
/* harmony export */ });
class Rows {
    queries;
    addRows;
    constructor() {
        this.queries = document.querySelectorAll(`.content[data-target="query"]`);
        this.addRows = document.querySelectorAll(".add_row");
        this.eventListeners();
        this.removeListeners();
        this.notificationListeners();
        this.addNotification();
    }
    eventListeners() {
        this.addRows.forEach((addRow) => {
            addRow.addEventListener("click", (event) => {
                event.preventDefault();
                const templateId = addRow.dataset.template;
                const template = document.getElementById(templateId)?.innerHTML;
                addRow.insertAdjacentHTML("beforebegin", template || "");
                this.removeListeners();
                this.notificationListeners();
            });
        });
    }
    removeListeners() {
        const removers = document.querySelectorAll(".remover");
        removers.forEach(remover => {
            remover.addEventListener("click", (event) => {
                event.preventDefault();
                const target = event.target;
                const rowToRemove = target.closest(".group_input");
                const section = target.closest(`.content[data-target="query"]`);
                rowToRemove?.remove();
                this.addNotification();
                this.notificationListeners();
            });
        });
    }
    notificationListeners() {
        this.queries.forEach(query => {
            const inputs = query.querySelectorAll(".inputName, .inputValue");
            inputs.forEach(input => {
                input.addEventListener("change", event => {
                    const target = event.target;
                    const section = target.closest(`.content[data-target="query"]`);
                    this.addNotification();
                });
            });
        });
    }
    addNotification() {
        const sections = document.querySelectorAll(`.content[data-target="query"]`);
        sections.forEach(section => {
            const inputs = section?.querySelectorAll(".group_input");
            let notification = 0;
            inputs?.forEach(input => {
                const name = input.querySelector(".inputName");
                const value = input.querySelector(".inputValue");
                notification += (name.value !== "" && value.value !== "") ? 1 : 0;
            });
            const notificationSpan = document.querySelector(`ul.tabs[data-target="query"] li.tab[data-for="${section?.id}"] sup`);
            notificationSpan.innerHTML = `${notification === 0 ? "" : notification}`;
        });
    }
}


/***/ },

/***/ "./src/client/ts/components/synapse.ts"
/*!*********************************************!*\
  !*** ./src/client/ts/components/synapse.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Synapse)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/client/ts/components/config.ts");
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error */ "./src/client/ts/components/error.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./src/client/ts/components/helpers.ts");
/* harmony import */ var _jsonparser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./jsonparser */ "./src/client/ts/components/jsonparser.ts");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./loader */ "./src/client/ts/components/loader.ts");





class Synapse {
    jsonParser;
    mainForm;
    response;
    headers;
    status;
    size;
    time;
    loader;
    constructor() {
        this.jsonParser = new _jsonparser__WEBPACK_IMPORTED_MODULE_3__["default"]();
        this.mainForm = document.forms[0];
        this.response = document.getElementById("response");
        this.headers = document.querySelector("article #headers");
        this.status = document.getElementById("status");
        this.size = document.getElementById("size");
        this.time = document.getElementById("time");
        this.loader = new _loader__WEBPACK_IMPORTED_MODULE_4__["default"]();
        this.formSubmitHandler();
    }
    formSubmitHandler() {
        this.mainForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            this.loader.show();
            let result;
            let start = Date.now();
            try {
                this.resetHeaders();
                this.resetResponse();
                this.resetStatus();
                this.resetSize();
                this.resetTime();
                const mainForm = event.target;
                const inputs = mainForm.elements;
                const url = inputs.namedItem("url").value;
                const method = inputs.namedItem("method").value;
                if (url === "")
                    throw new _error__WEBPACK_IMPORTED_MODULE_1__["default"]("Please enter a valid url.", 422);
                const query = this.setQuery();
                let headers = this.setHeaders();
                const auth = this.setAuth();
                if (auth !== "") {
                    headers["Authorization"] = auth;
                }
                const data = this.setBodyData();
                const body = JSON.stringify({
                    method: method,
                    url: `${url}${query}`,
                    headers,
                    data: ["GET", "HEAD"].includes(method) ? null : data
                });
                const response = await fetch(_config__WEBPACK_IMPORTED_MODULE_0__.API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body
                });
                result = await response.json();
                result.time = Date.now() - start;
                this.displayResult(result);
            }
            catch (error) {
                result = this.errorToResult(error);
                result.time = Date.now() - start;
                this.displayResult(result);
            }
            finally {
                this.loader.hide();
            }
        });
    }
    setQuery() {
        const queryForm = document.forms.namedItem("query");
        const queryParameters = queryForm?.querySelectorAll(".group_input");
        let query = "";
        queryParameters.forEach((queryParameter, index) => {
            const parameter = queryParameter.querySelector(`.inputName`)?.value;
            const value = queryParameter.querySelector(`.inputValue`)?.value;
            if (parameter !== "" && value !== "")
                query += `${index > 0 ? "&" : "?"}${parameter}=${value}`;
        });
        return query;
    }
    setHeaders() {
        const headersForm = document.forms.namedItem("headers");
        const headersParameters = headersForm?.querySelectorAll(".group_input");
        let headers = {};
        headersParameters.forEach(headersParameter => {
            const header = headersParameter.querySelector(`.inputName`)?.value;
            const value = headersParameter.querySelector(`.inputValue`)?.value;
            if (header !== "" && value !== "")
                headers[header] = value;
        });
        return headers;
    }
    setAuth() {
        const authForm = document.forms.namedItem("auth");
        const authParameters = authForm?.querySelector(".group_input");
        let auth = "";
        const parameter = authParameters.querySelector(`.inputName`)?.value;
        const value = authParameters.querySelector(`.inputValue`)?.value;
        if (parameter !== "" && value !== "")
            auth = `${parameter} ${value}`;
        return auth;
    }
    setBodyData() {
        const forms = document.querySelectorAll("#body form");
        const form = [...forms].filter((form) => form.closest(`.content[data-target="body"]`).style.display === "flex");
        const bodyType = form[0]?.closest(`.content[data-target="body"]`)?.id;
        const parameters = form[0]?.querySelectorAll(".group_input");
        let data = "";
        switch (bodyType) {
            case "json":
                const value = parameters[0].querySelector(`.inputValue`)?.value;
                data = JSON.stringify(value);
                break;
            case "formEncoded":
                parameters.forEach((parameter, index) => {
                    const name = parameter.querySelector(`.inputName`)?.value;
                    const value = parameter.querySelector(`.inputValue`)?.value;
                    if (name !== "" && value !== "")
                        data += `${index > 0 ? "&" : ""}${name}=${value}`;
                });
                break;
        }
        return data;
    }
    resetResponse() {
        this.response.innerText = "";
    }
    resetHeaders() {
        this.headers.innerText = "";
    }
    resetStatus() {
        this.status.innerText = "";
    }
    setStatus(code) {
        this.status.innerText = code;
        this.status.style.color = code.startsWith("2") ? "green" : "red";
    }
    resetSize() {
        this.size.innerText = "";
    }
    setSize(size) {
        this.size.innerText = size;
        this.size.style.color = size.startsWith("0") ? "red" : "green";
    }
    resetTime() {
        this.time.innerText = "";
    }
    setTime(time) {
        this.time.innerText = time;
        this.time.style.color = time.startsWith("0") ? "red" : "green";
    }
    displayResult(result) {
        const headersHtml = this.jsonParser.parse(JSON.stringify(result.headers));
        this.headers.innerHTML = headersHtml;
        this.setStatus(result.status.toString());
        this.setSize(this.getResponseSize(result));
        this.setTime(`${result.time} ms`);
        const responseHtml = this.jsonParser.parse(result.body);
        if ((0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isJsonString)(result.body))
            this.response.innerHTML = responseHtml;
        else if (result.body.toLowerCase().trim().startsWith("<!doctype html>"))
            this.response.appendChild(this.displayIframe(result.body));
        else
            this.response.innerText = result.body;
        this.jsonParser.eventListener();
    }
    displayIframe(html) {
        const iframe = document.createElement("iframe");
        iframe.srcdoc = html;
        return iframe;
    }
    errorToResult(error) {
        return {
            status: error instanceof _error__WEBPACK_IMPORTED_MODULE_1__["default"] ? error.code : 0,
            headers: {},
            body: JSON.stringify({
                success: false,
                error: {
                    name: error instanceof Error
                        ? error.name
                        : "UnknownError",
                    message: error instanceof Error
                        ? error.message
                        : String(error),
                    stack: error instanceof Error
                        ? error.stack
                        : undefined
                }
            }, null, 4)
        };
    }
    getResponseSize(result) {
        return `${new Blob([result.body]).size ?? 0} bytes`;
    }
}


/***/ },

/***/ "./src/client/ts/components/tabs.ts"
/*!******************************************!*\
  !*** ./src/client/ts/components/tabs.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tabs)
/* harmony export */ });
class Tabs {
    tabContainers;
    constructor() {
        this.tabContainers = document.querySelectorAll(".tabs");
        this.eventListeners();
    }
    eventListeners() {
        this.tabContainers?.forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll(".tab");
            const contents = document.querySelectorAll(`.content[data-target="${tabContainer.dataset.target}"]`);
            tabs.forEach(tab => {
                tab.addEventListener("click", _ => {
                    contents.forEach(content => content.style.display = "none");
                    tabs.forEach(tab => tab.classList.remove("active"));
                    const content = [...contents].filter(content => content.id === tab.dataset.for)[0];
                    content.style.display = "flex";
                    tab.classList.add("active");
                });
            });
        });
    }
}


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
/*!*******************************!*\
  !*** ./src/client/ts/main.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/main.scss */ "./src/client/scss/main.scss");
/* harmony import */ var _components_rows__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/rows */ "./src/client/ts/components/rows.ts");
/* harmony import */ var _components_synapse__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/synapse */ "./src/client/ts/components/synapse.ts");
/* harmony import */ var _components_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/tabs */ "./src/client/ts/components/tabs.ts");




window.onload = () => {
    new _components_tabs__WEBPACK_IMPORTED_MODULE_3__["default"]();
    new _components_rows__WEBPACK_IMPORTED_MODULE_1__["default"]();
    new _components_synapse__WEBPACK_IMPORTED_MODULE_2__["default"]();
};

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
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
// Source - https://stackoverflow.com/a/3710226
// Posted by Gumbo, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-18, License - CC BY-SA 4.0
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
            console.log(error);
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

/***/ "./src/client/ts/components/synapse.ts"
/*!*********************************************!*\
  !*** ./src/client/ts/components/synapse.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Synapse)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/client/ts/components/helpers.ts");
/* harmony import */ var _jsonparser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./jsonparser */ "./src/client/ts/components/jsonparser.ts");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loader */ "./src/client/ts/components/loader.ts");



class Synapse {
    jsonParser;
    mainForm;
    response;
    headers;
    status;
    loader;
    constructor() {
        this.jsonParser = new _jsonparser__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.mainForm = document.forms[0];
        this.response = document.getElementById("response");
        this.headers = document.getElementById("headers");
        this.status = document.getElementById("status");
        this.loader = new _loader__WEBPACK_IMPORTED_MODULE_2__["default"]();
        this.formSubmitHandler();
    }
    formSubmitHandler() {
        this.mainForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            this.loader.show();
            try {
                this.resetHeaders();
                this.resetResponse();
                const target = event.target;
                const inputs = target.elements;
                const url = inputs.namedItem("url").value;
                const method = inputs.namedItem("method").value;
                const response = await fetch("http://localhost:3000/proxy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        method: method,
                        url: url
                    })
                });
                const result = await response.json();
                const headersHtml = this.jsonParser.parse(JSON.stringify(result.headers));
                const responseHtml = this.jsonParser.parse(result.body);
                this.headers.innerHTML = headersHtml;
                this.status.innerHTML = result.status;
                if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isJsonString)(result.body))
                    this.response.innerHTML = responseHtml;
                else
                    this.response.innerText = responseHtml;
                this.jsonParser.eventListener();
            }
            catch (error) {
                console.log(error);
            }
            finally {
                this.loader.hide();
            }
        });
    }
    resetResponse() {
        this.response.innerText = "";
    }
    resetHeaders() {
        this.headers.innerText = "";
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
    tabs;
    contents;
    constructor() {
        this.tabs = document.querySelectorAll(".tab");
        this.contents = document.querySelectorAll(".content");
        this.eventListeners();
    }
    eventListeners() {
        this.tabs?.forEach(tab => {
            tab.addEventListener("click", _ => {
                this.contents.forEach(content => content.style.display = "none");
                this.tabs.forEach(tab => tab.classList.remove("active"));
                const content = [...this.contents].filter(content => content.id === tab.dataset.for)[0];
                content.style.display = "block";
                tab.classList.add("active");
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
/* harmony import */ var _components_synapse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/synapse */ "./src/client/ts/components/synapse.ts");
/* harmony import */ var _components_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/tabs */ "./src/client/ts/components/tabs.ts");



window.onload = () => {
    new _components_synapse__WEBPACK_IMPORTED_MODULE_1__["default"]();
    new _components_tabs__WEBPACK_IMPORTED_MODULE_2__["default"]();
};

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
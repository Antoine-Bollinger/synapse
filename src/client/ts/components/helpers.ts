export const chevronRight: string = `<i class="fa-solid fa-caret-right"></i>`
export const chevronDown: string = `<i class="fa-solid fa-caret-down"></i>`

export const escapeHtml = (str: string): string => {
    const div = document.createElement("div")
    div.textContent = str
    return div.innerHTML
}

export const jsonToHtmlList = (data: any, label?: string): string => {
    const hasChildren = data !== null && typeof data === "object"

    // Object
    if (hasChildren && !Array.isArray(data)) {
        const content = Object.entries(data)
            .map(([key, value]) => jsonToHtmlList(value, key))
            .join("")

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
        `
    }

    // Array
    if (Array.isArray(data)) {
        const content = data
            .map((item, index) => jsonToHtmlList(item, `${index}`))
            .join("")

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
        `
    }

    // Primitive value
    return `
        <li class="json-value">
            <span class="json-label">${escapeHtml(label || "")}</span><span>${label ? ": " : ""}</span><q class="${data === null ? "null" : typeof data}">${escapeHtml(String(data))}</q>
        </li>
    `
}

// Source - https://stackoverflow.com/a/3710226
// Posted by Gumbo, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-18, License - CC BY-SA 4.0

export const isJsonString = (text: string): boolean => {
    try {
        JSON.parse(text);
    } catch (e) {
        return false;
    }
    return true;
}

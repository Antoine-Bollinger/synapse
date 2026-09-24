import { chevronDown, chevronRight, jsonToHtmlList } from "./helpers"
import Popup from "./popup"

export default class JSONParser {
    frame: HTMLElement
    popup: Popup

    constructor() {
        this.frame = document.getElementById("frame") as HTMLDivElement
        this.popup = new Popup()
    }

    parse(jsonString: string): string {
        let html = jsonString
        try {
            const jsonObject = JSON.parse(jsonString)

            html = `
                    <ul class="json-root">
                        ${jsonToHtmlList(jsonObject)}
                    </ul>
                `
        } catch (error: unknown) {
            html = String(error)
        }
        return html
    }

    eventListener() {
        document.addEventListener("click", (event: MouseEvent) => {
            const listener = (event.target as HTMLElement).closest(".json-toggle")
            const header = (event.target as HTMLElement).closest(".json-header")

            if (!listener) return

            const node = header?.parentElement
            const children = node?.querySelector(":scope > .json-children")
            const toggle = header?.querySelector(".json-toggle")

            if (!children || !toggle) return

            node?.classList.toggle("children-collapsed")
            children.classList.toggle("collapsed")
            toggle.innerHTML = children.classList.contains("collapsed")
                ? chevronRight
                : chevronDown
        })

        const contexts: NodeListOf<HTMLElement> = document.querySelectorAll(".context")
        contexts.forEach((context) => {
            context.addEventListener("mouseenter", _ => {
                const rect = context.getBoundingClientRect()
                this.popup.openPopup(rect)
            })
            context.addEventListener("mouseout", _ => {
                this.popup.closePopup()
            })
            context.addEventListener("click", async (event: MouseEvent) => {
                const target = event.target as HTMLElement
                if (!target.classList.contains("context")) return
                const data = decodeURIComponent(target.dataset.data || "")
                await navigator.clipboard.writeText(data)
                this.popup.successPopup(`<i class="fa-solid fa-check" style="color:green;text-shadow: 0 0 2px #fff;"></i> Copied!`)
            })
        })
    }
}
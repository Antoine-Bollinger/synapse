export default class Tabs {
    tabs: NodeListOf<HTMLElement>
    contents: NodeListOf<HTMLElement>

    constructor() {
        this.tabs = document.querySelectorAll(".tab")
        this.contents = document.querySelectorAll(".content")
        this.eventListeners()
    }

    eventListeners() {
        this.tabs?.forEach(tab => {
            tab.addEventListener("click", _ => {
                this.contents.forEach(content => content.style.display = "none")
                this.tabs.forEach(tab => tab.classList.remove("active"))
                const content = [...this.contents].filter(content => content.id === tab.dataset.for)[0]
                content.style.display = "block"
                tab.classList.add("active")
            })
        })
    }
}
export default class Tabs {
    tabContainers: NodeListOf<HTMLElement>

    constructor() {
        this.tabContainers = document.querySelectorAll(".tabs")
        this.eventListeners()
    }

    eventListeners() {
        this.tabContainers?.forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll(".tab") as NodeListOf<HTMLElement>
            const contents = document.querySelectorAll(`.content[data-target="${tabContainer.dataset.target}"]`) as NodeListOf<HTMLElement>
            tabs.forEach(tab => {
                tab.addEventListener("click", _ => {
                    contents.forEach(content => content.style.display = "none")
                    tabs.forEach(tab => tab.classList.remove("active"))
                    const content = [...contents].filter(content => content.id === tab.dataset.for)[0]
                    content.style.display = "flex"
                    tab.classList.add("active")
                })
            })
        })
    }
}
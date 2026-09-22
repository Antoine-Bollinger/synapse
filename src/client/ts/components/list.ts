export default class List {
    addRows: NodeListOf<HTMLDivElement>

    constructor() {
        this.addRows = document.querySelectorAll(".add_row")
        this.eventListeners()
    }

    eventListeners() {
        this.addRows.forEach((addRow: HTMLDivElement) => {
            addRow.addEventListener("click", (event: MouseEvent) => {
                event.preventDefault()
                const templateId = addRow.dataset.template
                const template = document.getElementById(templateId as string)?.innerHTML
                addRow.insertAdjacentHTML("beforebegin", template || "")
            })
        })
    }

}
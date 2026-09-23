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
                this.removeListeners()
            })
        })
    }

    removeListeners() {
        const removers = document.querySelectorAll(".remover") as NodeListOf<HTMLButtonElement>
        removers.forEach(remover => {
            remover.addEventListener("click", (event: MouseEvent) => {
                event.preventDefault()
                const target = event.target as HTMLButtonElement
                const rowToRemove = target.closest(".group_input")
                rowToRemove?.remove()
            })
        })
    }
}
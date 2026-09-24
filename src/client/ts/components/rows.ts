export default class Rows {
    queries: NodeListOf<HTMLDivElement>
    addRows: NodeListOf<HTMLDivElement>

    constructor() {
        this.queries = document.querySelectorAll(`.content[data-target="query"]`)
        this.addRows = document.querySelectorAll(".add_row")
        this.eventListeners()
        this.removeListeners()
        this.notificationListeners()
        this.addNotification()
    }

    eventListeners() {
        this.addRows.forEach((addRow: HTMLDivElement) => {
            addRow.addEventListener("click", (event: MouseEvent) => {
                event.preventDefault()
                const templateId = addRow.dataset.template
                const template = document.getElementById(templateId as string)?.innerHTML
                addRow.insertAdjacentHTML("beforebegin", template || "")
                this.removeListeners()
                this.notificationListeners()
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
                const section = target.closest(`.content[data-target="query"]`)
                rowToRemove?.remove()
                this.addNotification()
                this.notificationListeners()
            })
        })
    }

    notificationListeners() {
        this.queries.forEach(query => {
            const inputs = query.querySelectorAll(".inputName, .inputValue")
            inputs.forEach(input => {
                input.addEventListener("change", event => {
                    const target = event.target as HTMLInputElement
                    const section = target.closest(`.content[data-target="query"]`)
                    this.addNotification()
                })
            })
        })
    }

    addNotification() {
        const sections = document.querySelectorAll(`.content[data-target="query"]`)
        sections.forEach(section => {
            const inputs = section?.querySelectorAll(".group_input") as NodeListOf<HTMLElement>
            let notification = 0
            inputs?.forEach(input => {
                const name = input.querySelector(".inputName") as HTMLInputElement
                const value = input.querySelector(".inputValue") as HTMLInputElement
                notification += (name.value !== "" && value.value !== "") ? 1 : 0
            })
            const notificationSpan = document.querySelector(`ul.tabs[data-target="query"] li.tab[data-for="${section?.id}"] sup`)
            notificationSpan!.innerHTML = `${notification === 0 ? "" : notification}`
        })
    }
}
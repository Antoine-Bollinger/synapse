export default class Loader {
    loader: HTMLElement
    constructor() {
        this.loader = document.getElementById("loader") as HTMLElement
    }

    show() {
        this.loader.style.visibility = "visible"
    }

    hide() {
        this.loader.style.visibility = "hidden"
    }
}
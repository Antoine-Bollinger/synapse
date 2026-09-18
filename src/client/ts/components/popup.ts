export default class Popup {
    popup: HTMLElement
    popupContent: HTMLElement
    defaultText: string = `<i class="fa-regular fa-copy"></i> Click to copy`

    constructor() {
        this.popup = document.querySelector(".popup") as HTMLElement
        this.popupContent = document.querySelector(".popup-content") as HTMLElement
        this.setPopup(this.defaultText)
    }

    setPopup(text: string): void {
        this.popupContent.innerHTML = text
    }

    openPopup({ top, left, width }: { top: number, left: number, width: number }) {
        this.popup.style.display = "block"
        const rect = this.popup.getBoundingClientRect()
        this.popup.style.top = `${top - rect.height - 5}px`
        this.popup.style.left = `${left - (rect.width - width) / 2}px`
    }

    closePopup() {
        this.popup.style.display = "none"
        this.setPopup(this.defaultText)
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

    successPopup(text: string) {
        this.setPopup(text)
        this.blinkPopup()
        setTimeout(() => {
            this.setPopup(this.defaultText)
        }, 500);
    }
}
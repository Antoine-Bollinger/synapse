import { HeadersType } from "../../types/headers"
import { API_URL } from "./config"
import { isJsonString } from "./helpers"
import JSONParser from "./jsonparser"
import Loader from "./loader"

export default class Synapse {
    jsonParser: JSONParser
    mainForm: HTMLFormElement
    response: HTMLDivElement
    headers: HTMLDivElement
    status: HTMLElement
    loader: Loader

    constructor() {
        this.jsonParser = new JSONParser()
        this.mainForm = document.forms[0]
        this.response = document.getElementById("response") as HTMLDivElement
        this.headers = document.querySelector("article #headers") as HTMLDivElement
        this.status = document.getElementById("status") as HTMLElement
        this.loader = new Loader()
        this.formSubmitHandler()
    }

    formSubmitHandler() {
        this.mainForm.addEventListener("submit", async (event) => {
            event.preventDefault()
            this.loader.show()
            try {
                this.resetHeaders()
                this.resetResponse()
                this.resetStatus()

                const mainForm = event.target as HTMLFormElement
                const inputs = mainForm.elements as HTMLFormControlsCollection

                const url = (inputs.namedItem("url") as HTMLInputElement).value
                const method = (inputs.namedItem("method") as HTMLInputElement).value

                let headers: HeadersType = this.setHeaders()

                const auth = this.setAuth()
                if (auth !== "") {
                    headers["Authorization"] = auth
                }

                const data = this.setBodyData()

                const body = JSON.stringify({
                    method: method,
                    url: url,
                    headers,
                    data: ["GET", "HEAD"].includes(method) ? null : data
                })

                console.log(body)

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body
                });

                const result = await response.json()

                console.log(result)

                const headersHtml = this.jsonParser.parse(JSON.stringify(result.headers))
                const responseHtml = this.jsonParser.parse(result.body)
                this.headers.innerHTML = headersHtml
                this.setStatus(result.status.toString())

                if (isJsonString(result.body))
                    this.response.innerHTML = responseHtml
                else
                    this.response.innerText = responseHtml
                this.jsonParser.eventListener()
            } catch (error) {
                console.log(error)
            } finally {
                this.loader.hide()
            }
        })
    }

    setBodyData(): string {
        const bodyForm = document.forms.namedItem("body")
        const bodyParameters = bodyForm?.querySelectorAll(".group_input") as NodeListOf<HTMLElement>
        let data: string = ""
        bodyParameters.forEach((bodyParameter, index) => {
            const parameter = (bodyParameter.querySelector(`.inputName`) as HTMLInputElement)?.value
            const value = (bodyParameter.querySelector(`.inputValue`) as HTMLInputElement)?.value
            data += `${index > 0 ? "&" : ""}${parameter}=${value}`
        })
        return data
    }

    setAuth(): string {
        const authForm = document.forms.namedItem("auth")
        const authParameters = authForm?.querySelector(".group_input") as HTMLElement
        const parameter = (authParameters.querySelector(`.inputName`) as HTMLSelectElement)?.value
        const value = (authParameters.querySelector(`.inputValue`) as HTMLInputElement)?.value
        const auth = `${parameter} ${value}`
        return auth
    }

    setHeaders(): HeadersType {
        const headersForm = document.forms.namedItem("headers")
        const headersParameters = headersForm?.querySelectorAll(".group_input") as NodeListOf<HTMLElement>
        let headers: HeadersType = {}
        headersParameters.forEach(headersParameter => {
            const header = (headersParameter.querySelector(`.inputName`) as HTMLInputElement)?.value
            const value = (headersParameter.querySelector(`.inputValue`) as HTMLInputElement)?.value
            if (header !== "" && value !== "")
                headers[header] = value
        })
        return headers
    }

    resetResponse() {
        this.response.innerText = ""
    }

    resetHeaders() {
        this.headers.innerText = ""
    }

    resetStatus() {
        this.status.innerText = ""
    }

    setStatus(code: string) {
        this.status.innerText = code
        this.status.style.color = code.startsWith("2") ? "green" : "red"
    }
}
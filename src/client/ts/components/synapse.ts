import { ApiResponse } from "../../types/apiResponse"
import { HeadersType } from "../../types/headers"
import { API_URL } from "./config"
import CustomError from "./error"
import { isJsonString } from "./helpers"
import JSONParser from "./jsonparser"
import Loader from "./loader"

export default class Synapse {
    jsonParser: JSONParser
    mainForm: HTMLFormElement
    response: HTMLDivElement
    headers: HTMLDivElement
    status: HTMLElement
    size: HTMLElement
    time: HTMLElement
    loader: Loader

    constructor() {
        this.jsonParser = new JSONParser()
        this.mainForm = document.forms[0]
        this.response = document.getElementById("response") as HTMLDivElement
        this.headers = document.querySelector("article #headers") as HTMLDivElement
        this.status = document.getElementById("status") as HTMLElement
        this.size = document.getElementById("size") as HTMLElement
        this.time = document.getElementById("time") as HTMLElement
        this.loader = new Loader()
        this.formSubmitHandler()
    }

    private formSubmitHandler() {
        this.mainForm.addEventListener("submit", async (event) => {
            event.preventDefault()
            this.loader.show()
            let result: ApiResponse
            let start = Date.now()
            try {
                this.resetHeaders()
                this.resetResponse()
                this.resetStatus()
                this.resetSize()
                this.resetTime()

                const mainForm = event.target as HTMLFormElement
                const inputs = mainForm.elements as HTMLFormControlsCollection

                const url = (inputs.namedItem("url") as HTMLInputElement).value
                const method = (inputs.namedItem("method") as HTMLInputElement).value

                if (url === "")
                    throw new CustomError("Please enter a valid url.", 422)

                const query = this.setQuery()

                let headers: HeadersType = this.setHeaders()

                const auth = this.setAuth()
                if (auth !== "") {
                    headers["Authorization"] = auth
                }

                const data = this.setBodyData()

                const body = JSON.stringify({
                    method: method,
                    url: `${url}${query}`,
                    headers,
                    data: ["GET", "HEAD"].includes(method) ? null : data
                })

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body
                })
                result = await response.json()
                result.time = Date.now() - start
                this.displayResult(result)
            } catch (error) {
                result = this.errorToResult(error)
                result.time = Date.now() - start
                this.displayResult(result)
            } finally {
                this.loader.hide()
            }
        })
    }

    private setQuery(): string {
        const queryForm = document.forms.namedItem("query")
        const queryParameters = queryForm?.querySelectorAll(".group_input") as NodeListOf<HTMLElement>
        let query = ""
        queryParameters.forEach((queryParameter, index) => {
            const parameter = (queryParameter.querySelector(`.inputName`) as HTMLInputElement)?.value
            const value = (queryParameter.querySelector(`.inputValue`) as HTMLInputElement)?.value
            if (parameter !== "" && value !== "")
                query += `${index > 0 ? "&" : "?"}${parameter}=${value}`
        })
        return query
    }

    private setHeaders(): HeadersType {
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

    private setAuth(): string {
        const authForm = document.forms.namedItem("auth")
        const authParameters = authForm?.querySelector(".group_input") as HTMLElement
        let auth = ""
        const parameter = (authParameters.querySelector(`.inputName`) as HTMLSelectElement)?.value
        const value = (authParameters.querySelector(`.inputValue`) as HTMLInputElement)?.value
        if (parameter !== "" && value !== "")
            auth = `${parameter} ${value}`
        return auth
    }

    private setBodyData(): string {
        const forms = document.querySelectorAll("#body form") as NodeListOf<HTMLFormElement>
        const form = [...forms].filter((form) => (form.closest(`.content[data-target="body"]`) as HTMLFormElement).style.display === "flex")
        const bodyType = form[0]?.closest(`.content[data-target="body"]`)?.id
        const parameters = form[0]?.querySelectorAll(".group_input") as NodeListOf<HTMLElement>
        let data: string = ""
        switch (bodyType) {
            case "json":
                const value = (parameters[0].querySelector(`.inputValue`) as HTMLInputElement)?.value
                data = JSON.stringify(value)
                break
            case "formEncoded":
                parameters.forEach((parameter, index) => {
                    const name = (parameter.querySelector(`.inputName`) as HTMLInputElement)?.value
                    const value = (parameter.querySelector(`.inputValue`) as HTMLInputElement)?.value
                    if (name !== "" && value !== "")
                        data += `${index > 0 ? "&" : ""}${name}=${value}`
                })
                break
        }
        return data
    }

    private resetResponse() {
        this.response.innerText = ""
    }

    private resetHeaders() {
        this.headers.innerText = ""
    }

    private resetStatus() {
        this.status.innerText = ""
    }

    private setStatus(code: string) {
        this.status.innerText = code
        this.status.style.color = code.startsWith("2") ? "green" : "red"
    }

    private resetSize() {
        this.size.innerText = ""
    }

    private setSize(size: string) {
        this.size.innerText = size
        this.size.style.color = size.startsWith("0") ? "red" : "green"
    }

    private resetTime() {
        this.time.innerText = ""
    }

    private setTime(time: string) {
        this.time.innerText = time
        this.time.style.color = time.startsWith("0") ? "red" : "green"
    }

    private displayResult(result: ApiResponse): void {
        const headersHtml = this.jsonParser.parse(
            JSON.stringify(result.headers)
        )

        this.headers.innerHTML = headersHtml

        this.setStatus(result.status.toString())
        this.setSize(this.getResponseSize(result))
        this.setTime(`${result.time} ms`)

        const responseHtml = this.jsonParser.parse(result.body)

        if (isJsonString(result.body))
            this.response.innerHTML = responseHtml
        else
            this.response.innerText = result.body

        this.jsonParser.eventListener()
    }

    private errorToResult(error: unknown): ApiResponse {
        return {
            status: error instanceof CustomError ? error.code : 0,
            headers: {},
            body: JSON.stringify({
                success: false,
                error: {
                    name: error instanceof Error
                        ? error.name
                        : "UnknownError",
                    message: error instanceof Error
                        ? error.message
                        : String(error),
                    stack: error instanceof Error
                        ? error.stack
                        : undefined
                }
            }, null, 4)
        }
    }

    private getResponseSize(result: ApiResponse): string {
        return `${new Blob([result.body]).size ?? 0} bytes`
    }
}
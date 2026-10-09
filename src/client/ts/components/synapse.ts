import ApiClient from "../../types/apiClient"
import { HeadersType } from "../../types/headers"
import { ProxyResponse } from "../../types/proxyResponse"
import { API_URL } from "./config"
import CustomError from "../../types/customError"
import { contentType, isJsonString } from "./helpers"
import JSONParser from "./jsonparser"
import Loader from "./loader"

export default class Synapse {
    body: string = ""
    jsonParser: JSONParser
    mainForm: HTMLFormElement
    response: HTMLDivElement
    headers: HTMLDivElement
    code: HTMLDivElement
    status: HTMLElement
    size: HTMLElement
    time: HTMLElement
    loader: Loader

    constructor() {
        this.jsonParser = new JSONParser()
        this.mainForm = document.forms[0]
        this.response = document.getElementById("response") as HTMLDivElement
        this.headers = document.querySelector("article #headers") as HTMLDivElement
        this.code = document.querySelector("article #code") as HTMLDivElement
        this.status = document.getElementById("status") as HTMLElement
        this.size = document.getElementById("size") as HTMLElement
        this.time = document.getElementById("time") as HTMLElement
        this.loader = new Loader()
        this.formSubmitHandler()
        this.documentHandler()
    }

    private documentHandler(): void {
        const handleInteraction = (event: Event): void => {
            this.body = this.setBody()
            this.resetCode()
            this.code.innerHTML = this.jsonParser.parse(this.body)
        }
        document.addEventListener("change", handleInteraction)
        document.addEventListener("focusin", handleInteraction)
        document.addEventListener("focusout", handleInteraction)
        document.addEventListener("keyup", handleInteraction)
        document.addEventListener("click", handleInteraction)
    }

    private formSubmitHandler(): void {
        this.mainForm.addEventListener("submit", async (event) => {
            event.preventDefault()
            const start = Date.now()
            this.loader.show()
            this.resetAll()
            let result: ProxyResponse
            try {
                result = await ApiClient.post<ProxyResponse>(this.setBody())
            } catch (error) {
                result = this.errorToResult(error)
            } finally {
                this.loader.hide()
            }
            result.time = Date.now() - start
            this.displayResult(result)
        })
    }

    private setBody(): string {
        const inputs = this.mainForm.elements as HTMLFormControlsCollection

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

        return body
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
        const { bodyType } = this.getBodyTypeAndParameters()
        const contentTypeValue = contentType(bodyType)
        if (contentTypeValue !== "")
            headers["Content-Type"] = contentTypeValue

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

    private setBodyData(): string | FormData {
        const { bodyType, parameters } = this.getBodyTypeAndParameters()
        let data: string | FormData = ""
        switch (bodyType) {
            case "json":
                const value = (parameters[0].querySelector(`.inputValue`) as HTMLInputElement)?.value
                data = JSON.stringify(value)
                break
            case "form":
                data = new FormData()
                parameters.forEach(parameter => {
                    const name = (parameter.querySelector(`.inputName`) as HTMLInputElement)?.value
                    const value = (parameter.querySelector(`.inputValue`) as HTMLInputElement)?.value
                    if (name !== "" && value !== "")
                        (data as FormData).append(name, value)
                })
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

    private getBodyTypeAndParameters(): {
        bodyType: string,
        parameters: NodeListOf<HTMLElement>
    } {
        const forms = document.querySelectorAll("#body form") as NodeListOf<HTMLFormElement>
        const form = [...forms].filter((form) => (form.closest(`.content[data-target="body"]`) as HTMLFormElement).style.display === "flex")
        const bodyType = form[0]?.closest(`.content[data-target="body"]`)?.id
        const parameters = form[0]?.querySelectorAll(".group_input") as NodeListOf<HTMLElement>

        return {
            bodyType: bodyType ?? "",
            parameters
        }
    }

    private resetResponse(): void {
        this.response.innerText = ""
    }

    private resetHeaders(): void {
        this.headers.innerText = ""
    }

    private resetCode(): void {
        this.code.innerText = ""
    }

    private resetStatus(): void {
        this.status.innerText = ""
    }

    private setStatus(
        code: string
    ): void {
        this.status.innerText = code
        this.status.style.color = code.startsWith("2") ? "green" : "red"
    }

    private resetSize(): void {
        this.size.innerText = ""
    }

    private setSize(
        size: string
    ): void {
        this.size.innerText = size
        this.size.style.color = size.startsWith("0") ? "red" : "green"
    }

    private resetTime(): void {
        this.time.innerText = ""
    }

    private setTime(
        time: string
    ): void {
        this.time.innerText = time
        this.time.style.color = time.startsWith("0") ? "red" : "green"
    }

    private resetAll(): void {
        this.resetResponse()
        this.resetHeaders()
        this.resetCode()
        this.resetStatus()
        this.resetSize()
        this.resetTime()
    }

    private displayResult(
        result: ProxyResponse
    ): void {
        const headersHtml = this.jsonParser.parse(
            JSON.stringify(result.headers, null, 2)
        )

        this.code.innerHTML = this.jsonParser.parse(
            this.body
        )

        this.headers.innerHTML = headersHtml

        this.setStatus(
            result.remoteStatus.toString()
        )

        this.setSize(
            this.getResponseSize(result)
        )

        this.setTime(
            `${result.time ?? 0} ms`
        )

        const trimmedBody =
            result.body.trim()

        if (isJsonString(trimmedBody)) {

            this.response.innerHTML =
                this.jsonParser.parse(trimmedBody)

        } else if (
            trimmedBody
                .toLowerCase()
                .startsWith("<!doctype html>")
        ) {
            this.response.appendChild(
                this.displayIframe(
                    result.body
                )
            )

        } else {
            this.response.innerText =
                result.body
        }

        this.jsonParser.eventListener()
    }

    private displayIframe(
        html: string
    ): HTMLElement {
        const iframe = document.createElement("iframe")
        iframe.srcdoc = html
        return iframe
    }

    private errorToResult(
        error: unknown
    ): ProxyResponse {
        if (error instanceof CustomError) {
            const customError = error as CustomError
            return {
                remoteStatus: customError.status ?? 500,
                remoteOk: false,
                headers: {},
                body: `[${customError.code ?? "UNKNOWN"}] ${customError.message}`
            }
        }

        if (error instanceof Error) {
            return {
                remoteStatus: 500,
                remoteOk: false,
                headers: {},
                body: error.message
            }
        }

        return {
            remoteStatus: 500,
            remoteOk: false,
            headers: {},
            body: "Unknown error"
        }
    }

    private getResponseSize(
        result: ProxyResponse
    ): string {
        return `${new Blob([result.body]).size ?? 0} bytes`
    }
}
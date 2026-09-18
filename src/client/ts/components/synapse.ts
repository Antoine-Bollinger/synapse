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
        this.headers = document.getElementById("headers") as HTMLDivElement
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

                const target = event.target as HTMLFormElement
                const inputs = target.elements as HTMLFormControlsCollection

                const url = (inputs.namedItem("url") as HTMLInputElement).value
                const method = (inputs.namedItem("method") as HTMLInputElement).value

                const response = await fetch("https://synapse-ivory-three.vercel.app/proxy", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        method: method,
                        url: url
                    })
                });

                const result = await response.json()
                const headersHtml = this.jsonParser.parse(JSON.stringify(result.headers))
                const responseHtml = this.jsonParser.parse(result.body)
                this.headers.innerHTML = headersHtml
                this.status.innerHTML = result.status
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

    resetResponse() {
        this.response.innerText = ""
    }

    resetHeaders() {
        this.headers.innerText = ""
    }
}
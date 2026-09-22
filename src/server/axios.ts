import { TIMEOUT_SEC } from "./config";

class Axios {
    /**
     * Create a FormData instance based on an object or a form element.
     */
    createDataForm(
        params: HTMLFormElement | Record<string, any>
    ): FormData {
        if (params instanceof HTMLFormElement) return new FormData(params)

        const data = new FormData()
        for (const key in params) {
            if (params[key] instanceof Blob) {
                data.append(key, params[key], key)
            } else {
                data.append(key, params[key])
            }
        }
        return data
    }

    /**
     * Performs a GET request.
     */
    async get(
        url: string,
        responseType: string = "json"
    ): Promise<any | undefined> {
        return this.ajax(
            url,
            {
                method: "GET",
                signal: this.createAbortSignal()
            },
            responseType
        )
    }

    /**
     * Performs a POST request.
     */
    async post(
        url: string,
        upload: BodyInit = this.createDataForm({})
    ): Promise<any | undefined> {
        return this.ajax(
            url,
            {
                method: "POST",
                body: upload,
                signal: this.createAbortSignal()
            }
        )
    }

    /**
     * Performs a DELETE request.
     */
    async delete(
        url: string,
        upload: BodyInit | null = null
    ): Promise<any | undefined> {
        return this.ajax(
            url,
            {
                method: "DELETE",
                body: upload,
                signal: this.createAbortSignal()
            }
        )
    }

    /**
     * Core AJAX function used by all methods.
     */
    private async ajax(
        url: string,
        requestInit: RequestInit,
        responseType: string = "json",
        retries: number = 3
    ): Promise<any | undefined> {
        try {
            const timeout = (delay: number): Promise<Response> =>
                new Promise((_, reject) =>
                    setTimeout(() => {
                        reject(new Response(`Request took too long! Timeout after ${delay} second`, { status: 500 }));
                    }, delay * 1000)
                )

            const authHeaders: Record<string, string> = url.startsWith("api/") ? {
                "Authorization": localStorage.getItem("token") || "",
                "X-Client-ID": localStorage.getItem("id") || ""
            } : {}

            const res = await Promise.race([
                fetch(url, {
                    headers: {
                        ...authHeaders,
                        ...(requestInit.headers || {})
                    },
                    ...requestInit
                }),
                timeout(TIMEOUT_SEC)
            ])

            let responseData: any
            try {
                responseData = responseType === "json" ? await res.json() : await res.text()
            } catch (parseError) {
                throw new Error(res.statusText || `HTTP error! status: ${res.status}`)
            }

            if (!res.ok) {
                const errorMessage = typeof responseData === "object" && responseData.message
                    ? responseData.message
                    : res.statusText || `HTTP error! status: ${res.status}`;
                throw new Error(errorMessage);
            }

            return responseData
        } catch (err) {
            if (retries === 1) throw err
            return this.ajax(url, requestInit, responseType, retries - 1)
        }
    }

    /**
     * Utility for creating an AbortSignal.
     */
    private createAbortSignal(): AbortSignal {
        const controller = new AbortController()
        return controller.signal
    }
}

export const axios = new Axios()
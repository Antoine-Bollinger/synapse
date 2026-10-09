import CustomError from "./customError"
import type { ApiResponse } from "../../shared/apiResponse"
import { API_TOKEN } from "../ts/components/config"

export default class ApiClient {

    public static async post<T>(
        url: string,
        body: string
    ): Promise<T> {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_TOKEN}`
            },
            body
        })

        const result =
            await response.json() as ApiResponse<T>

        if (!result.success) {

            throw new CustomError(
                result.message,
                result.status,
                result.code
            )

        }

        return result.data

    }

}
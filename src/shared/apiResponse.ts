import { Response } from "express"

export interface ApiSuccess<T = unknown> {
    success: true
    status: number
    data: T
}

export interface ApiFailure {
    success: false
    status: number
    code: string
    message: string
}

export type ApiResponse<T = unknown> =
    | ApiSuccess<T>
    | ApiFailure

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string
    ) {
        super(message)
        this.name = "ApiError"
        Object.setPrototypeOf(this, ApiError.prototype)
    }
}

export function sendSuccess<T>(
    res: Response,
    data: T,
    status = 200
) {
    return res.status(status).json({
        success: true,
        status,
        data
    })
}
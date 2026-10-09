import {
    Request,
    Response,
    NextFunction
} from "express"

import { ApiError } from "../../shared/apiResponse"

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err)

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            success: false,
            status: err.status,
            code: err.code,
            message: err.message
        })
    }

    return res.status(500).json({
        success: false,
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred"
    })
}
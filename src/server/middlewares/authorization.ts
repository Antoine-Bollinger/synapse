import {
    Request,
    Response,
    NextFunction
} from "express"

import { ApiError } from "../../shared/apiResponse"

export function requireToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.method === "OPTIONS") {
        return next()
    }

    const authorization =
        req.get("Authorization")

    if (!authorization) {
        return next(
            new ApiError(
                401,
                "AUTH_MISSING_TOKEN",
                "Missing authorization token"
            )
        )
    }

    const [type, token] =
        authorization.split(" ")

    if (type !== "Bearer" || !token) {
        return next(
            new ApiError(
                401,
                "AUTH_INVALID_FORMAT",
                "Invalid authorization format"
            )
        )
    }

    if (token !== process.env.API_TOKEN) {
        return next(
            new ApiError(
                403,
                "AUTH_INVALID_TOKEN",
                "Invalid token"
            )
        )
    }

    next()
}
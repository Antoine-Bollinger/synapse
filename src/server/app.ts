import express from "express"

import { getAccessToken } from "./components/zohoTokenManager"

import { requireToken } from "./middlewares/authorization"
import { asyncHandler } from "./middlewares/asyncHandler"
import { errorHandler } from "./middlewares/errorHandler"

import { ApiError, sendSuccess } from "../shared/apiResponse"

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    )

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    )

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    )

    next()
})

app.use(requireToken)

app.get(
    "/zoho",
    asyncHandler(async (req, res) => {
        const token =
            await getAccessToken()

        return sendSuccess(res, {
            token
        })
    })
)

app.post(
    "/proxy",
    asyncHandler(async (req, res) => {
        const {
            url,
            method = "GET",
            headers,
            data
        } = req.body ?? {}

        if (
            !url ||
            typeof url !== "string"
        ) {
            throw new ApiError(
                400,
                "INVALID_URL",
                "Missing or invalid 'url'"
            )
        }

        const allowedMethods =
            process.env.ALLOW_METHODS?.split(",") ??
            [
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE"
            ]

        const normalizedMethod =
            method.toUpperCase()

        if (
            !allowedMethods.includes(
                normalizedMethod
            )
        ) {
            throw new ApiError(
                400,
                "UNSUPPORTED_METHOD",
                `Unsupported HTTP method: ${method}`
            )
        }

        try {
            const response = await fetch(
                url,
                {
                    method: normalizedMethod,
                    headers,
                    body: [
                        "GET",
                        "HEAD"
                    ].includes(
                        normalizedMethod
                    )
                        ? undefined
                        : data,
                    signal:
                        AbortSignal.timeout(
                            30000
                        )
                }
            )

            const body =
                await response.text()

            return sendSuccess(res, {
                remoteStatus:
                    response.status,
                remoteOk:
                    response.ok,
                headers:
                    Object.fromEntries(
                        response.headers.entries()
                    ),
                body
            })
        } catch (error) {
            if (
                error instanceof Error &&
                error.name ===
                "TimeoutError"
            ) {
                throw new ApiError(
                    504,
                    "REMOTE_TIMEOUT",
                    "The remote server did not respond in time"
                )
            }

            throw new ApiError(
                502,
                "REMOTE_REQUEST_FAILED",
                error instanceof Error
                    ? error.message
                    : "Failed to contact remote server"
            )
        }
    })
)

app.use(errorHandler)

const port =
    Number(process.env.PORT) || 3000

const server = app.listen(
    port,
    () => {
        console.log(
            `Server running on port ${port}`
        )

        console.log(
            `PID: ${process.pid}`
        )
    }
)

function shutdown() {
    console.log(
        "\nStopping server..."
    )

    server.close(() => {
        console.log(
            "Server stopped."
        )

        process.exit(0)
    })
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
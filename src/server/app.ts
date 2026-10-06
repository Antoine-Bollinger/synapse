import express from "express"
import { getAccessToken } from "./components/zohoTokenManager"
import { requireToken } from "./middlewares/authorization"

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(requireToken)

app.get("/zoho", async (req, res) => {
    const token = await getAccessToken()

    res.json({
        token
    })
})

app.post("/proxy", async (req, res) => {
    const { url, method = "GET", headers, data } = req.body ?? {}

    if (!url || typeof url !== "string") {
        return res.status(400).json({
            error: "Missing or invalid 'url'"
        })
    }

    const allowedMethods = process.env.ALLOW_METHODS?.split(",") ?? ["GET", "POST", "PUT", "PATCH", "DELETE"]

    if (!allowedMethods.includes(method.toUpperCase())) {
        return res.status(400).json({
            error: `Unsupported HTTP method: ${method}`
        })
    }

    try {
        const normalizedMethod = method.toUpperCase()

        const response = await fetch(url, {
            method: normalizedMethod,
            headers,
            body: ["GET", "HEAD"].includes(normalizedMethod)
                ? undefined
                : data,
            signal: AbortSignal.timeout(30_000)
        })

        const text = await response.text()

        return res.json({
            status: response.status,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
            body: text
        })

    } catch (error) {
        console.error("Proxy request failed:", error)

        if (error instanceof Error && error.name === "TimeoutError") {
            return res.status(504).json({
                error: "The remote server did not respond in time"
            })
        }

        return res.status(502).json({
            error: "Failed to contact remote server",
            message: error instanceof Error
                ? error.message
                : "Unknown error"
        })
    }
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    console.log(`PID: ${process.pid}`)
});

function shutdown() {

    console.log("\nStopping server...")

    server.close(() => {
        console.log("Server stopped.")
        process.exit(0)
    });
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
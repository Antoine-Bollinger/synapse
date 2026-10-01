import express from "express"
import { getAccessToken } from "./components/zohoTokenManager"

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.get("/zoho", async (req, res) => {
    const token = await getAccessToken()

    res.json({
        body: token
    })
})

app.post("/proxy", async (req, res) => {
    const { url, method, headers, data } = req.body

    const response = await fetch(url, {
        method,
        headers,
        body: data
    })

    const text = await response.text()

    res.json({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: text
    })
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
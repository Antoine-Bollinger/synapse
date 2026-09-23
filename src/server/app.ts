import express from "express"
// import ServerlessHttp from "serverless-http"

const app = express()

app.use(express.json())
app.use(express.static("public"))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
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

app.listen(3000, () => {
    console.log("Server running on port 3000")
})

// export default ServerlessHttp(app)


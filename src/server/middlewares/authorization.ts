import { Request, Response, NextFunction } from "express"

export const requireToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    const authorization = req.get("Authorization")

    if (!authorization) {
        return res.status(401).json({
            error: "Missing authorization token"
        })
    }

    const [type, token] = authorization.split(" ")

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Invalid authorization format"
        })
    }

    if (token !== process.env.API_TOKEN) {
        return res.status(403).json({
            error: "Invalid token"
        })
    }

    next()
}
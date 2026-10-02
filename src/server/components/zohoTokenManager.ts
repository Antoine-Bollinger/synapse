import { StoredToken } from "../types/token"
import { getToken, saveToken } from "./mongodbTokenStorage"

export const getAccessToken = async (): Promise<string> => {
    let token = await getToken()

    if (!token || isExpired(token)) {
        token = await refreshToken()

        await saveToken(token)
    }

    return token.accessToken
}

const refreshToken = async (): Promise<StoredToken> => {
    const request = await fetch("https://accounts.zoho.eu/oauth/v2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${process.env.REFRESH_TOKEN}`
    })

    const response = await request.json()
    return {
        key: response.key,
        accessToken: response.access_token,
        expiresAt: String(Date.now() + Number(response.expires_in) * 1000)
    }
}

const isExpired = (token: StoredToken): boolean => {
    const safetyMarein = 60 * 1000;
    return Date.now() >= Number(token.expiresAt) - safetyMarein
}
import { getDatabase } from "./mongodb"
import { StoredToken } from "../types/token"

const COLLECTION = "tokens"
const TOKEN_KEY = "zoho"

export async function getToken(): Promise<StoredToken | null> {

    const db = await getDatabase()

    return db
        .collection<StoredToken>(COLLECTION)
        .findOne({
            key: TOKEN_KEY
        })
}

export async function saveToken(
    token: Omit<StoredToken, "key">
): Promise<void> {

    const db = await getDatabase()

    await db.collection<StoredToken>(COLLECTION).updateOne(
        {
            key: TOKEN_KEY
        },
        {
            $set: {
                key: TOKEN_KEY,
                accessToken: token.accessToken,
                expiresAt: token.expiresAt
            }
        },
        {
            upsert: true
        }
    )
}
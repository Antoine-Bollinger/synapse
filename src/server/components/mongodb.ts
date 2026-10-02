import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined")
}

const client = new MongoClient(uri)

let database: Db | null = null

export async function getDatabase(): Promise<Db> {

    if (database) {
        return database
    }

    await client.connect()

    database = client.db("synapse")

    return database
}
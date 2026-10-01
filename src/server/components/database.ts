import { Database } from "sqlite3";
import { StoredToken } from "../types/token";

export default class SQLite {

    private db: Database;

    constructor() {
        this.db = new Database("./db.sqlite");
        this.init();
    }

    private init(): void {

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS zohoToken (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                accessToken TEXT NOT NULL,
                expiresAt TEXT NOT NULL
            )
        `);
    }

    public insertToken(token: StoredToken): Promise<void> {

        return new Promise((resolve, reject) => {

            const sql = `
                INSERT INTO zohoToken (
                    id,
                    accessToken,
                    expiresAt
                )
                VALUES (1, ?, ?)

                ON CONFLICT(id) DO UPDATE SET
                    accessToken = excluded.accessToken,
                    expiresAt = excluded.expiresAt
            `;

            this.db.run(
                sql,
                [
                    token.accessToken,
                    token.expiresAt
                ],
                (error) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );
        });
    }

    public getToken(): Promise<StoredToken | null> {

        return new Promise((resolve, reject) => {

            const sql = `
                SELECT accessToken, expiresAt
                FROM zohoToken
                WHERE id = 1
            `;

            this.db.get<StoredToken>(
                sql,
                (error, row) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(row ?? null);
                }
            );
        });
    }

    public deleteToken(): Promise<void> {

        return new Promise((resolve, reject) => {

            this.db.run(
                "DELETE FROM zohoToken WHERE id = 1",
                (error) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );
        });
    }
}
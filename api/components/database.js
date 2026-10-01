"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = require("sqlite3");
class SQLite {
    db;
    constructor() {
        this.db = new sqlite3_1.Database("./db.sqlite");
        this.init();
    }
    init() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS zohoToken (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                accessToken TEXT NOT NULL,
                expiresAt TEXT NOT NULL
            )
        `);
    }
    insertToken(token) {
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
            this.db.run(sql, [
                token.accessToken,
                token.expiresAt
            ], (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
    getToken() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT accessToken, expiresAt
                FROM zohoToken
                WHERE id = 1
            `;
            this.db.get(sql, (error, row) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(row ?? null);
            });
        });
    }
    deleteToken() {
        return new Promise((resolve, reject) => {
            this.db.run("DELETE FROM zohoToken WHERE id = 1", (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
}
exports.default = SQLite;
//# sourceMappingURL=database.js.map
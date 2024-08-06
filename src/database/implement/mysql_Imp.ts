import { Database } from "..";
import { Client } from "../../driver/mysql";

export class MySqlDatabse implements Database {
    constructor() {
        const mysql = new Client()
        mysql.connect({
            username: '<DATABASE_USER>',
            db: '<DATABASE_NAME>',
            hostname: env.TUNNEL_HOST || 'https://dev.example.com',
            password: env.DATABASE_PASSWORD, // use a secret to store passwords
        })
    }
    saveSapiTicket(sapiTicket: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}
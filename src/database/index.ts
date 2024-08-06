import { MySqlDatabse } from "./implement/mysql_Imp";

export interface Database {
    // 写入sapi_ticket
     saveSapiTicket(sapiTicket:string) : Promise<boolean>
}

export function createDatabase(): Database {
    const dbType = process.env.DATABASE_TYPE;

    if (dbType === 'mysql') {
        return new MySqlDatabse();
    }  else {
        throw new Error(`Unsupported database type: ${dbType}`);
    }
}
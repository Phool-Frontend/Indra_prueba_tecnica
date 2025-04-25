import {createPool} from 'mysql2/promise';
import {environment} from "../enviroments/environment";


export async function createMySQLClient() {
    return createPool({
        host: environment.DB_HOST,
        user: environment.DB_USER,
        password: environment.DB_PASSWORD,
        database: environment.DB_NAME,
        port: environment.DB_PORT
    });
}
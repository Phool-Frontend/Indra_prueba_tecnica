import { Handler } from 'aws-lambda';
import { readFileSync } from 'fs';
import path from "node:path";
import { environment } from "../../enviroments/environment";
import {getSwaggerHtml} from "../../templates/swagger.template";

export const handler: Handler = async () => {
    const swaggerFile = path.join(process.cwd(), 'docs/swagger.json');
    const rawJson = readFileSync(swaggerFile, 'utf8');
    const swaggerJson = JSON.parse(rawJson);

    swaggerJson.servers = [
        {
            url: environment.API_URL,
        }
    ];


    const html = getSwaggerHtml(swaggerJson);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        body: html
    };
};

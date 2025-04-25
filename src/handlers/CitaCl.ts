import { AppointmentCiModel, createApoPeModel } from "../models/AppointmentCiModel";
import {AWS} from "../clients/awsConfigClient";
import {apoPeSchema} from "../schemas/apoPeSchema";

const sqs = new AWS.SQS();
const eventBridge = new AWS.EventBridge();
const SQS_ARN_REGEX = /^arn:aws:sqs:([^:]+):(\d+):([^:]+)$/;

export class CitaClHandler {
    constructor( private readonly apoClModel: AppointmentCiModel) {}

    async processEvent(event: any) {
        console.log("Filtro para CL");

        try {
            for (const record of event.Records) {
                await this.triggerArcangelEvent(record);
                await this.deleteMessageFromQueue(record.eventSourceARN, record.receiptHandle);

                const snsMessage = JSON.parse(record.body);
                const payload = JSON.parse(snsMessage.Message);
                const safeBody = apoPeSchema.parse(payload);
                await this.apoClModel.createCitaCl(safeBody);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ status: 'success' }),
            };
        } catch (error) {
            console.error("Error procesando mensajes SQS:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Error procesando mensajes" }),
            };
        }
    }

    private async triggerArcangelEvent(record: any) {
        const params = {
            Entries: [{
                Source: "phooldx.oneTramo",
                DetailType: "StatusCompleto",
                Detail: JSON.stringify({
                    originalMessage: record.body,
                    metadata: {
                        receiptHandle: record.receiptHandle,
                        queueArn: record.eventSourceARN,
                        timestamp: new Date().toISOString()
                    }
                }),
                EventBusName: "default"
            }]
        };

        const result = await eventBridge.putEvents(params).promise();
        console.log('Evento enviado a EventBridge:', result);
        return result;
    }

    private async deleteMessageFromQueue(queueArn: string, receiptHandle: string) {
        const queueUrl = queueArn.replace(SQS_ARN_REGEX, 'https://sqs.$1.amazonaws.com/$2/$3');
        await sqs.deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle
        }).promise();
    }
}

export async function handler(event: any) {
    try {
        const citaClModelInstance = await createApoPeModel();
        const instance = new CitaClHandler(citaClModelInstance);
        return await instance.processEvent(event);
    } catch (e) {
        console.error("Error en handler:", e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Something went wrong" }),
        };
    }
}
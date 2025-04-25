import {AppointmentPeModel, createApoPeModel} from "../models/AppointmentPeModel";
import {AWS} from "../clients/awsConfigClient";
import {apoPeSchema} from "../schemas/apoPeSchema";


const sqs = new AWS.SQS();
const eventBridge = new AWS.EventBridge();
const SQS_ARN_REGEX = /^arn:aws:sqs:([^:]+):(\d+):([^:]+)$/;


export class CitaPeHandler {
    constructor(
        private readonly apoPeModel: AppointmentPeModel
    ) {}

    async processEvent(event: any) {
        console.log("Filtro para PE");

        for (const record of event.Records) {

            await this.triggerArcangelEvent(record);
            await this.deleteMessageFromQueue(record.eventSourceARN, record.receiptHandle);

            const snsMessage = JSON.parse(record.body);
            const payload = JSON.parse(snsMessage.Message);

            console.log("Datos:", payload);

            const safeBody = apoPeSchema.parse(payload);
            await this.apoPeModel.createCitaPe(safeBody);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({status: 'success'}),
        };
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
        const citaPeModelInstance = await createApoPeModel();
        const instance = new CitaPeHandler(citaPeModelInstance);
        return await instance.processEvent(event);
    } catch (e) {
        console.error("Error en handler:", e);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Something went wrong"}),
        };
    }
}
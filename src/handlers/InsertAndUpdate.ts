import {AppointmentModel, createAppoModel} from "../models/AppointmentModel";
import {appointmentSchema} from "../schemas/appointmentSchema";
import AWS from "aws-sdk";
import {IAppointment} from "../interfaces/appointment";


const sns = new AWS.SNS();


export class InsertAndUpdateHandler {
    constructor(private readonly appoModel: AppointmentModel) {
    }

    async processEvent(event: any) {

        // Manejo de mensajes SQS
        if (event.Records && event.Records[0].eventSource === "aws:sqs") {

            console.log("Mensaje recibido de SQS Arcangel:", event.Records[0]);

            const first = JSON.parse(event.Records[0].body);
            const secund = JSON.parse(first.detail.originalMessage);
            const  payload:IAppointment = JSON.parse(secund.Message)

            await this.appoModel.changeStatusById(payload.id);

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Mensaje de Arcangel procesado",
                    content: JSON.parse(event.Records[0].body),
                }),
            };
        }


        const body = JSON.parse(event.body);
        const safeBody = appointmentSchema.parse(body);
        const book = await this.appoModel.createBook(safeBody);


        // Procesamiento de mensajes SNS
        const {countryISO} = body;
        const topicArn = process.env.SNS_TOPIC_ARN;

        const params = {
            Message: JSON.stringify(book),
            TopicArn: topicArn,
            MessageAttributes: {
                mensajeTipo: {
                    DataType: "String",
                    StringValue: countryISO,
                },
            },
        };

        console.log("Enviando mensaje con atributos >>>>", params);

        const data = await sns.publish(params).promise();

        console.log("Mensaje enviado:", data);

        return {
            statusCode: 200,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: "Mensaje enviado correctamente."}),
        };
    }
}

export async function handler(event: any) {
    try {
        const appoModelInstance = createAppoModel();
        const instance = new InsertAndUpdateHandler(appoModelInstance);
        return await instance.processEvent(event);
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500,
            body: JSON.stringify({method: "Something error"}),
        };
    }
}
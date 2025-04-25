import createDynamoDBClient from "../clients/createDynamoDBClient";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {v4 as uuid} from "uuid";
import {AppointmentBody, IAppointment} from "../interfaces/appointment";
import {environment} from "../enviroments/environment";


const APPOINTMENT_TABLE = environment.TABLA_DYNAMO;

export class AppointmentRepository {
    constructor(private readonly dbClient: DynamoDBClient) {}

    async createAppointment(appoData: AppointmentBody): Promise<IAppointment> {
        const Id = uuid();
        const item = {
            PK: 'Appointment',
            SK: `Appointment#${Id}`,
            insuredId: appoData.insuredId,
            scheduleId: appoData.scheduleId,
            countryISO: appoData.countryISO,
            pending: true
        };

        const command = new PutCommand({
            TableName: APPOINTMENT_TABLE,
            Item: item,
            ReturnValues: 'ALL_OLD'
        })

        await this.dbClient.send(command);
        return this.mapToExternalType(item);
    }

    async getAppointmentById(Id: string): Promise<IAppointment | undefined> {
        const command = new GetCommand({
            TableName: APPOINTMENT_TABLE,
            Key: {
                PK: 'Appointment',
                SK: `Appointment#${Id}`,
            }
        });

        const res = await this.dbClient.send(command);

        return res.Item ? this.mapToExternalType(res.Item) : undefined
    }

    async listAppointment(): Promise<IAppointment[]> {
        const command = new QueryCommand({
            TableName: APPOINTMENT_TABLE,
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
            ExpressionAttributeValues: {
                ":pk": "Appointment",
                ":sk": "Appointment"
            }
        });

        const res = await this.dbClient.send(command);

        const appos =
            res.Items?.map(
                (item) =>
                    this.mapToExternalType(item)
            ) || [];

        return appos;
    }

    async updateBookById(Id: string, appoData: AppointmentBody): Promise<IAppointment | undefined> {
        const command = new UpdateCommand({
            TableName: APPOINTMENT_TABLE,
            Key: {
                PK: 'Appointment',
                SK: `Appointment#${Id}`
            },

            ExpressionAttributeValues: {
                ":insuredId": appoData.insuredId,
                ":scheduleId": appoData.scheduleId,
                ":countryISO": appoData.countryISO,
                ":pending": false,
            },
            UpdateExpression: "SET insuredId = :insuredId, scheduleId = :scheduleId, countryISO = :countryISO, pending = :pending",
            ReturnValues: 'ALL_NEW'
        })

        const res = await this.dbClient.send(command);

        return res.Attributes ? this.mapToExternalType(res.Attributes) : undefined;
    }

    async changeStatusById(Id: string): Promise<IAppointment | undefined> {
        const command = new UpdateCommand({
            TableName: APPOINTMENT_TABLE,
            Key: {
                PK: 'Appointment',
                SK: `Appointment#${Id}`
            },
            UpdateExpression: "SET pending = :pending",
            ExpressionAttributeValues: {":pending": false},
            ReturnValues: 'ALL_NEW'
        });

        const {Attributes} = await this.dbClient.send(command);

        return Attributes ? this.mapToExternalType(Attributes) : undefined;
    }

    private mapToExternalType(internalType: any): IAppointment {
        return {
            id: internalType.SK.replace('Appointment#', ""),
            insuredId: internalType.insuredId,
            scheduleId: internalType.scheduleId,
            countryISO: internalType.countryISO,
            pending: internalType.pending
        }
    }
}

export function createAppoRepository() {
    const dbClient = createDynamoDBClient();
    return new AppointmentRepository(dbClient);
}
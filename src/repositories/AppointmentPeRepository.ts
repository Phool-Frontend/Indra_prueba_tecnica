import {createMySQLClient} from "../clients/createMysqlRDSClient";
import { Connection } from "mysql2/promise";
import {v4 as uuid} from "uuid";
import {IAppointmentPe} from "../interfaces/appointmentPe";
import {AppointmentBody} from "../interfaces/appointment";



export class AppointmentPeRepository {
    constructor(private readonly dbClient:Connection) {}

    async createCitaPe(bookData: AppointmentBody): Promise<IAppointmentPe> {
        const bookId = uuid();
        const appointment: IAppointmentPe = {
            id: bookId,
            insuredId: bookData.insuredId,
            scheduleId: bookData.scheduleId,
            countryISO: bookData.countryISO
        };

        const query = `INSERT INTO appoPe (id, insuredId, scheduleId, countryISO) VALUES (?, ?, ?, ?)`;

        const params = [
            appointment.id,
            appointment.insuredId,
            appointment.scheduleId,
            appointment.countryISO
        ];

        await this.dbClient.execute(query, params);
        return appointment;
    }
}

export async function createApoPeRepository(){
    const dbClient = await createMySQLClient();
    return new AppointmentPeRepository(dbClient);
}

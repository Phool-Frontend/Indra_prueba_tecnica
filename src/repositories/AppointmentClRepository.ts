import {createMySQLClient} from "../clients/createMysqlRDSClient";
import { Connection } from "mysql2/promise";
import {v4 as uuid} from "uuid";
import {IAppointmentCl} from "../interfaces/appointmentPe";
import {AppointmentBody} from "../interfaces/appointment";



export class AppointmentClRepository {
    constructor(private readonly dbClient:Connection) {}

    async createCitaCl(bookData: AppointmentBody): Promise<IAppointmentCl> {
        const bookId = uuid();
        const appointment: IAppointmentCl = {
            id: bookId,
            insuredId: bookData.insuredId,
            scheduleId: bookData.scheduleId,
            countryISO: bookData.countryISO
        };

        const query = `INSERT INTO appoCl (id, insuredId, scheduleId, countryISO) VALUES (?, ?, ?, ?)`;

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
    return new AppointmentClRepository(dbClient);
}

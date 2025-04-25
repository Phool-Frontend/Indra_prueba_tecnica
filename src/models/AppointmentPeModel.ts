import {AppointmentPeRepository, createApoPeRepository} from "../repositories/AppointmentPeRepository";
import {IAppointmentPe} from "../interfaces/appointmentPe";
import {AppointmentBody} from "../interfaces/appointment";

export class AppointmentPeModel {
    constructor(
        private readonly apoPeRepositoryInstance: AppointmentPeRepository
    ){}

    async createCitaPe(bookData:AppointmentBody):Promise<IAppointmentPe> {
        return this.apoPeRepositoryInstance.createCitaPe(bookData);
    }
}

export async function createApoPeModel(){
    const apoPeRepositoryInstance = await createApoPeRepository();
    return new AppointmentPeModel(apoPeRepositoryInstance);
}
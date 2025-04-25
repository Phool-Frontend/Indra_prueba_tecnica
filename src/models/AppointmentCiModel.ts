import {AppointmentClRepository, createApoPeRepository} from "../repositories/AppointmentClRepository";
import {IAppointmentCl} from "../interfaces/appointmentPe";
import {AppointmentBody} from "../interfaces/appointment";

export class AppointmentCiModel {
    constructor(
        private readonly apoClRepositoryInstance: AppointmentClRepository
    ){}

    async createCitaCl(appoData:AppointmentBody):Promise<IAppointmentCl> {
        return this.apoClRepositoryInstance.createCitaCl(appoData);
    }}

export async function createApoPeModel(){
    const apoClRepositoryInstance = await createApoPeRepository();
    return new AppointmentCiModel(apoClRepositoryInstance);
}
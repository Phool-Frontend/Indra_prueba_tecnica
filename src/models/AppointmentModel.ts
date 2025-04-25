import {AppointmentRepository, createAppoRepository} from "../repositories/AppointmentRepository";
import {AppointmentBody, IAppointment} from "../interfaces/appointment";

export class AppointmentModel {
    constructor(private readonly appoRepositoryInstance: AppointmentRepository){}

    async createBook(bookData:AppointmentBody):Promise<IAppointment> {
        return this.appoRepositoryInstance.createAppointment(bookData);
    }

    async getBookById(bookId:string):Promise<IAppointment | undefined> {
      return this.appoRepositoryInstance.getAppointmentById(bookId);
    }

    async listAppointment():Promise<IAppointment[]> {
        return this.appoRepositoryInstance.listAppointment();
    }

    async changeStatusById(Id:string):Promise<IAppointment | undefined> {
        return this.appoRepositoryInstance.changeStatusById(Id);
    }
}

export function createAppoModel(){
    const appoRepositoryInstance = createAppoRepository();
    return new AppointmentModel(appoRepositoryInstance);
}
import {AppointmentModel, createAppoModel} from "../models/AppointmentModel";

class ListAppoHandler {
    constructor(
        private readonly appoModelInstance: AppointmentModel
    ) {}

    async processEvent(event:any){
        const appointment = await this.appoModelInstance.listAppointment();

        return {
            statusCode: 200,
            body: JSON.stringify({ data:appointment }),
        }
    }
}

export async function handler(event:any){
    try{
        const appoModelInstance = createAppoModel();
        const instance = new ListAppoHandler(appoModelInstance);
        return instance.processEvent(event);
    }catch(e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Something issue"}),
        }
    }
}
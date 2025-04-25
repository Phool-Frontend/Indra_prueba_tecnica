import {AppointmentModel, createAppoModel} from "../models/AppointmentModel";

class GetAppoByIdHandler {
    constructor(
        private readonly appoModelInstance: AppointmentModel
    ) {}

    async processEvent(event:any){
        console.log("Event", event);

        const id = event.pathParameters.appoId;

        const appo = await this.appoModelInstance.getBookById(id);


        return {
            statusCode: 200,
            body: JSON.stringify({data:appo}),
        }
    }
}

export async function handler(event:any){
    try{
        const appoModelInstance = createAppoModel();
        const instance = new GetAppoByIdHandler(appoModelInstance);
        return instance.processEvent(event);
    }catch(e) {
        console.log(e);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Something issue"}),
        }
    }
}
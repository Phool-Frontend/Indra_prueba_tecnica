import {z} from "zod";


export const appointmentSchema = z.object({
    insuredId: z.string(),
    scheduleId:z.number(),
    countryISO: z.string()
});
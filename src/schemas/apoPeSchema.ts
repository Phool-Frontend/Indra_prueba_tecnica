import {z} from "zod";

export const apoPeSchema = z.object({
    insuredId: z.string(),
    scheduleId:z.number(),
    countryISO: z.string()
});

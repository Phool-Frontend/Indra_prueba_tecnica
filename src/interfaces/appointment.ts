import {appointmentSchema} from "../schemas/appointmentSchema";
import {z} from "zod";

export interface IAppointment{
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    pending: boolean;
}

export type AppointmentBody = z.infer<typeof appointmentSchema>;
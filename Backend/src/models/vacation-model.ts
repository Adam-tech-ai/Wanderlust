import z from "zod";

import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Vacation Schema:
const VacationSchema = z.object({

    vacationId: z.number().int().positive().optional(),

    destination: z.string().min(1),

    description: z.string().min(1),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    price: z.number().min(0).max(10000),

    imageName: z.string().min(1)

});

// Vacation Interface:
type IVacationModel = z.infer<typeof VacationSchema>;

// Vacation Model:
export class VacationModel implements IVacationModel {

    public vacationId?: number;

    public destination: string;

    public description: string;

    public startDate: Date;

    public endDate: Date;

    public price: number;

    public imageName: string;

    public constructor(vacation: VacationModel) {

        this.vacationId = vacation.vacationId;

        this.destination = vacation.destination;

        this.description = vacation.description;

        this.startDate = new Date(vacation.startDate);

        this.endDate = new Date(vacation.endDate);

        this.price = vacation.price;

        this.imageName = vacation.imageName;
    }

    public validate(): void {

        const result = VacationSchema.safeParse(this);

        if (!result.success) {

            const message =
                result.error.issues[0].path +
                ": " +
                result.error.issues[0].message;

            throw new ClientError(
                StatusCode.UnprocessableContent,
                message
            );
        }
    }
}
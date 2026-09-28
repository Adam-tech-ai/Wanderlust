import { VacationModel } from "./vacation-model";

// Represents vacations response from Backend:
export type VacationsResponseModel = {

    // Vacations of the current page:
    vacations: VacationModel[];

    // Total vacations after filtering:
    totalCount: number;
};
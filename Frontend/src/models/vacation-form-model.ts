// Represents vacation form data:
export type VacationFormModel = {

    // Vacation details:
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;

    // Vacation image:
    image?: FileList;
};
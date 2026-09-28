// Represents a vacation in the system:
export type VacationModel = {

    // Vacation ID:
    vacationId: number;

    // Vacation details:
    destination: string;
    description: string;
    startDate: string;
    endDate: string;
    price: number;
    imageName: string;

    // Likes information:
    likesCount: number;
    isLiked: number;
};
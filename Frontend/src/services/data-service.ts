import axios from "axios";
import { VacationFormModel } from "../models/vacation-form-model";
import { VacationModel } from "../models/vacation-model";
import { VacationReportModel } from "../models/vacation-report-model";
import { VacationsResponseModel } from "../models/vacations-response-model";
import { appConfig } from "../utils/app-config";

class DataService {

    // Get vacations according to filter and page:
    public async getVacations(
        filter: string,
        page: number
    ): Promise<VacationsResponseModel> {

        const response = await axios.get<VacationsResponseModel>(
            appConfig.vacationsUrl,
            { params: { filter, page } }
        );

        return response.data;
    }

    // Get one vacation by ID:
    public async getVacationById(
        vacationId: number
    ): Promise<VacationModel> {

        const response = await axios.get<VacationModel>(
            `${appConfig.vacationsUrl}/${vacationId}`
        );

        return response.data;
    }

    // Get vacations report:
    public async getVacationsReport(): Promise<VacationReportModel[]> {

        const response = await axios.get<VacationReportModel[]>(
            appConfig.reportsUrl
        );

        return response.data;
    }

    // Get AI trip recommendation:
    public async getAiRecommendation(
        destination: string
    ): Promise<string> {

        const response = await axios.post<{ recommendation: string }>(
            appConfig.aiRecommendationUrl,
            { destination }
        );

        return response.data.recommendation;
    }

    // Add like to vacation:
    public async addLike(
        vacationId: number
    ): Promise<void> {

        await axios.post(
            `${appConfig.vacationsUrl}/${vacationId}/likes`
        );
    }

    // Remove like from vacation:
    public async deleteLike(
        vacationId: number
    ): Promise<void> {

        await axios.delete(
            `${appConfig.vacationsUrl}/${vacationId}/likes`
        );
    }

    // Add new vacation:
    public async addVacation(
        vacation: VacationFormModel
    ): Promise<VacationModel> {

        const formData = new FormData();

        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate);
        formData.append("endDate", vacation.endDate);
        formData.append("price", vacation.price.toString());

        if (vacation.image) {
            formData.append("image", vacation.image[0]);
        }

        const response = await axios.post<VacationModel>(
            appConfig.vacationsUrl,
            formData
        );

        return response.data;
    }

    // Update existing vacation:
    public async updateVacation(
        vacationId: number,
        vacation: VacationFormModel
    ): Promise<VacationModel> {

        const formData = new FormData();

        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate);
        formData.append("endDate", vacation.endDate);
        formData.append("price", vacation.price.toString());

        if (vacation.image && vacation.image.length > 0) {
            formData.append("image", vacation.image[0]);
        }

        const response = await axios.put<VacationModel>(
            `${appConfig.vacationsUrl}/${vacationId}`,
            formData
        );

        return response.data;
    }

    // Delete vacation:
    public async deleteVacation(
        vacationId: number
    ): Promise<void> {

        await axios.delete(
            `${appConfig.vacationsUrl}/${vacationId}`
        );
    }
}

export const dataService = new DataService();
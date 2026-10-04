import axios from "axios";
import { VacationFormModel } from "../models/vacation-form-model";
import { VacationModel } from "../models/vacation-model";
import { VacationReportModel } from "../models/vacation-report-model";
import { VacationsResponseModel } from "../models/vacations-response-model";
import { appConfig } from "../utils/app-config";

// Handles Backend data operations:
class DataService {

    // Get vacations according to filter and page:
    public async getVacations(
        filter: string,
        page: number
    ): Promise<VacationsResponseModel> {

        // Send request to Backend:
        const response = await axios.get<VacationsResponseModel>(
            appConfig.vacationsUrl,
            { params: { filter, page } }
        );

        // Return vacations response:
        return response.data;
    }

    // Get one vacation by ID:
    public async getVacationById(
        vacationId: number
    ): Promise<VacationModel> {

        // Send request to Backend:
        const response = await axios.get<VacationModel>(
            `${appConfig.vacationsUrl}/${vacationId}`
        );

        // Return vacation:
        return response.data;
    }

    // Get vacations report:
    public async getVacationsReport(): Promise<VacationReportModel[]> {

        // Send request to Backend:
        const response = await axios.get<VacationReportModel[]>(
            appConfig.reportsUrl
        );

        // Return report:
        return response.data;
    }

    // Get AI trip recommendation:
    public async getAiRecommendation(
        destination: string
    ): Promise<string> {

        // Send destination to Backend AI endpoint:
        const response = await axios.post<{ recommendation: string }>(
            appConfig.aiRecommendationUrl,
            { destination }
        );

        // Return generated recommendation:
        return response.data.recommendation;
    }

    // Ask a question about database data through MCP:
    public async askMcpQuestion(
        question: string
    ): Promise<string> {

        // Send question to Backend MCP endpoint:
        const response = await axios.post<{ answer: string }>(
            appConfig.mcpQuestionUrl,
            { question }
        );

        // Return the answer received from Backend:
        return response.data.answer;
    }

    // Add like to vacation:
    public async addLike(
        vacationId: number
    ): Promise<void> {

        // Send like request to Backend:
        await axios.post(
            `${appConfig.vacationsUrl}/${vacationId}/likes`
        );
    }

    // Remove like from vacation:
    public async deleteLike(
        vacationId: number
    ): Promise<void> {

        // Send unlike request to Backend:
        await axios.delete(
            `${appConfig.vacationsUrl}/${vacationId}/likes`
        );
    }

    // Add new vacation:
    public async addVacation(
        vacation: VacationFormModel
    ): Promise<VacationModel> {

        // Create form data for vacation and image:
        const formData = new FormData();

        formData.append(
            "destination",
            vacation.destination
        );

        formData.append(
            "description",
            vacation.description
        );

        formData.append(
            "startDate",
            vacation.startDate
        );

        formData.append(
            "endDate",
            vacation.endDate
        );

        formData.append(
            "price",
            vacation.price.toString()
        );

        // Add image if supplied:
        if (vacation.image) {
            formData.append(
                "image",
                vacation.image[0]
            );
        }

        // Send vacation to Backend:
        const response = await axios.post<VacationModel>(
            appConfig.vacationsUrl,
            formData
        );

        // Return added vacation:
        return response.data;
    }

    // Update existing vacation:
    public async updateVacation(
        vacationId: number,
        vacation: VacationFormModel
    ): Promise<VacationModel> {

        // Create form data for vacation and optional image:
        const formData = new FormData();

        formData.append(
            "destination",
            vacation.destination
        );

        formData.append(
            "description",
            vacation.description
        );

        formData.append(
            "startDate",
            vacation.startDate
        );

        formData.append(
            "endDate",
            vacation.endDate
        );

        formData.append(
            "price",
            vacation.price.toString()
        );

        // Add new image only if supplied:
        if (
            vacation.image &&
            vacation.image.length > 0
        ) {
            formData.append(
                "image",
                vacation.image[0]
            );
        }

        // Send updated vacation to Backend:
        const response = await axios.put<VacationModel>(
            `${appConfig.vacationsUrl}/${vacationId}`,
            formData
        );

        // Return updated vacation:
        return response.data;
    }

    // Delete vacation:
    public async deleteVacation(
        vacationId: number
    ): Promise<void> {

        // Send delete request to Backend:
        await axios.delete(
            `${appConfig.vacationsUrl}/${vacationId}`
        );
    }
}

// Export single service instance:
export const dataService =
    new DataService();
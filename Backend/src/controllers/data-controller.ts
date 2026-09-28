import express, { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { saver } from "smart-saver";
import { securityMiddleware } from "../middleware/security-middleware";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { dataService } from "../services/data-service";
import { cyber } from "../utils/cyber";

// Contains routes, without logic.
class DataController {

    // Create router:
    public router: Router = express.Router();

    // Register routes:
    public constructor() {

        this.router.get(
            "/api/vacations",
            securityMiddleware.verifyLoggedIn,
            this.getVacations
        );

        this.router.get(
            "/api/vacations/:id",
            securityMiddleware.verifyLoggedIn,
            this.getVacationById
        );

        this.router.get(
            "/api/reports",
            securityMiddleware.verifyAdmin,
            this.getVacationsReport
        );

        this.router.post(
            "/api/vacations/:id/likes",
            securityMiddleware.verifyUser,
            this.addLike
        );

        this.router.delete(
            "/api/vacations/:id/likes",
            securityMiddleware.verifyUser,
            this.deleteLike
        );

        this.router.post(
            "/api/vacations",
            securityMiddleware.verifyAdmin,
            this.addVacation
        );

        this.router.put(
            "/api/vacations/:id",
            securityMiddleware.verifyAdmin,
            this.updateVacation
        );

        this.router.delete(
            "/api/vacations/:id",
            securityMiddleware.verifyAdmin,
            this.deleteVacation
        );

        this.router.post(
            "/api/register",
            this.register
        );

        this.router.post(
            "/api/login",
            this.login
        );
    }

    // Get vacations:
    private async getVacations(
        request: Request,
        response: Response
    ): Promise<void> {

        const authorization =
            request.headers.authorization;

        const token =
            authorization!.substring(7);

        const user =
            cyber.getUserFromToken(token);

        const filter =
            String(request.query.filter || "all");

        const page =
            Number(request.query.page || 1);

        const result =
            await dataService.getVacations(
                user.userId!,
                filter,
                page
            );

        response.json(result);
    }

    // Get one vacation:
    private async getVacationById(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacationId =
            Number(request.params.id);

        const vacation =
            await dataService.getVacationById(
                vacationId
            );

        response.json(vacation);
    }

    // Get vacations report:
    private async getVacationsReport(
        request: Request,
        response: Response
    ): Promise<void> {

        const report =
            await dataService.getVacationsReport();

        response.json(report);
    }

    // Add like:
    private async addLike(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacationId =
            Number(request.params.id);

        const authorization =
            request.headers.authorization;

        const token =
            authorization!.substring(7);

        const user =
            cyber.getUserFromToken(token);

        await dataService.addLike(
            user.userId!,
            vacationId
        );

        response.sendStatus(201);
    }

    // Delete like:
    private async deleteLike(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacationId =
            Number(request.params.id);

        const authorization =
            request.headers.authorization;

        const token =
            authorization!.substring(7);

        const user =
            cyber.getUserFromToken(token);

        await dataService.deleteLike(
            user.userId!,
            vacationId
        );

        response.sendStatus(204);
    }

    // Add vacation:
    private async addVacation(
        request: Request,
        response: Response
    ): Promise<void> {

        const image =
            request.files?.image as UploadedFile;

        const imageName =
            await saver.save(image);

        const vacation = new VacationModel({
            ...request.body,
            price: Number(request.body.price),
            imageName
        } as VacationModel);

        const addedVacation =
            await dataService.addVacation(
                vacation
            );

        response
            .status(201)
            .json(addedVacation);
    }

    // Update vacation:
    private async updateVacation(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacationId =
            Number(request.params.id);

        const existingVacation =
            await dataService.getVacationById(
                vacationId
            );

        let imageName =
            existingVacation.imageName;

        const image =
            request.files?.image as UploadedFile;

        if (image) {
            const newImageName =
                await saver.save(image);

            if (newImageName) {
                imageName = newImageName;
            }
        }

        const vacation = new VacationModel({
            ...request.body,
            vacationId,
            price: Number(request.body.price),
            imageName
        } as VacationModel);

        const updatedVacation =
            await dataService.updateVacation(
                vacation
            );

        response.json(updatedVacation);
    }

    // Delete vacation:
    private async deleteVacation(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacationId =
            Number(request.params.id);

        await dataService.deleteVacation(
            vacationId
        );

        response.sendStatus(204);
    }

    // Register:
    private async register(
        request: Request,
        response: Response
    ): Promise<void> {

        const user =
            new UserModel(request.body);

        const token =
            await dataService.register(user);

        response
            .status(201)
            .json(token);
    }

    // Login:
    private async login(
        request: Request,
        response: Response
    ): Promise<void> {

        const credentials =
            new CredentialsModel(request.body);

        const token =
            await dataService.login(credentials);

        response.json(token);
    }
}

export const dataController =
    new DataController();
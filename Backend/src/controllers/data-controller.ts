import express, { Request, Response, Router } from "express";
import { UploadedFile } from "express-fileupload";
import { saver } from "smart-saver";
import { securityMiddleware } from "../middleware/security-middleware";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { dataService } from "../services/data-service";

// Contains routes, without logic.
class DataController {

    // Create a router object which can listen on routes:
    public router: Router = express.Router();

    // Constructor - register routes:
    public constructor() {

        this.router.get(
            "/api/vacations",
            securityMiddleware.verifyLoggedIn,
            this.getVacations
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

    private async getVacations(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacations =
            await dataService.getVacations();

        response.json(vacations);
    }

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
            await dataService.addVacation(vacation);

        response
            .status(201)
            .json(addedVacation);
    }

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
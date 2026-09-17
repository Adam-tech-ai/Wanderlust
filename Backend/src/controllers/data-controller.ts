import express, { Request, Response, Router } from "express";
import { securityMiddleware } from "../middleware/security-middleware";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
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

        this.router.post("/api/register", this.register);

        this.router.post("/api/login", this.login);
    }

    private async getVacations(
        request: Request,
        response: Response
    ): Promise<void> {

        const vacations = await dataService.getVacations();

        response.json(vacations);
    }

    private async register(
        request: Request,
        response: Response
    ): Promise<void> {

        const user = new UserModel(request.body);

        const token = await dataService.register(user);

        response.status(201).json(token);
    }

    private async login(
        request: Request,
        response: Response
    ): Promise<void> {

        const credentials = new CredentialsModel(request.body);

        const token = await dataService.login(credentials);

        response.json(token);
    }

}

export const dataController = new DataController();
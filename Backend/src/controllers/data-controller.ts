import express, { Request, Response, Router } from "express";
import { saver } from "smart-saver";
import { securityMiddleware } from "../middleware/security-middleware";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { aiService } from "../services/ai-service";
import { dataService } from "../services/data-service";
import { mcpAiService } from "../services/mcp-ai-service";
import { cyber } from "../utils/cyber";

// Contains routes, without logic.
class DataController {

    // Create router:
    public router: Router = express.Router();

    // Register routes:
    public constructor() {

        // Get vacations:
        this.router.get(
            "/api/vacations",
            securityMiddleware.verifyLoggedIn,
            this.getVacations
        );

        // Get one vacation:
        this.router.get(
            "/api/vacations/:id",
            securityMiddleware.verifyLoggedIn,
            this.getVacationById
        );

        // Get vacations report:
        this.router.get(
            "/api/reports",
            securityMiddleware.verifyAdmin,
            this.getVacationsReport
        );

        // Get AI trip recommendation:
        this.router.post(
            "/api/ai-recommendation",
            securityMiddleware.verifyUser,
            this.getAiRecommendation
        );

        // Ask a question about database data through MCP:
        this.router.post(
            "/api/mcp-question",
            securityMiddleware.verifyUser,
            this.askMcpQuestion
        );

        // Add like:
        this.router.post(
            "/api/vacations/:id/likes",
            securityMiddleware.verifyUser,
            this.addLike
        );

        // Delete like:
        this.router.delete(
            "/api/vacations/:id/likes",
            securityMiddleware.verifyUser,
            this.deleteLike
        );

        // Add vacation:
        this.router.post(
            "/api/vacations",
            securityMiddleware.verifyAdmin,
            this.addVacation
        );

        // Update vacation:
        this.router.put(
            "/api/vacations/:id",
            securityMiddleware.verifyAdmin,
            this.updateVacation
        );

        // Delete vacation:
        this.router.delete(
            "/api/vacations/:id",
            securityMiddleware.verifyAdmin,
            this.deleteVacation
        );

        // Register:
        this.router.post(
            "/api/register",
            this.register
        );

        // Login:
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

        // Get token from authorization header:
        const authorization =
            request.headers.authorization;

        const token =
            authorization!.substring(7);

        // Get logged-in user from token:
        const user =
            cyber.getUserFromToken(token);

        // Get requested filter:
        const filter =
            String(request.query.filter || "all");

        // Get requested page:
        const page =
            Number(request.query.page || 1);

        // Get vacations from service:
        const result =
            await dataService.getVacations(
                user.userId!,
                filter,
                page
            );

        // Return vacations:
        response.json(result);
    }

    // Get one vacation:
    private async getVacationById(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get vacation ID from route:
        const vacationId =
            Number(request.params.id);

        // Get vacation from service:
        const vacation =
            await dataService.getVacationById(
                vacationId
            );

        // Return vacation:
        response.json(vacation);
    }

    // Get vacations report:
    private async getVacationsReport(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get report from service:
        const report =
            await dataService.getVacationsReport();

        // Return report:
        response.json(report);
    }

    // Get AI trip recommendation:
    private async getAiRecommendation(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get destination from request body:
        const destination =
            String(request.body.destination || "").trim();

        // Validate destination:
        if (!destination) {
            response
                .status(400)
                .json({
                    message: "Destination is required."
                });

            return;
        }

        // Get recommendation from AI:
        const recommendation =
            await aiService.getRecommendation(
                destination
            );

        // Return recommendation:
        response.json({
            recommendation
        });
    }

    // Answer a question about database data through MCP:
    private async askMcpQuestion(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get question from request body:
        const question =
            String(request.body.question || "").trim();

        // Validate question:
        if (!question) {
            response
                .status(400)
                .json({
                    message: "Question is required."
                });

            return;
        }

        // Get AI answer based on data received through MCP:
        const answer =
            await mcpAiService.askQuestion(
                question
            );

        // Return answer:
        response.json({
            answer
        });
    }

    // Add like:
    private async addLike(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get vacation ID:
        const vacationId =
            Number(request.params.id);

        // Get token from authorization header:
        const authorization =
            request.headers.authorization;

        const token =
            authorization!.substring(7);

        // Get logged-in user:
        const user =
            cyber.getUserFromToken(token);

        // Add like:
        await dataService.addLike(
            user.userId!,
            vacationId
        );

        // Return created status:
        response.sendStatus(201);
    }

    // Delete like:
    private async deleteLike(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get vacation ID:
        const vacationId =
            Number(request.params.id);

        // Get token from authorization header:
        const authorization =
            request.headers.authorization;

        const token =
            authorization!.substring(7);

        // Get logged-in user:
        const user =
            cyber.getUserFromToken(token);

        // Delete like:
        await dataService.deleteLike(
            user.userId!,
            vacationId
        );

        // Return no-content status:
        response.sendStatus(204);
    }

    // Add vacation:
    private async addVacation(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get uploaded image:
        const image =
            request.files?.image;

        // Require exactly one image when adding a vacation:
        if (!image || Array.isArray(image)) {
            response
                .status(400)
                .json({
                    message: "Vacation image is required. Upload one image."
                });

            return;
        }

        // Validate the declared MIME type of the uploaded file:
        if (!image.mimetype.startsWith("image/")) {
            response
                .status(400)
                .json({
                    message: "Uploaded file must be an image."
                });

            return;
        }

        // Save image:
        const imageName =
            await saver.save(image);

        // Create vacation model:
        const vacation = new VacationModel({
            ...request.body,
            price: Number(request.body.price),
            imageName
        } as VacationModel);

        // Add vacation:
        const addedVacation =
            await dataService.addVacation(
                vacation
            );

        // Return added vacation:
        response
            .status(201)
            .json(addedVacation);
    }

    // Update vacation:
    private async updateVacation(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get vacation ID:
        const vacationId =
            Number(request.params.id);

        // Get existing vacation:
        const existingVacation =
            await dataService.getVacationById(
                vacationId
            );

        // Keep existing image by default:
        let imageName =
            existingVacation.imageName;

        // Get new image if uploaded:
        const image =
            request.files?.image;

        // Validate and save a replacement image only if supplied:
        if (image) {

            // Reject multiple uploaded images:
            if (Array.isArray(image)) {
                response
                    .status(400)
                    .json({
                        message: "Upload only one vacation image."
                    });

                return;
            }

            // Validate the declared MIME type of the uploaded file:
            if (!image.mimetype.startsWith("image/")) {
                response
                    .status(400)
                    .json({
                        message: "Uploaded file must be an image."
                    });

                return;
            }

            // Save replacement image:
            const newImageName =
                await saver.save(image);

            if (newImageName) {
                imageName = newImageName;
            }
        }

        // Create updated vacation model:
        const vacation = new VacationModel({
            ...request.body,
            vacationId,
            price: Number(request.body.price),
            imageName
        } as VacationModel);

        // Update vacation:
        const updatedVacation =
            await dataService.updateVacation(
                vacation
            );

        // Return updated vacation:
        response.json(updatedVacation);
    }

    // Delete vacation:
    private async deleteVacation(
        request: Request,
        response: Response
    ): Promise<void> {

        // Get vacation ID:
        const vacationId =
            Number(request.params.id);

        // Delete vacation:
        await dataService.deleteVacation(
            vacationId
        );

        // Return no-content status:
        response.sendStatus(204);
    }

    // Register:
    private async register(
        request: Request,
        response: Response
    ): Promise<void> {

        // Create user model:
        const user =
            new UserModel(request.body);

        // Register user and get token:
        const token =
            await dataService.register(user);

        // Return token:
        response
            .status(201)
            .json(token);
    }

    // Login:
    private async login(
        request: Request,
        response: Response
    ): Promise<void> {

        // Create credentials model:
        const credentials =
            new CredentialsModel(request.body);

        // Login and get token:
        const token =
            await dataService.login(credentials);

        // Return token:
        response.json(token);
    }
}

export const dataController =
    new DataController();
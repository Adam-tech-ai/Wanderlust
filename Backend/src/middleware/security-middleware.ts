import { Express, NextFunction, Request, Response } from "express";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";
import striptags from "striptags";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { cyber } from "../utils/cyber";

class SecurityMiddleware {

    // Verify logged-in:
    public verifyLoggedIn(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {

        // Extract token:
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);

        // If token is legal:
        if (cyber.verifyToken(token!)) {
            next();
        }
        else {
            const err = new ClientError(
                StatusCode.Unauthorized,
                "You are not logged in."
            );

            next(err);
        }
    }

    // Verify user:
    public verifyUser(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {

        // Extract token:
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);

        // Token must first be valid:
        if (!cyber.verifyToken(token!)) {

            const err = new ClientError(
                StatusCode.Unauthorized,
                "You are not logged in."
            );

            next(err);
            return;
        }

        // Extract logged-in user:
        const user =
            cyber.getUserFromToken(token!);

        // Only regular users can continue:
        if (user.role === "user") {
            next();
        }
        else {

            const err = new ClientError(
                StatusCode.Forbidden,
                "You are not authorized."
            );

            next(err);
        }
    }

    // Verify admin:
    public verifyAdmin(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {

        // Extract token:
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);

        // If token is legal and user is admin:
        if (cyber.verifyAdmin(token!)) {
            next();
        }
        else {

            const err = new ClientError(
                StatusCode.Forbidden,
                "You are not authorized."
            );

            next(err);
        }
    }

    // Prevent XSS attack:
    public preventXss(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {

        // Run on body object:
        for (const prop in request.body) {

            // Take prop value:
            const value = request.body[prop];

            // If string:
            if (typeof value === "string") {

                // Remove tags:
                request.body[prop] =
                    striptags(value);
            }
        }

        // Continue:
        next();
    }

    // Prevent DoS attack:
    public registerRateLimit(
        server: Express
    ): void {

        // General rate-limit:
        server.use(expressRateLimit({
            windowMs: 1000,
            limit: 5
        }));
    }

    // Use helmet to protect header attacks:
    public headerProtection(
        server: Express
    ): void {

        server.use(helmet({
            crossOriginResourcePolicy: {
                policy: "same-site"
            }
        }));
    }
}

export const securityMiddleware =
    new SecurityMiddleware();
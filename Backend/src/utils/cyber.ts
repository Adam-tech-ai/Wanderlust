import { UserModel } from "../models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import crypto from "crypto";

class Cyber {

    // Hash password:
    public hash(plainText: string): string {

        // Create hash with salt (HMAC: Hash-based Message Authentication Code):
        const hashText = crypto
            .createHmac("sha512", appConfig.hashSalt)
            .update(plainText)
            .digest("hex");

        return hashText;
    }

    // Generate new token:
    public generateToken(user: UserModel): string {

        // Remove password:
        user.password = undefined!;

        // Create payload:
        const payload = { user };

        // Token options:
        const options: SignOptions = {
            expiresIn: "3h"
        };

        // Generate token:
        const token = jwt.sign(
            payload,
            appConfig.jwtSecret!,
            options
        );

        return token;
    }

    // Verify token:
    public verifyToken(token: string): boolean {

        try {

            if (!token) return false;

            jwt.verify(
                token,
                appConfig.jwtSecret!
            );

            return true;
        }
        catch (err: any) {

            return false;
        }
    }

    // Get user from token:
    public getUserFromToken(token: string): UserModel {

        const payload =
            jwt.decode(token) as { user: UserModel };

        return payload.user;
    }

    // Verify admin:
    public verifyAdmin(token: string): boolean {

        try {

            if (!token) return false;

            jwt.verify(
                token,
                appConfig.jwtSecret!
            );

            const payload =
                jwt.decode(token) as {
                    user: UserModel
                };

            const user = payload.user;

            if (user.role !== "admin") {
                return false;
            }

            return true;
        }
        catch (err: any) {

            return false;
        }
    }
}

export const cyber = new Cyber();
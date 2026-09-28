import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
import { AuthPayloadModel } from "../models/auth-payload-model";
import { appConfig } from "../utils/app-config";

class AuthService {

    // Register a new user:
    public async register(user: UserModel): Promise<void> {

        // Send user to Backend and get token:
        const response = await axios.post<string>(
            appConfig.registerUrl,
            user
        );

        // Save token in local storage:
        localStorage.setItem("token", response.data);
    }

    // Login an existing user:
    public async login(credentials: CredentialsModel): Promise<void> {

        // Send credentials to Backend and get token:
        const response = await axios.post<string>(
            appConfig.loginUrl,
            credentials
        );

        // Save token in local storage:
        localStorage.setItem("token", response.data);
    }

    // Get currently logged-in user:
    public getUser(): UserModel | null {

        // Get token from local storage:
        const token = localStorage.getItem("token");

        // If token doesn't exist, user isn't logged in:
        if (!token) return null;

        // Decode token payload:
        const payload =
            jwtDecode<AuthPayloadModel>(token);

        // Return logged-in user:
        return payload.user;
    }

    // Logout current user:
    public logout(): void {

        // Remove token from local storage:
        localStorage.removeItem("token");
    }
}

export const authService = new AuthService();
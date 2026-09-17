import { ResultSetHeader } from "mysql2";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { cyber } from "../utils/cyber";
import { dal } from "../utils/dal";

// Logic:
class DataService {

    public async getVacations(): Promise<VacationModel[]> {

        const sql = "SELECT * FROM vacations";

        const vacations = await dal.execute(sql);

        return vacations as VacationModel[];
    }

    public async register(user: UserModel): Promise<string> {

        // New registered users are regular users:
        user.role = "user";

        // Validate:
        user.validate();

        // Check if email already exists:
        const sqlCheck = "SELECT userId FROM users WHERE email = ?";

        const existingUsers = await dal.execute(
            sqlCheck,
            [user.email]
        ) as any[];

        if (existingUsers.length > 0) {
            throw new Error("Email already exists.");
        }

        // Hash password:
        user.password = cyber.hash(user.password);

        // Insert user:
        const sqlInsert = `
            INSERT INTO users(firstName, lastName, email, password, role)
            VALUES(?, ?, ?, ?, ?)
        `;

        const result = await dal.execute(sqlInsert, [
            user.firstName,
            user.lastName,
            user.email,
            user.password,
            user.role
        ]) as ResultSetHeader;

        // Get generated id:
        user.userId = result.insertId;

        // Generate token:
        const token = cyber.generateToken(user);

        return token;
    }

    public async login(credentials: CredentialsModel): Promise<string> {

        // Validate:
        credentials.validate();

        // Hash password:
        credentials.password = cyber.hash(credentials.password);

        // Find user:
        const sql = `
            SELECT *
            FROM users
            WHERE email = ? AND password = ?
        `;

        const users = await dal.execute(sql, [
            credentials.email,
            credentials.password
        ]) as UserModel[];

        // Invalid credentials:
        if (users.length === 0) {
            throw new Error("Incorrect email or password.");
        }

        // Get user:
        const user = users[0];

        // Generate token:
        const token = cyber.generateToken(user);

        return token;
    }

}

export const dataService = new DataService();
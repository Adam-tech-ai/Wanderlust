import { ResultSetHeader } from "mysql2";
import { CredentialsModel } from "../models/credentials-model";
import { UserModel } from "../models/user-model";
import { VacationModel } from "../models/vacation-model";
import { cyber } from "../utils/cyber";
import { dal } from "../utils/dal";

// Logic:
class DataService {

    public async getVacations(
        userId: number
    ): Promise<any[]> {

        const sql = `
            SELECT
                v.*,
                COUNT(l.userId) AS likesCount,
                MAX(
                    CASE
                        WHEN l.userId = ? THEN 1
                        ELSE 0
                    END
                ) AS isLiked
            FROM vacations AS v
            LEFT JOIN likes AS l
                ON v.vacationId = l.vacationId
            GROUP BY v.vacationId
            ORDER BY v.startDate ASC
        `;

        const vacations = await dal.execute(
            sql,
            [userId]
        );

        return vacations as any[];
    }

    public async getVacationById(
        vacationId: number
    ): Promise<VacationModel> {

        const sql = `
            SELECT *
            FROM vacations
            WHERE vacationId = ?
        `;

        const vacations = await dal.execute(
            sql,
            [vacationId]
        ) as VacationModel[];

        if (vacations.length === 0) {
            throw new Error(
                "Vacation not found."
            );
        }

        return vacations[0];
    }

    public async register(
        user: UserModel
    ): Promise<string> {

        user.role = "user";

        user.validate();

        const sqlCheck = `
            SELECT userId
            FROM users
            WHERE email = ?
        `;

        const existingUsers = await dal.execute(
            sqlCheck,
            [user.email]
        ) as any[];

        if (existingUsers.length > 0) {
            throw new Error(
                "Email already exists."
            );
        }

        user.password =
            cyber.hash(user.password);

        const sqlInsert = `
            INSERT INTO users(
                firstName,
                lastName,
                email,
                password,
                role
            )
            VALUES(?, ?, ?, ?, ?)
        `;

        const result = await dal.execute(
            sqlInsert,
            [
                user.firstName,
                user.lastName,
                user.email,
                user.password,
                user.role
            ]
        ) as ResultSetHeader;

        user.userId = result.insertId;

        const token =
            cyber.generateToken(user);

        return token;
    }

    public async login(
        credentials: CredentialsModel
    ): Promise<string> {

        credentials.validate();

        credentials.password =
            cyber.hash(credentials.password);

        const sql = `
            SELECT *
            FROM users
            WHERE email = ?
            AND password = ?
        `;

        const users = await dal.execute(
            sql,
            [
                credentials.email,
                credentials.password
            ]
        ) as UserModel[];

        if (users.length === 0) {
            throw new Error(
                "Incorrect email or password."
            );
        }

        const user = users[0];

        const token =
            cyber.generateToken(user);

        return token;
    }

    public async addVacation(
        vacation: VacationModel
    ): Promise<VacationModel> {

        vacation.validate();

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        if (vacation.startDate < today) {
            throw new Error(
                "Start date cannot be in the past."
            );
        }

        if (
            vacation.endDate <
            vacation.startDate
        ) {
            throw new Error(
                "End date cannot be before start date."
            );
        }

        const sql = `
            INSERT INTO vacations(
                destination,
                description,
                startDate,
                endDate,
                price,
                imageName
            )
            VALUES(?, ?, ?, ?, ?, ?)
        `;

        const result = await dal.execute(
            sql,
            [
                vacation.destination,
                vacation.description,
                vacation.startDate
                    .toISOString()
                    .split("T")[0],
                vacation.endDate
                    .toISOString()
                    .split("T")[0],
                vacation.price,
                vacation.imageName
            ]
        ) as ResultSetHeader;

        vacation.vacationId =
            result.insertId;

        return vacation;
    }

    public async updateVacation(
        vacation: VacationModel
    ): Promise<VacationModel> {

        vacation.validate();

        if (
            vacation.endDate <
            vacation.startDate
        ) {
            throw new Error(
                "End date cannot be before start date."
            );
        }

        const sql = `
            UPDATE vacations
            SET
                destination = ?,
                description = ?,
                startDate = ?,
                endDate = ?,
                price = ?,
                imageName = ?
            WHERE vacationId = ?
        `;

        await dal.execute(
            sql,
            [
                vacation.destination,
                vacation.description,
                vacation.startDate
                    .toISOString()
                    .split("T")[0],
                vacation.endDate
                    .toISOString()
                    .split("T")[0],
                vacation.price,
                vacation.imageName,
                vacation.vacationId!
            ]
        );

        return vacation;
    }

    public async addLike(
        userId: number,
        vacationId: number
    ): Promise<void> {

        const sql = `
            INSERT INTO likes(
                userId,
                vacationId
            )
            VALUES(?, ?)
        `;

        await dal.execute(
            sql,
            [
                userId,
                vacationId
            ]
        );
    }

    public async deleteLike(
        userId: number,
        vacationId: number
    ): Promise<void> {

        const sql = `
            DELETE FROM likes
            WHERE userId = ?
            AND vacationId = ?
        `;

        await dal.execute(
            sql,
            [
                userId,
                vacationId
            ]
        );
    }

    public async deleteVacation(
        vacationId: number
    ): Promise<void> {

        const deleteLikesSql = `
            DELETE FROM likes
            WHERE vacationId = ?
        `;

        await dal.execute(
            deleteLikesSql,
            [vacationId]
        );

        const deleteVacationSql = `
            DELETE FROM vacations
            WHERE vacationId = ?
        `;

        await dal.execute(
            deleteVacationSql,
            [vacationId]
        );
    }
}

export const dataService =
    new DataService();
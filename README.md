# Wanderlust

Full Stack vacation management application developed by Adam Schwarcz
for John Bryce — Full Stack & Gen AI Development, Project #3.

GitHub repository: https://github.com/Adam-tech-ai/Wanderlust

## Features

- User registration and login with JWT authentication.
- User and administrator roles.
- Vacation cards sorted by start date.
- Pagination with up to 9 vacations per page.
- All, Liked, Active and Upcoming filters.
- Vacation likes and like counts for regular users.
- Administrator vacation creation, editing and deletion.
- Vacation image upload and optional image replacement.
- Administrator likes report and CSV download.
- AI travel recommendations using Google Gemini.
- Database questions through a Backend MCP server and Gemini.
- Docker Compose with persistent database and image storage.

## Technologies

Frontend: React, TypeScript, Vite, React Router, react-hook-form,
Axios, Recharts and CSS.

Backend: Node.js, TypeScript, Express, MySQL, mysql2, Zod, JWT,
express-fileupload, smart-saver, Google Gen AI SDK and MCP SDK.

## Project Structure

- `Backend/` — REST API, MCP server and vacation images.
- `Frontend/` — React application.
- `Database/Vacations.sql` — database structure and current data.
- `Backend/Wanderlust.postman_collection.json` — exported Postman collection.
- `docker-compose.yml` — complete Docker configuration.
- `.env.example` — configuration template without real secrets.

## Run with Docker

Install Docker Desktop and ensure it is running.

From the project root, copy the configuration example:

```bash
cp .env.example .env
```

Edit `.env` and replace both placeholder values:

```dotenv
JWT_SECRET=your-long-random-secret
GEMINI_API_KEY=your-gemini-api-key
```

The AI Recommendation and MCP features use Google Gemini.
An OpenAI API key cannot be used as `GEMINI_API_KEY`.

Start the application from the project root:

```bash
docker compose up -d --build
```

Open the application:

http://localhost:4173

Backend API:

http://localhost:4000/api

Ports 4000 and 4173 must be available.
Stop any locally running Backend on port 4000 before starting Docker.

## Demo Accounts

The included SQL contains these accounts:

| Role | Email | Password |
|---|---|---|
| Administrator | admin@test.com | 1234 |
| User | adam@test.com | 1234 |
| User | test.audit@example.com | 1234 |

These credentials are for the course demonstration only.
Passwords are stored as hashes in the database.

The Docker database password and hash salt are demonstration settings.

## Database and Images

The SQL export contains 13 vacations with their current image filenames,
users and likes.

On the first startup with an empty database volume, Docker imports:

`Database/Vacations.sql`

The database is stored in the `vacations-data` volume.
Vacation images are stored in the `vacations-images` volume.

Updating the SQL file does not automatically update an existing database volume.

To replace the Docker database tables with the included SQL export:

```bash
docker compose exec -T database mysql -uroot -pvacations123 < Database/Vacations.sql
```

This command replaces the project tables and data in the Docker database.

## Postman

Import:

`Backend/Wanderlust.postman_collection.json`

The Backend base URL is:

`http://localhost:4000/api`

To obtain a token, send a POST request to `/login`
with Body → raw → JSON:

```json
{
    "email": "admin@test.com",
    "password": "1234"
}
```

For regular-user endpoints, log in with `adam@test.com` and password `1234`.

The response contains the JWT as a JSON string.
Copy the token without the surrounding quotation marks.

For protected requests, select Authorization → Bearer Token and paste
the appropriate token. Replace any unresolved token variable in the imported
collection with a newly obtained JWT.

Use an administrator token for vacation creation, editing, deletion and reports.
Use a regular-user token for likes, AI Recommendation and MCP questions.

For image uploads, select a file available on your own computer.
Exported file paths from the author's computer must be replaced.
Use Body → form-data for vacation creation and editing.

Before editing or deleting a vacation, replace the sample vacation ID in
the URL with an existing ID. Create a test vacation for deletion tests.

## Main API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/register` | Public |
| POST | `/api/login` | Public |
| GET | `/api/vacations?filter=all&page=1` | Logged-in account |
| GET | `/api/vacations/:id` | Logged-in account |
| POST | `/api/vacations` | Administrator |
| PUT | `/api/vacations/:id` | Administrator |
| DELETE | `/api/vacations/:id` | Administrator |
| POST | `/api/vacations/:id/likes` | User |
| DELETE | `/api/vacations/:id/likes` | User |
| GET | `/api/reports` | Administrator |
| POST | `/api/ai-recommendation` | User |
| POST | `/api/mcp-question` | User |
| GET | `/api/images/:filename` | Public image |

Vacation filters: `all`, `liked`, `active`, `future`.

AI Recommendation request body:

```json
{
    "destination": "Jerusalem"
}
```

MCP request body:

```json
{
    "question": "What is the average price of all vacations?"
}
```

CSV is generated and downloaded from the administrator Reports page.

## Stop the Application

From the project root:

```bash
docker compose down
```

This keeps the database and image volumes.

## Validation

The following checks were completed during final preparation:

- Frontend TypeScript compilation and production build.
- Backend TypeScript check using `npx tsc --noEmit`.
- Registration and login validations.
- User and administrator page access.
- Vacation creation, editing and deletion confirmation.
- Required image on creation and optional image on editing.
- Rejection of non-image uploads.
- Date and price validations.
- Likes, filters, pagination and ordering.
- Reports and CSV download.
- Gemini travel recommendation.
- MCP answers compared with MySQL results.
- Docker startup, login, vacation list, images, AI and MCP.
- Database and uploaded-image persistence after container recreation.
- Updated SQL import into MySQL 8.4 in Docker.

## Author

Adam Schwarcz
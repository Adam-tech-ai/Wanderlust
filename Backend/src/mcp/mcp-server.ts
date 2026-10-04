import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dal } from "../utils/dal";

// Handles our MCP server and its available tools:
class McpServerService {

    // Create MCP server:
    public readonly server = new McpServer({
        name: "vacations-mcp-server",
        version: "1.0.0"
    });

    // Register MCP tools when server is created:
    public constructor() {
        this.registerTools();
    }

    // Register all tools exposed by the MCP server:
    private registerTools(): void {

        // Register tool for getting vacation data:
        this.server.registerTool(
            "get_vacations",
            {
                description:
                    "Get all vacations from the database. Use this tool to answer questions about vacation destinations, descriptions, dates and prices."
            },
            async () => {

                // Get vacation data from database.
                // DATE_FORMAT keeps MySQL DATE values as YYYY-MM-DD
                // and prevents JavaScript timezone conversion:
                const sql = `
                    SELECT
                        vacationId,
                        destination,
                        description,
                        DATE_FORMAT(startDate, '%Y-%m-%d') AS startDate,
                        DATE_FORMAT(endDate, '%Y-%m-%d') AS endDate,
                        price
                    FROM vacations
                `;

                // Execute query using the existing DAL:
                const vacations =
                    await dal.execute(sql);

                // Return database data through MCP:
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(vacations)
                        }
                    ]
                };
            }
        );

        // Register tool for calculating vacation statistics:
        this.server.registerTool(
            "get_vacation_statistics",
            {
                description:
                    "Get exact statistics calculated by the database, including total vacations, average price, minimum price, maximum price and total price."
            },
            async () => {

                // Let MySQL perform exact numeric calculations:
                const sql = `
                    SELECT
                        COUNT(*) AS totalVacations,
                        ROUND(AVG(price), 2) AS averagePrice,
                        MIN(price) AS minimumPrice,
                        MAX(price) AS maximumPrice,
                        SUM(price) AS totalPrice
                    FROM vacations
                `;

                // Execute calculation in MySQL:
                const statistics =
                    await dal.execute(sql);

                // Return calculated statistics through MCP:
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(statistics)
                        }
                    ]
                };
            }
        );
    }
}

// Export single MCP server instance:
export const mcpServerService =
    new McpServerService();
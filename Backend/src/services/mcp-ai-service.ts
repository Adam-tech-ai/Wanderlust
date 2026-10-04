import { GoogleGenAI } from "@google/genai";
import { mcpClientService } from "../mcp/mcp-client";

// Handles AI questions about database data received through MCP:
class McpAiService {

    // Create Gemini client using the secret API key:
    private ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    // Answer a question about vacations stored in the database:
    public async askQuestion(
        question: string
    ): Promise<string> {

        // Get detailed vacation data through the MCP server:
        const vacations =
            await mcpClientService.getVacations();

        // Get exact statistics calculated by MySQL
        // through the MCP server:
        const statistics =
            await mcpClientService.getVacationStatistics();

        // Create prompt containing the user's question,
        // detailed vacation data and exact database statistics:
        const prompt = `
            You answer questions about vacations stored in a database.

            The information below was retrieved from the database
            through an MCP server.

            VACATION DATA:
            ${vacations}

            DATABASE STATISTICS:
            ${statistics}

            USER QUESTION:
            ${question}

            Instructions:
            - Answer using only the database information provided above.
            - Do not invent vacations or database information.
            - For total vacations, average price, minimum price,
              maximum price or total price, use the DATABASE STATISTICS.
            - Do not recalculate values that already exist in
              DATABASE STATISTICS.
            - Perform other calculations only when necessary.
            - Answer the user's question directly.
            - Give only the final answer unless an explanation is necessary.
            - Do not explain calculations unless the user explicitly asks.
            - Consider the current date to be ${new Date().toISOString()}.
            - If the requested information cannot be determined from
              the provided data, clearly say so.
            - Keep the answer concise and clear.
            - Return plain text only.
            - Do not use Markdown syntax.
        `;

        // Send the question and MCP data to Gemini:
        const response =
            await this.ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt
            });

        // Return generated answer:
        return response.text ?? "";
    }
}

// Export single MCP AI service instance:
export const mcpAiService =
    new McpAiService();
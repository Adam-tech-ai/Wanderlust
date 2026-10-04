import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { mcpServerService } from "./mcp-server";

// Represents text content returned by an MCP tool:
type McpTextContent = {
    type: "text";
    text: string;
};

// Represents the result returned by our MCP tools:
type McpToolResult = {
    content: McpTextContent[];
};

// Handles communication with our MCP server:
class McpClientService {

    // MCP client:
    private readonly client = new Client({
        name: "vacations-mcp-client",
        version: "1.0.0"
    });

    // Indicates whether client and server are already connected:
    private connected = false;

    // Connect MCP client to MCP server:
    public async connect(): Promise<void> {

        // Avoid connecting more than once:
        if (this.connected) {
            return;
        }

        // Create both sides of an in-memory MCP transport:
        const [clientTransport, serverTransport] =
            InMemoryTransport.createLinkedPair();

        // Connect our MCP server to the server side:
        await mcpServerService.server.connect(
            serverTransport
        );

        // Connect our MCP client to the client side:
        await this.client.connect(
            clientTransport
        );

        // Mark connection as ready:
        this.connected = true;
    }

    // Get the tools exposed by our MCP server:
    public async getTools() {

        // Make sure MCP connection exists:
        await this.connect();

        // Ask MCP server for its registered tools:
        const result =
            await this.client.listTools();

        // Return registered tools:
        return result.tools;
    }

    // Call the MCP tool which reads vacations:
    public async getVacations(): Promise<string> {

        // Make sure MCP connection exists:
        await this.connect();

        // Call vacation tool through the MCP protocol:
        const result =
            await this.client.callTool({
                name: "get_vacations",
                arguments: {}
            }) as McpToolResult;

        // Find the text returned by the MCP tool:
        const textContent =
            result.content.find(
                item => item.type === "text"
            );

        // Return text received from MCP server:
        if (textContent) {
            return textContent.text;
        }

        // Return empty array if MCP returned no text:
        return "[]";
    }

    // Call the MCP tool which calculates vacation statistics:
    public async getVacationStatistics(): Promise<string> {

        // Make sure MCP connection exists:
        await this.connect();

        // Call statistics tool through the MCP protocol:
        const result =
            await this.client.callTool({
                name: "get_vacation_statistics",
                arguments: {}
            }) as McpToolResult;

        // Find the text returned by the MCP tool:
        const textContent =
            result.content.find(
                item => item.type === "text"
            );

        // Return statistics received from MCP server:
        if (textContent) {
            return textContent.text;
        }

        // Return empty array if MCP returned no text:
        return "[]";
    }
}

// Export single MCP client instance:
export const mcpClientService =
    new McpClientService();
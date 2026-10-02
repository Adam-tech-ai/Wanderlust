import { GoogleGenAI } from "@google/genai";

// Handles AI operations:
class AiService {

    // Create Gemini client using the secret API key:
    private ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    // Get AI trip recommendation for a destination:
    public async getRecommendation(
        destination: string
    ): Promise<string> {

        // Create a prompt according to the requested destination:
        const prompt = `
    Give a useful travel recommendation for ${destination}.

    Include:
    - Recommended attractions
    - Recommended activities
    - Useful travel tips

    Keep the answer concise and practical.

    Return plain text only.
    Do not use Markdown syntax such as #, *, ** or backticks.
    Use clear section titles and simple line breaks.
`;

        // Send prompt to Gemini:
        const response =
            await this.ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt
            });

        // Return generated recommendation:
        return response.text ?? "";
    }
}

export const aiService =
    new AiService();
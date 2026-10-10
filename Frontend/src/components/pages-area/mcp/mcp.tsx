
import { FormEvent, useState } from "react";
import { dataService } from "../../../services/data-service";
import "./mcp.css";

// Displays the MCP question and answer page:
export function Mcp() {

    // User question:
    const [question, setQuestion] =
        useState<string>("");

    // Answer received from Backend:
    const [answer, setAnswer] =
        useState<string>("");

    // Indicates whether the answer is being generated:
    const [loading, setLoading] =
        useState<boolean>(false);

    // Error message:
    const [error, setError] =
        useState<string>("");

    // Send question to Backend:
    async function askQuestion(
        event: FormEvent
    ): Promise<void> {

        // Prevent page refresh:
        event.preventDefault();

        // Remove unnecessary spaces:
        const trimmedQuestion =
            question.trim();

        // Validate question:
        if (!trimmedQuestion) {
            setError("Please enter a question.");
            return;
        }

        try {

            // Prepare UI for new request:
            setLoading(true);
            setError("");
            setAnswer("");

            // Ask question through Backend:
            const result =
                await dataService.askMcpQuestion(
                    trimmedQuestion
                );

            // Display answer:
            setAnswer(result);
        }
        catch {

            // Display error if request failed:
            setError(
                "Failed to get an answer. Please try again."
            );
        }
        finally {

            // Stop loading state:
            setLoading(false);
        }
    }

    return (
        <div className="Mcp">

            {/* Page heading: */}
            <div className="mcp-heading">

                <span className="mcp-badge">
                    AI Database Assistant
                </span>

                <h2>Ask Wanderlust AI</h2>

                <p>
                    Explore our vacation database using natural
                    language. Ask questions and discover insights
                    about available destinations.
                </p>

            </div>

            {/* Question form card: */}
            <div className="mcp-question-panel">

                <div className="mcp-panel-heading">
                    <h3>What would you like to know?</h3>
                    <p>
                        Ask anything about the vacations
                        stored in our database.
                    </p>
                </div>

                <form onSubmit={askQuestion}>

                    <label htmlFor="mcp-question">
                        Your Question
                    </label>

                    <textarea
                        id="mcp-question"
                        placeholder="e.g. What is the average price of the vacations?"
                        value={question}
                        onChange={event =>
                            setQuestion(event.target.value)
                        }
                        disabled={loading}
                        rows={4}
                    />

                    {/* Submit question: */}
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Analyzing Your Question..."
                            : "Ask AI Assistant"}
                    </button>

                </form>

                {/* Error message: */}
                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

            </div>

            {/* MCP answer card: */}
            {answer && (
                <div className="answer">

                    <div className="mcp-answer-heading">

                        <span className="mcp-badge">
                            AI Response
                        </span>

                        <h3>Your Answer</h3>

                        <p>
                            Insights from the Wanderlust
                            vacation database
                        </p>

                    </div>

                    <div className="mcp-answer-content">
                        <p>{answer}</p>
                    </div>

                </div>
            )}

        </div>
    );
}

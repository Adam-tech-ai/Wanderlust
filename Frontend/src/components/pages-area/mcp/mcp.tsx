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

            <h2>MCP Data Assistant</h2>

            <p>
                Ask any question about the vacations
                stored in the database.
            </p>

            <form onSubmit={askQuestion}>

                <textarea
                    placeholder="Example: What is the average price of the vacations?"
                    value={question}
                    onChange={event =>
                        setQuestion(event.target.value)
                    }
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Thinking..."
                        : "Ask"}
                </button>

            </form>

            {error &&
                <div className="error">
                    {error}
                </div>
            }

            {answer &&
                <div className="answer">

                    <h3>Answer</h3>

                    <p>{answer}</p>

                </div>
            }

        </div>
    );
}
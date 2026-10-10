
import { useState } from "react";
import { dataService } from "../../../services/data-service";
import { notify } from "../../../utils/notify";
import "./ai-recommendation.css";

// Displays AI-powered travel recommendations:
export function AiRecommendation() {

    // Store the destination entered by the user:
    const [destination, setDestination] =
        useState<string>("");

    // Store the destination used for the recommendation:
    const [recommendedDestination, setRecommendedDestination] =
        useState<string>("");

    // Store the AI recommendation:
    const [recommendation, setRecommendation] =
        useState<string>("");

    // Track the loading state:
    const [loading, setLoading] =
        useState<boolean>(false);

    // Get travel recommendation from Backend:
    async function getRecommendation(): Promise<void> {

        const requestedDestination =
            destination.trim();

        // Validate destination:
        if (!requestedDestination) {
            notify.error("Please enter a destination.");
            return;
        }

        try {
            setLoading(true);

            // Request AI recommendation:
            const result =
                await dataService.getAiRecommendation(
                    requestedDestination
                );

            // Display recommendation:
            setRecommendation(result);
            setRecommendedDestination(
                requestedDestination
            );
        }
        catch (err: any) {
            notify.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="AiRecommendation">

            {/* Page heading: */}
            <div className="ai-heading">

                <span className="ai-badge">
                    AI-Powered Travel
                </span>

                <h2>Where to next?</h2>

                <p>
                    Discover your next adventure with personalized
                    travel recommendations powered by AI.
                </p>

            </div>

            {/* Destination search panel: */}
            <div className="ai-search-panel">

                <div className="ai-search-heading">
                    <h3>Explore a Destination</h3>
                    <p>
                        Enter a destination and let our AI
                        help you plan your adventure.
                    </p>
                </div>

                <label htmlFor="ai-destination">
                    Your Destination
                </label>

                <input
                    id="ai-destination"
                    type="text"
                    value={destination}
                    onChange={event =>
                        setDestination(event.target.value)
                    }
                    placeholder="e.g. Paris, Tokyo, Maldives..."
                />

                {/* Generate recommendation: */}
                <button
                    onClick={getRecommendation}
                    disabled={loading}
                >
                    {loading
                        ? "Creating Your Recommendation..."
                        : "Get AI Recommendation"}
                </button>

            </div>

            {/* AI recommendation result: */}
            {recommendation && (
                <div className="recommendation">

                    <div className="recommendation-heading">

                        <span className="ai-badge">
                            Your Travel Guide
                        </span>

                        <h3>
                            Discover {recommendedDestination}
                        </h3>

                        <p>
                            Your personalized AI travel recommendation
                        </p>

                    </div>

                    <div className="recommendation-content">
                        <p>{recommendation}</p>
                    </div>

                </div>
            )}

        </div>
    );
}

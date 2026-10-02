import { useState } from "react";
import { dataService } from "../../../services/data-service";
import { notify } from "../../../utils/notify";
import "./ai-recommendation.css";

export function AiRecommendation() {

    const [destination, setDestination] =
        useState<string>("");

    const [recommendedDestination, setRecommendedDestination] =
        useState<string>("");

    const [recommendation, setRecommendation] =
        useState<string>("");

    const [loading, setLoading] =
        useState<boolean>(false);

    async function getRecommendation(): Promise<void> {

        const requestedDestination =
            destination.trim();

        if (!requestedDestination) {
            notify.error("Please enter a destination.");
            return;
        }

        try {
            setLoading(true);

            const result =
                await dataService.getAiRecommendation(
                    requestedDestination
                );

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

            <h2>AI Trip Recommendation</h2>

            <label>Destination:</label>

            <input
                type="text"
                value={destination}
                onChange={event =>
                    setDestination(event.target.value)
                }
                placeholder="Enter a destination"
            />

            <button
                onClick={getRecommendation}
                disabled={loading}
            >
                {loading
                    ? "Getting Recommendation..."
                    : "Get Recommendation"}
            </button>

            {recommendation && (
                <div className="recommendation">

                    <h3>
                        Recommendation for {recommendedDestination}
                    </h3>

                    <p>{recommendation}</p>

                </div>
            )}

        </div>
    );
}
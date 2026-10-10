import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { authService } from "../../../services/auth-service";
import { dataService } from "../../../services/data-service";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";
import "./vacations.css";

// Displays vacations with filters, likes and pagination:
export function Vacations() {

    // Get logged-in user and navigation object:
    const user = authService.getUser();
    const navigate = useNavigate();

    // Page data:
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [page, setPage] = useState<number>(1);
    const [filter, setFilter] = useState<string>("all");
    const [totalCount, setTotalCount] = useState<number>(0);

    // Load vacations when page or filter changes:
    useEffect(() => {
        loadVacations();
    }, [page, filter]);

    // Get vacations from Backend:
    async function loadVacations() {
        try {
            const response = await dataService.getVacations(filter, page);

            setVacations(response.vacations);
            setTotalCount(response.totalCount);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Change selected filter:
    function changeFilter(selectedFilter: string): void {
        setPage(1);
        setFilter(selectedFilter);
    }

    // Toggle vacation like:
    async function toggleLike(vacation: VacationModel): Promise<void> {
        try {
            if (vacation.isLiked) {
                await dataService.deleteLike(vacation.vacationId);
            }
            else {
                await dataService.addLike(vacation.vacationId);
            }

            await loadVacations();
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Navigate admin to edit vacation:
    function editVacation(vacationId: number): void {
        navigate(`/edit-vacation/${vacationId}`);
    }

    // Delete vacation after confirmation:
    async function deleteVacation(vacation: VacationModel): Promise<void> {

        const confirmed = window.confirm(
            `Are you sure you want to delete ${vacation.destination}?`
        );

        if (!confirmed) return;

        try {
            await dataService.deleteVacation(vacation.vacationId);

            notify.success("Vacation deleted successfully.");

            // Return to previous page if current page became empty:
            if (vacations.length === 1 && page > 1) {
                setPage(page - 1);
            }
            else {
                await loadVacations();
            }
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Calculate total pages:
    const totalPages = Math.ceil(totalCount / 9);

    return (
        <div className="Vacations">

            {/* Page title: */}
            <div className="vacations-heading">
                <h2>Explore Destinations</h2>
                <p>Discover amazing places for your next adventure.</p>
            </div>

            {/* Vacation filters: */}
            <div className="vacations-filters">

                <button
                    className={filter === "all" ? "selected" : ""}
                    onClick={() => changeFilter("all")}
                >
                    All Vacations
                </button>

                {user?.role === "user" &&
                    <button
                        className={filter === "liked" ? "selected" : ""}
                        onClick={() => changeFilter("liked")}
                    >
                        Liked
                    </button>
                }

                <button
                    className={filter === "active" ? "selected" : ""}
                    onClick={() => changeFilter("active")}
                >
                    Active
                </button>

                <button
                    className={filter === "future" ? "selected" : ""}
                    onClick={() => changeFilter("future")}
                >
                    Upcoming
                </button>

            </div>

            {/* Vacation cards grid: */}
            <div className="vacations-grid">

                {vacations.map(vacation =>
                    <div
                        className="vacation-card"
                        key={vacation.vacationId}
                    >

                        {/* Vacation image: */}
                        <img
                            src={`${appConfig.imagesUrl}/${vacation.imageName}`}
                            alt={vacation.destination}
                        />

                        {/* Vacation details: */}
                        <div className="vacation-card-content">

                            <h3>{vacation.destination}</h3>

                            <p className="vacation-description">
                                {vacation.description}
                            </p>

                            {/* Vacation dates: */}
                            <div className="vacation-dates">
                                <p>
                                    <strong>Start:</strong>{" "}
                                    {new Date(vacation.startDate).toLocaleDateString("en-GB")}
                                </p>

                                <p>
                                    <strong>End:</strong>{" "}
                                    {new Date(vacation.endDate).toLocaleDateString("en-GB")}
                                </p>
                            </div>

                            {/* Vacation price and likes: */}
                            <div className="vacation-details">

                                <span className="vacation-price">
                                    ${vacation.price}
                                </span>

                                <span className="vacation-likes">
                                    ♥ {vacation.likesCount}
                                </span>

                            </div>

                            {/* Regular user actions: */}
                            {user?.role === "user" &&
                                <button
                                    className={`like-button ${vacation.isLiked ? "liked" : ""}`}
                                    onClick={() => toggleLike(vacation)}
                                >
                                    {vacation.isLiked ? "♥ Liked" : "♡ Like"}
                                </button>
                            }

                            {/* Admin actions: */}
                            {user?.role === "admin" &&
                                <div className="vacation-admin-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() => editVacation(vacation.vacationId)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() => deleteVacation(vacation)}
                                    >
                                        Delete
                                    </button>

                                </div>
                            }

                        </div>

                    </div>
                )}

            </div>

            {/* Vacation pagination: */}
            {totalPages > 0 &&
                <div className="vacations-pagination">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span>
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>

                </div>
            }

        </div>
    );
}
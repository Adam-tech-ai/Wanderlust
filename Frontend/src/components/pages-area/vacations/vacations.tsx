import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { authService } from "../../../services/auth-service";
import { dataService } from "../../../services/data-service";
import { notify } from "../../../utils/notify";
import "./vacations.css";

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

            <h2>Vacations</h2>

            <div>
                <button onClick={() => changeFilter("all")}>
                    All
                </button>

                {user?.role === "user" &&
                    <button onClick={() => changeFilter("liked")}>
                        Liked
                    </button>
                }

                <button onClick={() => changeFilter("active")}>
                    Active
                </button>

                <button onClick={() => changeFilter("future")}>
                    Future
                </button>
            </div>

            {vacations.map(vacation =>
                <div key={vacation.vacationId}>

                    <h3>{vacation.destination}</h3>

                    <p>{vacation.description}</p>
                    <p>Start: {vacation.startDate}</p>
                    <p>End: {vacation.endDate}</p>
                    <p>Price: ${vacation.price}</p>
                    <p>Likes: {vacation.likesCount}</p>

                    {user?.role === "user" &&
                        <button onClick={() => toggleLike(vacation)}>
                            {vacation.isLiked ? "Unlike" : "Like"}
                        </button>
                    }

                    {user?.role === "admin" &&
                        <>
                            <button onClick={() => editVacation(vacation.vacationId)}>
                                Edit
                            </button>

                            <button onClick={() => deleteVacation(vacation)}>
                                Delete
                            </button>
                        </>
                    }

                </div>
            )}

            {totalPages > 0 &&
                <div>
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>

                    <span> Page {page} of {totalPages} </span>

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
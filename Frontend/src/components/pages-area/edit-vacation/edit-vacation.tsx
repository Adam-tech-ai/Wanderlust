import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { VacationFormModel } from "../../../models/vacation-form-model";
import { dataService } from "../../../services/data-service";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";
import "./edit-vacation.css";

export function EditVacation() {

    // Get vacation ID from route:
    const params = useParams();

    const vacationId =
        Number(params.id);

    // Create navigation object:
    const navigate = useNavigate();

    // Store current vacation image name:
    const [imageName, setImageName] =
        useState<string>("");

    // Create form management object:
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState
    } = useForm<VacationFormModel>();

    // Load vacation when component starts:
    useEffect(() => {

        loadVacation();

    }, []);

    // Get vacation from Backend:
    async function loadVacation() {

        try {

            const vacation =
                await dataService.getVacationById(
                    vacationId
                );

            // Store current vacation image:
            setImageName(
                vacation.imageName
            );

            // Fill form with current vacation data:
            reset({
                destination:
                    vacation.destination,

                description:
                    vacation.description,

                startDate:
                    vacation.startDate
                        .split("T")[0],

                endDate:
                    vacation.endDate
                        .split("T")[0],

                price:
                    vacation.price
            });
        }
        catch (err: any) {

            notify.error(err);
        }
    }

    // Update vacation:
    async function send(
        vacation: VacationFormModel
    ): Promise<void> {

        try {

            // Send updated vacation to Backend:
            await dataService.updateVacation(
                vacationId,
                vacation
            );

            // Display success message:
            notify.success(
                "Vacation updated successfully."
            );

            // Navigate back to vacations:
            navigate("/vacations");
        }
        catch (err: any) {

            notify.error(err);
        }
    }

    return (
        <div className="EditVacation">

            <h2>Edit Vacation</h2>

            <form onSubmit={handleSubmit(send)}>

                <label>Destination:</label>

                <input
                    type="text"
                    {...register(
                        "destination",
                        {
                            required: true
                        }
                    )}
                />

                {formState.errors.destination &&
                    <span>
                        Destination is required.
                    </span>
                }

                <label>Description:</label>

                <textarea
                    {...register(
                        "description",
                        {
                            required: true
                        }
                    )}
                />

                {formState.errors.description &&
                    <span>
                        Description is required.
                    </span>
                }

                <label>Start Date:</label>

                <input
                    type="date"
                    {...register(
                        "startDate",
                        {
                            required: true
                        }
                    )}
                />

                {formState.errors.startDate &&
                    <span>
                        Start date is required.
                    </span>
                }

                <label>End Date:</label>

                <input
                    type="date"
                    {...register(
                        "endDate",
                        {
                            required: true,

                            validate: value =>
                                value >=
                                getValues(
                                    "startDate"
                                )
                        }
                    )}
                />

                {formState.errors.endDate &&
                    <span>
                        End date must be on or
                        after start date.
                    </span>
                }

                <label>Current Image:</label>

                {/* Display current vacation image: */}
                {imageName &&
                    <img
                        src={`${appConfig.imagesUrl}/${imageName}`}
                        alt="Current vacation"
                    />
                }

                <label>New Image (optional):</label>

                <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                />

                <label>Price:</label>

                <input
                    type="number"
                    {...register(
                        "price",
                        {
                            required: true,
                            valueAsNumber: true,
                            min: 0,
                            max: 10000
                        }
                    )}
                />

                {formState.errors.price &&
                    <span>
                        Price must be between
                        0 and 10000.
                    </span>
                }

                <button>
                    Update Vacation
                </button>

            </form>

        </div>
    );
}
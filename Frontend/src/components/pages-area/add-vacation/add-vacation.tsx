import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { VacationFormModel } from "../../../models/vacation-form-model";
import { dataService } from "../../../services/data-service";
import { notify } from "../../../utils/notify";
import "./add-vacation.css";

export function AddVacation() {

    // Create form management object:
    const {
        register,
        handleSubmit,
        getValues,
        formState
    } = useForm<VacationFormModel>();

    // Create navigation object:
    const navigate = useNavigate();

    // Get today's date in the browser's local timezone:
    const now = new Date();

    const year = now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    // Format local date for date inputs:
    const today = `${year}-${month}-${day}`;

    // Add vacation:
    async function send(
        vacation: VacationFormModel
    ): Promise<void> {

        try {

            // Send vacation to Backend:
            await dataService.addVacation(
                vacation
            );

            // Display success message:
            notify.success(
                "Vacation added successfully."
            );

            // Navigate to vacations:
            navigate("/vacations");
        }
        catch (err: any) {

            // Display error:
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">

            <h2>Add Vacation</h2>

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
                    min={today}
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
                    min={today}
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

                <label>Image:</label>

                <input
                    type="file"
                    accept="image/*"
                    {...register(
                        "image",
                        {
                            required: true
                        }
                    )}
                />

                {formState.errors.image &&
                    <span>
                        Image is required.
                    </span>
                }

                <button>
                    Add Vacation
                </button>

            </form>

        </div>
    );
}
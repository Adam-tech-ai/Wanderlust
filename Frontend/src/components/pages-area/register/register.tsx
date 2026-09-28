import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { UserModel } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";
import { notify } from "../../../utils/notify";
import "./register.css";

export function Register() {

    // Create form management object:
    const { register, handleSubmit, formState } =
        useForm<UserModel>();

    // Create navigation object:
    const navigate = useNavigate();

    // Register new user:
    async function send(user: UserModel) {

        try {

            // Register user and save token:
            await authService.register(user);

            // Navigate to vacations:
            navigate("/vacations");
        }
        catch (err: any) {

            // Display error:
            notify.error(err);
        }
    }

    return (
        <div className="Register">

            <h2>Register</h2>

            <form onSubmit={handleSubmit(send)}>

                <label>First Name:</label>

                <input
                    type="text"
                    {...register("firstName", {
                        required: true
                    })}
                />

                {formState.errors.firstName &&
                    <span>First name is required.</span>
                }

                <label>Last Name:</label>

                <input
                    type="text"
                    {...register("lastName", {
                        required: true
                    })}
                />

                {formState.errors.lastName &&
                    <span>Last name is required.</span>
                }

                <label>Email:</label>

                <input
                    type="email"
                    {...register("email", {
                        required: true
                    })}
                />

                {formState.errors.email &&
                    <span>Email is required.</span>
                }

                <label>Password:</label>

                <input
                    type="password"
                    {...register("password", {
                        required: true,
                        minLength: 4
                    })}
                />

                {formState.errors.password &&
                    <span>Password must contain at least 4 characters.</span>
                }

                <button>Register</button>

            </form>

            <p>
                Already have an account?{" "}
                <NavLink to="/login">Login</NavLink>
            </p>

        </div>
    );
}
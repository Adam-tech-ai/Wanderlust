import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../models/credentials-model";
import { authService } from "../../../services/auth-service";
import { notify } from "../../../utils/notify";
import "./login.css";

export function Login() {

    // Create form management object:
    const { register, handleSubmit, formState } =
        useForm<CredentialsModel>();

    // Create navigation object:
    const navigate = useNavigate();

    // Login user:
    async function send(credentials: CredentialsModel) {

        try {

            // Login and save token:
            await authService.login(credentials);

            // Navigate to vacations:
            navigate("/vacations");
        }
        catch (err: any) {

            // Display error:
            notify.error(err);
        }
    }

    return (
        <div className="Login">

            <h2>Login</h2>

            <form onSubmit={handleSubmit(send)}>

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

                <button>Login</button>

            </form>

            <p>
                Don't have an account?{" "}
                <NavLink to="/register">Register</NavLink>
            </p>

        </div>
    );
}
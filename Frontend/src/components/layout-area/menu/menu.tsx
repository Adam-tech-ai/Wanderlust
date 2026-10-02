import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import "./menu.css";

export function Menu() {

    // Get currently logged-in user:
    const user = authService.getUser();
    const navigate = useNavigate();

    // Logout current user:
    function logout(): void {
        authService.logout();
        navigate("/login");
    }

    return (
        <div className="Menu">

            {!user &&
                <>
                    <NavLink to="/register">Register</NavLink>
                    {" | "}
                    <NavLink to="/login">Login</NavLink>
                </>
            }

            {user &&
                <>
                    <NavLink to="/vacations">
                        Vacations
                    </NavLink>

                    {user.role === "user" &&
                        <>
                            {" | "}
                            <NavLink to="/ai-recommendation">
                                AI Recommendation
                            </NavLink>
                        </>
                    }

                    {user.role === "admin" &&
                        <>
                            {" | "}
                            <NavLink to="/add-vacation">
                                Add Vacation
                            </NavLink>

                            {" | "}
                            <NavLink to="/reports">
                                Reports
                            </NavLink>
                        </>
                    }

                    {" | "}

                    <span>
                        {user.firstName} {user.lastName}
                    </span>

                    {" | "}

                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            }

        </div>
    );
}
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import "./menu.css";

// Displays the application navigation menu:
export function Menu() {

    // Get currently logged-in user:
    const user = authService.getUser();
    const navigate = useNavigate();

    // Logout current user:
    function logout(): void {

        // Remove user session:
        authService.logout();

        // Redirect to login page:
        navigate("/login");
    }

    return (
        <div className="Menu">

            {/* Guest menu: */}
            {!user &&
                <>
                    <NavLink to="/register">
                        Register
                    </NavLink>

                    {" | "}

                    <NavLink to="/login">
                        Login
                    </NavLink>
                </>
            }

            {/* Logged-in menu: */}
            {user &&
                <>
                    <NavLink to="/vacations">
                        Vacations
                    </NavLink>

                    {/* Regular user options: */}
                    {user.role === "user" &&
                        <>
                            {" | "}

                            <NavLink to="/ai-recommendation">
                                AI Recommendation
                            </NavLink>

                            {" | "}

                            <NavLink to="/mcp">
                                MCP
                            </NavLink>
                        </>
                    }

                    {/* Admin options: */}
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

                    {/* Logged-in user name: */}
                    <span>
                        {user.firstName} {user.lastName}
                    </span>

                    {" | "}

                    {/* Logout button: */}
                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            }

        </div>
    );
}
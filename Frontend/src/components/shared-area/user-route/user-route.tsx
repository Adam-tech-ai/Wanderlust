import { Navigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";

type UserRouteProps = {
    children: React.ReactNode;
};

export function UserRoute(
    props: UserRouteProps
) {

    // Get currently logged-in user:
    const user = authService.getUser();

    // Redirect guest to login:
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Redirect non-user to vacations:
    if (user.role !== "user") {
        return <Navigate to="/vacations" />;
    }

    // Display user-only page:
    return props.children;
}
import { Navigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";

type AdminRouteProps = {
    children: React.ReactNode;
};

export function AdminRoute(
    props: AdminRouteProps
) {

    // Get currently logged-in user:
    const user = authService.getUser();

    // Redirect guest to login:
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Redirect regular user to vacations:
    if (user.role !== "admin") {
        return <Navigate to="/vacations" />;
    }

    // Display admin page:
    return props.children;
}
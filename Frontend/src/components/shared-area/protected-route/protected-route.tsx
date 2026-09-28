import { Navigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export function ProtectedRoute(
    props: ProtectedRouteProps
) {

    // Get currently logged-in user:
    const user = authService.getUser();

    // Redirect guest to login:
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Display protected page:
    return props.children;
}
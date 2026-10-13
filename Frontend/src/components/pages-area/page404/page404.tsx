import { Link } from "react-router-dom";
import "./page404.css";

export function Page404() {

    return (
        <div className="Page404">

            {/* Explain that the requested page does not exist: */}
            <h1>404 — Page Not Found</h1>

            <p>
                The page you are looking for does not exist.
            </p>

            {/* Return to the vacations page; guests are redirected to login: */}
            <Link to="/vacations">
                Back to Vacations
            </Link>

        </div>
    );
}
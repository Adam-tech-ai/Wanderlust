import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../pages-area/about/about";
import { AddVacation } from "../../pages-area/add-vacation/add-vacation";
import { AiRecommendation } from "../../pages-area/ai-recommendation/ai-recommendation";
import { Data } from "../../pages-area/data/data";
import { EditVacation } from "../../pages-area/edit-vacation/edit-vacation";
import { Home } from "../../pages-area/home/home";
import { Login } from "../../pages-area/login/login";
import { Mcp } from "../../pages-area/mcp/mcp";
import { Page404 } from "../../pages-area/page404/page404";
import { Register } from "../../pages-area/register/register";
import { Reports } from "../../pages-area/reports/reports";
import { Vacations } from "../../pages-area/vacations/vacations";
import { AdminRoute } from "../../shared-area/admin-route/admin-route";
import { ProtectedRoute } from "../../shared-area/protected-route/protected-route";
import { UserRoute } from "../../shared-area/user-route/user-route";

// Defines all application routes:
export function Routing() {

    return (
        <Routes>

            {/* Public routes: */}
            <Route
                path="/"
                element={<Navigate to="/home" />}
            />

            <Route
                path="/home"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* Vacations page for logged-in users: */}
            <Route
                path="/vacations"
                element={
                    <ProtectedRoute>
                        <Vacations />
                    </ProtectedRoute>
                }
            />

            {/* AI recommendation page for regular users: */}
            <Route
                path="/ai-recommendation"
                element={
                    <UserRoute>
                        <AiRecommendation />
                    </UserRoute>
                }
            />

            {/* MCP data assistant page for regular users: */}
            <Route
                path="/mcp"
                element={
                    <UserRoute>
                        <Mcp />
                    </UserRoute>
                }
            />

            {/* Add vacation page for admin only: */}
            <Route
                path="/add-vacation"
                element={
                    <AdminRoute>
                        <AddVacation />
                    </AdminRoute>
                }
            />

            {/* Edit vacation page for admin only: */}
            <Route
                path="/edit-vacation/:id"
                element={
                    <AdminRoute>
                        <EditVacation />
                    </AdminRoute>
                }
            />

            {/* Reports page for admin only: */}
            <Route
                path="/reports"
                element={
                    <AdminRoute>
                        <Reports />
                    </AdminRoute>
                }
            />

            {/* Existing general pages: */}
            <Route
                path="/data"
                element={<Data />}
            />

            <Route
                path="/about"
                element={<About />}
            />

            {/* Page not found: */}
            <Route
                path="*"
                element={<Page404 />}
            />

        </Routes>
    );
}
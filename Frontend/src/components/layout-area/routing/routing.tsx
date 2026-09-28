import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../pages-area/about/about";
import { AddVacation } from "../../pages-area/add-vacation/add-vacation";
import { Data } from "../../pages-area/data/data";
import { EditVacation } from "../../pages-area/edit-vacation/edit-vacation";
import { Home } from "../../pages-area/home/home";
import { Login } from "../../pages-area/login/login";
import { Page404 } from "../../pages-area/page404/page404";
import { Register } from "../../pages-area/register/register";
import { Reports } from "../../pages-area/reports/reports";
import { Vacations } from "../../pages-area/vacations/vacations";
import { AdminRoute } from "../../shared-area/admin-route/admin-route";
import { ProtectedRoute } from "../../shared-area/protected-route/protected-route";

export function Routing() {
    return (
        <Routes>

            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/vacations"
                element={
                    <ProtectedRoute>
                        <Vacations />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/add-vacation"
                element={
                    <AdminRoute>
                        <AddVacation />
                    </AdminRoute>
                }
            />

            <Route
                path="/edit-vacation/:id"
                element={
                    <AdminRoute>
                        <EditVacation />
                    </AdminRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <AdminRoute>
                        <Reports />
                    </AdminRoute>
                }
            />

            <Route path="/data" element={<Data />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
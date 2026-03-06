import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { observeUser } from "./features/authSlice";
import { Login } from "./features/login/Login";
import { Register } from "./features/register/Register";
import PublicLayout from "./publicLayout";
import PrivateLayout from "./privateLayout";
import type { AppDispatch } from "./store/store";
import AdminBooks from "./features/admin/AdminBooks";
import PublicRoute from "./components/publicRoute/PublicRoute";
import RootLayout from "./components/rootLayout/RootLayout";
import ErrorPage from "./components/ErrorPage";
import BookDetail from "./features/detail/BookDetail";

const router = createBrowserRouter([
    // Rutas públicas generales
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <App />,
                errorElement: <ErrorPage />
            },
            {
                path: "/books/:id",
                element: <BookDetail />,
                errorElement: <ErrorPage />
            },
            {
                path: "*",
                element: <ErrorPage />
            }
        ],
    },
    // Rutas públicas SOLO si NO se esta logueado
    {
        element: (
            <PublicRoute>
                <PublicLayout />
            </PublicRoute>
        ),
        children: [
            {
                path: "/login",
                element: <Login />,
                errorElement: <ErrorPage />
            },
            {
                path: "/register",
                element: <Register />,
                errorElement: <ErrorPage />
            },
        ],
    },
    // Rutas privadas (requieren login)
    {
        element: (
            <PrivateRoute>
                <PrivateLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: "/admin/books",
                element: <AdminBooks />,
                errorElement: <ErrorPage />
            },
        ],
    },
]);

export const AppWithObserver = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => { // En la carga de la pantalla, se despacha el observeUser. Cada vez que se actualiza la pag, observa si estamos logeados y lo setea como estado global de la app.
        dispatch(observeUser());
    }, [dispatch]);

    return <RouterProvider router={router} />;
};
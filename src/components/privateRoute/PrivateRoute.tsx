import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { getAuthState } from "../../features/authSlice";
import type { ReactElement } from "react";
import { FullScreenLoader } from "../../components/FullScreenLoader";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
    const auth = useSelector(getAuthState); // estado global de autenticacion
    if (auth.loading) {
        return <FullScreenLoader message="Verificando sesión..." />;
    }
    return auth.user ? children : <Navigate to="/login" replace />; // si hay un user es porque esta logueado y muestra el children (lo que esta dentro del PrivateRoute en AppWithObserver). Sino te redirije al Login.
};

export default PrivateRoute;
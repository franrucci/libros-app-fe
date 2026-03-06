import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import { getAuthState } from "../../features/authSlice";
import type { ReactElement } from "react";
import { FullScreenLoader } from "../../components/FullScreenLoader";

const PublicRoute = ({ children }: { children: ReactElement }) => {
    const auth = useSelector(getAuthState);

    if (auth.loading) {
        return <FullScreenLoader message="Verificando sesión..." />;
    }

    return !auth.user ? children : <Navigate to="/" replace />;
};

export default PublicRoute;

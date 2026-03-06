import { useSelector } from "react-redux";
import { getAuthState } from "../../features/authSlice";
import PrivateLayout from "../../privateLayout";
import PublicLayout from "../../publicLayout";
import { FullScreenLoader } from "../FullScreenLoader";

const RootLayout = () => {
    const auth = useSelector(getAuthState);

    if (auth.loading) {
        return <FullScreenLoader message="Cargando..." />;
    }

    return auth.user ? <PrivateLayout /> : <PublicLayout />;
};

export default RootLayout;
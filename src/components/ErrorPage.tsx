import { useRouteError, isRouteErrorResponse, Link } from "react-router";

const ErrorPage = () => {
    const error = useRouteError();

    let status = 500;
    let titulo = "Ocurrió un error inesperado";
    let mensaje = "Algo salió mal. Por favor, intenta nuevamente más tarde.";

    if (isRouteErrorResponse(error)) {
        status = error.status;

        if (error.status === 404) {
            titulo = "Página no encontrada";
            mensaje = "La página que estás buscando no existe o fue movida.";
        }

        if (error.status === 401) {
            titulo = "No autorizado";
            mensaje = "No tienes permisos para acceder a esta sección.";
        }

        if (error.status === 500) {
            titulo = "Error interno del servidor";
            mensaje = "Ocurrió un problema en el servidor. Intenta nuevamente más tarde.";
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-6xl font-bold text-red-500 mb-4">{status}</h1>
            <h2 className="text-2xl font-semibold mb-2">{titulo}</h2>
            <p className="text-gray-600 mb-6">{mensaje}</p>

            <Link
                to="/"
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
                Volver al inicio
            </Link>
        </div>
    );
};

export default ErrorPage;
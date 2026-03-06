import axios from "axios";
import { auth } from "../firebase/firebase";

const publicApiAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

const firebaseAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

// REQUEST INTERCEPTOR: Se ejecuta ANTES de cada request.
firebaseAxios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token")?.replaceAll('""', ""); // Busca el token guardado.

        if (token) { // Si hay token, lo manda en el header automáticamente.
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Firebase renueva los tokens automáticamente.
        const user = auth.currentUser; // Si auth.currentUser es null, significa que el usuario realmente está deslogueado, osea, ahi no puede renovar token y se rechaza la request

        if (user) { // Entonces: Si hay usuario logueado. Pide un token. Lo guarda. Lo manda en el header. Esto evita usar tokens vencidos.
            const newToken = await user.getIdToken();
            localStorage.setItem("token", newToken);
            config.headers.Authorization = `Bearer ${newToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Se ejecuta cuando vuelve la respuesta.
// Esto me sirve para detectar 401 automáticamente e intenta renovar el token. Reintenta la request original.
firebaseAxios.interceptors.response.use(
    (response) => response, // si la response es exitosa, no hace nada, solo retorna la response.
    async (error) => { // Es caso de que exista un error:
        const originalRequest = error.config;

        // Detecta error 401
        if (error.response?.status === 401 && !originalRequest._retry) { // si el error es de 401 y no reintentamos la renovacion del token
            originalRequest._retry = true; // Marca que ya intentó reintentar (para evitar loop infinito).

            try {
                const user = auth.currentUser;
                if (user) {
                    const newToken = await user.getIdToken(true); // Fuerza renovación del token
                    localStorage.setItem("token", newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return firebaseAxios(originalRequest); // La request original se vuelve a ejecutar pero con token nuevo.
                }
            } catch (error) {
                console.error(error);
            }
        }

        return Promise.reject(error);
    }
);

export { firebaseAxios };

export { publicApiAxios }
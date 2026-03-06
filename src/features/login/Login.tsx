import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../store/store";
import { loginUser } from "../authSlice";
import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: false })
        .required()
        .messages({
            "string.empty": "El email es obligatorio",
            "string.email": "El email no es válido",
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.empty": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 6 caracteres",
        }),
});


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null); // Estado para error del formulario
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { user, loading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = loginSchema.validate(
            { email, password },
            { abortEarly: true }
        );

        if (error) {
            setFormError(error.details[0].message);
            return;
        }

        setFormError(null);
        dispatch(loginUser({ email, password }));
    };


    useEffect(() => {
        if (user) navigate("/admin/books");
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-800 animate-pulse-slow"></div>
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-purple-700/30 blur-3xl animate-spin-slow"></div>
            <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-2xl animate-spin-slow-reverse"></div>

            {/* Card central */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10">
                <h2 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight">
                    Bienvenido
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                    </div>

                    {/* Errores */}
                    {(formError || error) && (
                        <p className="text-red-400 text-sm">{formError || error}</p>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all bg-cyan-500 hover:bg-cyan-600 shadow-lg`}
                    >
                        {loading ? "Ingresando..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-white/70">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-purple-300 hover:underline">
                        Registrarse
                    </Link>
                </p>
            </div>
        </div>
    );
};
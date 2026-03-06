import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store/store";
import { registerUser } from "../authSlice";

export const Register = () => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { loading, error, user } = useSelector(
        (state: RootState) => state.auth
    );

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(
            registerUser({
                name,
                lastName,
                email,
                password,
            })
        );
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="flex-1 flex items-center justify-center relative overflow-hidden py-16">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-800 animate-pulse-slow"></div>
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full bg-purple-700/30 blur-3xl animate-spin-slow"></div>
            <div className="absolute -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-2xl animate-spin-slow-reverse"></div>

            {/* Card central */}
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10">
                <h2 className="text-4xl font-extrabold text-white text-center mb-8 tracking-tight">
                    Crear cuenta
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Apellido</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Tu apellido"
                            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                    </div>

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
                            minLength={6}
                            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                        />
                        <p className="text-xs text-white/60 mt-1">Mínimo 6 caracteres</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition-all bg-cyan-500 hover:bg-cyan-600 shadow-lg`}
                    >
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-white/70">
                    ¿Ya tenés cuenta?{" "}
                    <Link to="/login" className="text-purple-300 hover:underline">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

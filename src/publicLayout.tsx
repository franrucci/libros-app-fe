import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const PublicLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLinkClick = () => setMenuOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-800">

            {/* HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto h-[80px] px-6 flex justify-between items-center relative">

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight"
                    >
                        Biblioteca App
                    </Link>

                    {/* HAMBURGUESA BOTÓN */}
                    <div className="md:hidden absolute top-8 right-4 z-50">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex flex-col w-6 h-6 justify-center items-center gap-1 text-white focus:outline-none"
                        >
                            <span
                                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""
                                    }`}
                            ></span>
                            <span
                                className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"
                                    }`}
                            ></span>
                            <span
                                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                                    }`}
                            ></span>
                        </button>
                    </div>

                    {/* NAV */}
                    <nav>
                        <ul
                            className={`flex flex-col md:flex-row gap-6 md:gap-10 items-center text-white/90 font-medium
                            absolute md:static top-[80px] left-0 w-full md:w-auto bg-black/90 md:bg-transparent p-6 md:p-0 transition-all duration-300
                            ${menuOpen ? "block" : "hidden"} md:flex`}
                        >
                            {/* Inicio */}
                            <li className="relative group">
                                <Link
                                    to="/"
                                    onClick={handleLinkClick}
                                    className="transition duration-300"
                                >
                                    Inicio
                                </Link>
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                            </li>

                            {/* Login */}
                            <li>
                                <Link
                                    to="/login"
                                    onClick={handleLinkClick}
                                    className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
                                >
                                    Iniciar Sesión
                                </Link>
                            </li>

                            {/* Register */}
                            <li>
                                <Link
                                    to="/register"
                                    onClick={handleLinkClick}
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-cyan-500/30 transition-all duration-300"
                                >
                                    Registrarse
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex-grow pt-[80px]">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="text-center py-6 text-sm text-white/60 border-t border-white/10 backdrop-blur-md bg-white/5 rounded-t-xl shadow-inner">
                <p className="space-x-2">
                    <span>Biblioteca App</span>
                    <span>|</span>
                    <span>Desarrollado por Francisco Rucci</span>
                    <span>|</span>
                    <span>franrucci01@gmail.com</span>
                </p>
            </footer>
        </div>
    );
};

export default PublicLayout;
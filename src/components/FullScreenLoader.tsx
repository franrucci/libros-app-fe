export const FullScreenLoader = ({ message }: { message?: string }) => {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center 
                    bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-800 
                    z-50">

            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

            {/* Texto */}
            <p className="text-white mt-6 text-lg font-medium tracking-wide">
                {message || "Cargando..."}
            </p>
        </div>
    );
};
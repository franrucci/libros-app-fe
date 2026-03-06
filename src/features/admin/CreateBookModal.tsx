import { useState } from "react";
import { firebaseAxios } from "../../config/axios";
import Joi from "joi";

const schema = Joi.object({
    title: Joi.string().min(3).max(255).required().messages({
        "string.empty": "El título no puede estar vacío.",
        "string.min": "El título debe tener al menos 3 caracteres.",
        "string.max": "El título no puede superar los 255 caracteres.",
        "any.required": "El título es obligatorio.",
    }),
    author: Joi.string().min(3).max(255).required().messages({
        "string.empty": "El autor no puede estar vacío.",
        "string.min": "El autor debe tener al menos 3 caracteres.",
        "string.max": "El autor no puede superar los 255 caracteres.",
        "any.required": "El autor es obligatorio.",
    }),
    description: Joi.string().allow("").optional().messages({
        "string.base": "La descripción debe ser un texto.",
    }),
    publishedDate: Joi.date().optional().messages({
        "date.base": "La fecha de publicación debe ser válida.",
    }),
    coverImage: Joi.string().uri().allow("").optional().messages({
        "string.uri": "La imagen de portada debe ser una URL válida.",
    }),
});

interface Props {
    firebaseUid: string;
    onClose: () => void;
    onCreated: () => void;
}

const CreateBookModal = ({ firebaseUid, onClose, onCreated }: Props) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [publishedDate, setPublishedDate] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        // Validación front con Joi
        const { error } = schema.validate({ title, author, description, publishedDate, coverImage }, { abortEarly: false });
        if (error) {
            setErrors(error.details.map(d => d.message));
            setLoading(false);
            return;
        }

        try {
            await firebaseAxios.post("/book", {
                title,
                author,
                description,
                publishedDate,
                coverImage,
                firebaseUid,
            });

            setLoading(false);
            onCreated();
            onClose();
        } catch (error: any) {
            setLoading(false);
            if (error.response?.status === 400 && error.response.data?.details) {
                setErrors(error.response.data.details); // errores del backend
            } else {
                setErrors(["Error desconocido al crear el libro."]);
            }
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">

                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    Crear Nuevo Libro
                </h3>

                {/* Errores */}
                {errors.length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-lg mb-4 text-sm">
                        <ul className="list-disc list-inside">
                            {errors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white placeholder-white/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <input
                        type="text"
                        placeholder="Autor"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white placeholder-white/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white placeholder-white/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <input
                        type="date"
                        value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <input
                        type="text"
                        placeholder="URL de portada"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="bg-white/10 border border-white/20 text-white placeholder-white/50 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-white/30 text-white px-5 py-2 rounded-lg hover:bg-white/10 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-lg transition shadow-lg"
                        >
                            {loading ? "Creando..." : "Crear"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateBookModal;
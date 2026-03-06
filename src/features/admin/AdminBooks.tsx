import { useEffect, useState } from "react";
import { firebaseAxios } from "../../config/axios";
import CreateBookModal from "./CreateBookModal";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../features/authSlice";
import type { Book } from "../../types/books";
import EditBookModal from "./EditBookModal";

const AdminBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const user = useAppSelector(selectUser);
    const currentUserId = user?.uid;

    const fetchBooks = async () => {
        try {
            const response = await firebaseAxios.get("/book");
            setBooks(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDeleteHard = async () => {
        if (!selectedBook) return;
        await firebaseAxios.delete(`/book/hard/${selectedBook._id}`);
        setIsDeleteOpen(false);
        fetchBooks();
    };

    const handleDeleteSoft = async () => {
        if (!selectedBook) return;
        await firebaseAxios.patch(`/book/soft/${selectedBook._id}`);
        setIsDeleteOpen(false);
        fetchBooks();
    };

    return (
        <div className="min-h-full py-16 px-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        Administrar Libros
                    </h2>

                    {currentUserId && (
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all"
                        >
                            + Nuevo Libro
                        </button>
                    )}
                </div>

                {/* Lista */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl divide-y divide-white/10">

                    {books.length === 0 && (
                        <div className="p-12 text-center text-white/60">
                            <p className="text-lg">No hay libros registrados.</p>
                        </div>
                    )}

                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="flex justify-between items-center p-6 hover:bg-white/10 transition"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-14 h-14 object-cover rounded-md"
                                />

                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {book.title}
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                        Autor: <span className="text-cyan-300">{book.author}</span>
                                    </p>
                                    <p className="text-white/50 text-xs mt-1">
                                        Creado por: {book.user.name} {book.user.lastName}
                                    </p>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setIsEditOpen(true);
                                    }}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setIsDeleteOpen(true);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ------------------ MODALES ------------------ */}

            {isCreateOpen && currentUserId && (
                <CreateBookModal
                    firebaseUid={currentUserId}
                    onClose={() => setIsCreateOpen(false)}
                    onCreated={fetchBooks}
                />
            )}

            {isEditOpen && selectedBook && (
                <EditBookModal
                    book={selectedBook}
                    onClose={() => setIsEditOpen(false)}
                    onUpdated={fetchBooks}
                />
            )}

            {isDeleteOpen && selectedBook && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-96">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">
                            ¿Qué tipo de eliminación querés hacer?
                        </h3>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleDeleteSoft}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl transition"
                            >
                                Eliminación Lógica
                            </button>

                            <button
                                onClick={handleDeleteHard}
                                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition"
                            >
                                Eliminación Física
                            </button>

                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="border border-white/30 text-white py-3 rounded-xl hover:bg-white/10 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBooks;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Slider from "react-slick";
import type { Book } from "../../types/books";
import { publicApiAxios } from "../../config/axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BookDetail = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<Book | null>(null);
    const [externalBook, setExternalBook] = useState<any>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [authorBooks, setAuthorBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBook = async () => {
        try {

            const res = await publicApiAxios.get(`/book/${id}`);

            setBook(res.data);

        } catch (error) {

            console.error("Error obteniendo libro:", error);

        } finally {

            setLoading(false);

        }
    };

    const fetchOpenLibrary = async (title: string, author?: string) => {
        try {

            const res = await axios.get(
                `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
            );

            const result = res.data.docs?.[0];
            if (!result) return;

            setExternalBook(result);

            if (result.key) {

                const workRes = await axios.get(
                    `https://openlibrary.org${result.key}.json`
                );

                const desc = workRes.data.description;

                if (typeof desc === "string") setDescription(desc);
                else if (desc?.value) setDescription(desc.value);

            }

            if (author) {

                const authorRes = await axios.get(
                    `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}`
                );

                const books = authorRes.data.docs
                    .filter((b: any) => b.key !== result.key)
                    .filter((b: any) => b.cover_i)
                    .slice(0, 10);

                setAuthorBooks(books);

            }

        } catch (error) {

            console.error("Error OpenLibrary:", error);

        }
    };

    useEffect(() => {

        if (id) fetchBook();

    }, [id]);

    useEffect(() => {

        if (book?.title) {
            fetchOpenLibrary(book.title, book.author);
        }

    }, [book]);

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-lg">
                Cargando libro...
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-lg">
                No se encontró el libro
            </div>
        );
    }

    return (

        <div className="min-h-screen py-16 px-6 bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-800">

            <div className="max-w-6xl mx-auto">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-10 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
                >
                    ← Volver
                </button>

                <div className="grid md:grid-cols-2 gap-10">

                    <div className="flex justify-center">

                        <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-80 max-h-[500px] rounded-xl shadow-lg object-cover"
                        />

                    </div>

                    <div className="text-white space-y-6">

                        <h1 className="text-4xl font-bold">
                            {book.title}
                        </h1>

                        <p className="text-cyan-300 text-lg">
                            {book.author}
                        </p>

                        {externalBook?.first_publish_year && (
                            <p className="text-white/70">
                                Año de publicación: {externalBook.first_publish_year}
                            </p>
                        )}

                        {externalBook?.subject && (

                            <div className="flex flex-wrap gap-2">

                                {externalBook.subject.slice(0, 6).map((s: string) => (

                                    <span
                                        key={s}
                                        className="bg-cyan-500/20 border border-cyan-400/30 px-3 py-1 rounded-full text-sm"
                                    >
                                        {s}
                                    </span>

                                ))}

                            </div>

                        )}

                        <div>

                            <h2 className="text-xl font-semibold mb-2">
                                Descripción
                            </h2>

                            <p className="text-white/80 leading-relaxed">
                                {book.description || "No hay descripción disponible."}
                            </p>

                        </div>

                        {description && (

                            <div>

                                <h2 className="text-xl font-semibold mb-2">
                                    Descripción más detallada (OpenLibrary)
                                </h2>

                                <p className="text-white/70 italic leading-relaxed">
                                    {description}
                                </p>

                            </div>

                        )}

                        <p className="text-white/50 text-sm">
                            Agregado por {book.user?.name}
                        </p>

                    </div>

                </div>

                {authorBooks.length > 0 && (

                    <div className="mt-16">

                        <h2 className="text-2xl text-white mb-6">
                            Otros libros del mismo autor
                        </h2>

                        <Slider {...carouselSettings}>

                            {authorBooks.map((b: any) => (

                                <div key={b.key} className="px-2">

                                    <img
                                        src={`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`}
                                        alt={b.title}
                                        className="w-full h-48 object-cover rounded-lg shadow-md"
                                    />

                                    <p className="text-white text-sm mt-2 text-center">
                                        {b.title}
                                    </p>

                                </div>

                            ))}

                        </Slider>

                    </div>

                )}

            </div>

        </div>

    );
};

export default BookDetail;
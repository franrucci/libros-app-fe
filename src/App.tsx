import { useEffect, useMemo, useState } from "react";
import { publicApiAxios } from "./config/axios";

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  publishedDate?: string;
  coverImage?: string;
  user: {
    _id: string;
    name: string;
    lastName: string;
  };
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await publicApiAxios.get("/book");
      setBooks(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Error al obtener los libros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filtrado
  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-purple-900 via-indigo-900 to-cyan-800">
      <div className="flex-1 w-full px-6 py-16">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-5xl font-extrabold text-white mb-8 text-center tracking-tight">
            Biblioteca Digital
          </h1>

          {/* Input de búsqueda */}
          <div className="mb-12 flex justify-center">
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xl px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 backdrop-blur-md"
            />
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-white/80 text-lg">
              Cargando libros...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-400 text-lg">
              {error}
            </p>
          )}

          {/* Empty state */}
          {!loading && !error && filteredBooks.length === 0 && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">
                {search
                  ? "No se encontraron resultados"
                  : "No hay libros disponibles"}
              </h2>
              <p className="text-white/60">
                {search
                  ? "Intenta con otro término de búsqueda."
                  : "Todavía no se han cargado libros en la biblioteca."}
              </p>
            </div>
          )}

          {/* Grid de libros */}
          {!loading && !error && filteredBooks.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {book.title}
                    </h2>

                    <p className="text-white/80">
                      <span className="font-semibold text-cyan-300">
                        Autor:
                      </span>{" "}
                      {book.author}
                    </p>

                    {book.description && (
                      <p className="text-white/70 mt-3 text-sm leading-relaxed flex-1">
                        {book.description}
                      </p>
                    )}

                    {book.publishedDate && (
                      <p className="text-white/70 mt-3 text-sm">
                        <span className="font-semibold text-purple-300">
                          Fecha:
                        </span>{" "}
                        {new Date(book.publishedDate).toLocaleDateString()}
                      </p>
                    )}

                    {book.coverImage && (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="mt-4 w-full h-48 object-cover rounded-xl shadow-md"
                      />
                    )}
                  </div>

                  <p className="text-xs text-white/50 mt-4">
                    Creado por: {book.user.name} {book.user.lastName}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
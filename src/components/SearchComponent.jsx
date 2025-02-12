import { useState, useEffect } from 'react';
import { db } from '../utils/firebaseConfig'; // Configuración de Firebase
import { ref, onValue } from 'firebase/database';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Controla si el diálogo está abierto o cerrado

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setNewsResults([]);
      return;
    }

    const fetchCoursesAndNews = async () => {
      try {
        const coursesRef = ref(db, 'courses'); // Referencia a los cursos en Firebase
        const newsRef = ref(db, 'news'); // Referencia a las noticias en Firebase

        onValue(coursesRef, snapshot => {
          if (snapshot.exists()) {
            const coursesData = Object.entries(snapshot.val()).map(([id, course]) => ({
              id,
              ...course,
            }));

            // Filtrar los cursos según el término de búsqueda
            const filteredCourses = coursesData.filter(course =>
              course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setSearchResults(filteredCourses);
          } else {
            setSearchResults([]);
          }
        });

        onValue(newsRef, snapshot => {
          if (snapshot.exists()) {
            const newsData = Object.entries(snapshot.val()).map(([id, newsItem]) => ({
              id,
              ...newsItem,
            }));

            // Filtrar las noticias según el término de búsqueda
            const filteredNews = newsData.filter(newsItem =>
              newsItem.title.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setNewsResults(filteredNews);
          } else {
            setNewsResults([]);
          }
        });
      } catch (error) {
        console.error('Error fetching courses and news:', error);
      }
    };

    fetchCoursesAndNews();
  }, [searchTerm]);

  const closeDialog = (e) => {
    if (e.target.id === 'dialog-overlay') {
      setIsOpen(false);
      setSearchTerm('');
      setSearchResults([]);
      setNewsResults([]);
    }
  };

  return (
    <div className="relative">
      {/* Botón para abrir el diálogo */}
      <button
        className="py-[2px]"
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>

      </button>

      {/* Diálogo */}
      {isOpen && (
        <div
          id="dialog-overlay"
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeDialog}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Evita el cierre al hacer clic dentro
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
              <input
                id="course-search"
                type="text"
                placeholder="Buscar cursos y noticias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 text-black border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </form>

            <div className="divide-y divide-gray-300">
              {/* Resultados de Cursos */}
              {searchResults.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-700 mb-2">Cursos encontrados</h2>
                  <ul className="space-y-4">
                    {searchResults.map(course => (
                      <li key={course.id} onClick={() => setIsOpen(false)}>
                        <a
                          href={`/blog/${course.id}`}
                          className="flex items-center space-x-4"
                        >
                          <img
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                            src={course.image}
                            alt={course.title}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                            <p className="text-sm text-gray-600">
                              Nivel: {course.level} - Duración: {course.duration}
                            </p>
                            <p className="text-sm text-gray-600">Precio: {course.price} €</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resultados de Noticias */}
              {newsResults.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-700 mb-2">Noticias encontradas</h2>
                  <ul className="space-y-4">
                    {newsResults.map(newsItem => (
                      <li key={newsItem.id} onClick={() => setIsOpen(false)}>
                        <a
                          href={`/news/${newsItem.id}`}
                          className="flex items-center space-x-4"
                        >
                          <img
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                            src={newsItem.image}
                            alt={newsItem.title}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{newsItem.title}</h3>
                            <p className="text-sm text-gray-600">{newsItem.description}</p>
                            <p className="text-sm text-gray-500">{newsItem.date}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sin resultados */}
              {searchTerm && searchResults.length === 0 && newsResults.length === 0 && (
                <p className="text-gray-600 text-center mt-6">No se encontraron resultados.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
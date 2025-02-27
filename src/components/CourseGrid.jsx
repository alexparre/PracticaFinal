import React, { useState, useEffect } from "react";
import SearchComponentBar from "./SearchComponentBar";
import { useCurrencyStore } from '../context/CurrencyContext';
import CurrencyWrapper from './CurrencyWrapper';

const CourseGridContent = ({ courses = [] }) => {
  const [selectedLevel, setSelectedLevel] = useState("todos");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("es");
  const { currency, setCurrency, convertPrice } = useCurrencyStore();
  const coursesPerPage = 9;

  useEffect(() => {
    const storedLanguage = localStorage.getItem("preferredLanguage");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (language) {
      localStorage.setItem("preferredLanguage", language);
      // Forzar un re-render cuando cambia el idioma
      window.dispatchEvent(new Event('storage'));
    }
  }, [language]);

  const getTranslatedContent = (course) => {
    if (language === "en" && course?.translations?.en) {
      return {
        title: course.translations.en.title || course.title,
        description: course.translations.en.description || course.description,
        level: course.translations.en.level || course.level
      };
    }
    return {
      title: course.title,
      description: course.description,
      level: course.level
    };
  };

  const handleCourseClick = (courseId) => {
    window.location.href = `/blog/${courseId}`;
  };

  const validCourses = courses?.filter(course => course && course.id) || [];

  if (validCourses.length === 0) {
    return <p>Cargando cursos...</p>;
  }

  const sortedById = [...validCourses].sort((a, b) => parseInt(b.id) - parseInt(a.id));

  const filteredByLevel =
    selectedLevel === "todos"
      ? sortedById
      : sortedById.filter(course => course.level?.toLowerCase() === selectedLevel);

  const filteredBySearch = filteredByLevel.filter(course => {
    const translatedContent = getTranslatedContent(course);
    return translatedContent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           translatedContent.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedCourses = [...filteredBySearch].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortOption === "mostLikes") {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortOption === "leastHours") {
      return parseInt(a.duration || 0) - parseInt(b.duration || 0);
    }
    return 0;
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const newestCourseIds = sortedById.slice(0, 3).map(course => course?.id || "N/A");

  const goToNextPage = (event) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="course-grid p-5">
      {/* Filtros y Opciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Barra de búsqueda en tiempo real */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <SearchComponentBar onSearchChange={setSearchTerm} />
          </div>

          {/* Filtro de nivel */}
          <div className="flex flex-col">
            <label htmlFor="nivel" className="text-sm font-medium text-gray-700 mb-2">
              Nivel del Curso
            </label>
            <select
              id="nivel"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-100 transition-colors duration-200"
              onChange={(e) => {
                setSelectedLevel(e.target.value.toLowerCase());
                setCurrentPage(1);
              }}
            >
              <option value="todos">Todos los niveles</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          {/* Opciones de Orden */}
          <div className="flex flex-col">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              id="sort"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-100 transition-colors duration-200"
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Últimos Añadidos</option>
              <option value="mostLikes">Más Likes</option>
              <option value="leastHours">Menos Horas</option>
            </select>
          </div>

          {/* Selector de Idioma y Moneda */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Preferencias
            </label>
            <div className="flex gap-2">
              <select
                id="language"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-100 transition-colors duration-200"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  window.dispatchEvent(new Event('languageChange'));
                }}
              >
                <option value="es">🇪🇸 ES</option>
                <option value="en">🇬🇧 EN</option>
              </select>

              <select
                id="currency"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 hover:bg-gray-100 transition-colors duration-200"
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  window.dispatchEvent(new Event('currencyChange'));
                  localStorage.setItem('selectedCurrency', e.target.value);
                }}
              >
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas y resultados */}
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando {currentCourses.length} de {sortedCourses.length} cursos
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de cursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {currentCourses.map((course) => {
          const translatedContent = getTranslatedContent(course);
          return (
            <div 
              key={course.id} 
              className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => handleCourseClick(course.id)}
            >
              {/* Mostrar "NEW" para los 3 últimos cursos añadidos */}
              {selectedLevel === 'todos' && newestCourseIds.includes(course.id) && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-400 text-white text-xs font-bold uppercase py-1 px-3 rounded-full shadow-md z-10">
                  New
                </div>
              )}
              <a href={`/blog/${course.id}`}>
                <div className="relative">
                  <img
                    src={course.image}
                    alt={translatedContent.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-4 z-0">
                    
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {translatedContent.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {translatedContent.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-300 px-3 py-1 rounded-full">
                      {translatedContent.level}
                    </span>
                    <span className="text-sm font-medium text-cyan-600 bg-cyan-300 px-3 py-1 rounded-full">
                      {course.duration}
                    </span>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-red-500 mr-2">{course.likes}</span>
                      <svg
                        fill="red"
                        height="24px"
                        width="24px"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{convertPrice(course.price)} {currency}</span>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CourseGrid = (props) => {
  return (
    <CurrencyWrapper>
      <CourseGridContent {...props} />
    </CurrencyWrapper>
  );
};

export default CourseGrid;

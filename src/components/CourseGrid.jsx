import React, { useState } from "react";
import SearchComponentBar from "./SearchComponentBar";

const CourseGrid = ({ courses = [] }) => {
  const [selectedLevel, setSelectedLevel] = useState("todos");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para búsqueda en tiempo real
  const coursesPerPage = 9;

  // Filtrar cursos inválidos
  const validCourses = courses?.filter(course => course && course.id) || [];

  // Verificar si no hay cursos
  if (validCourses.length === 0) {
    return <p>Cargando cursos...</p>;
  }

  // Ordenar los cursos por ID (para encontrar los más nuevos)
  const sortedById = [...validCourses].sort((a, b) => parseInt(b.id) - parseInt(a.id));

  // Filtrar cursos según el nivel seleccionado
  const filteredByLevel =
    selectedLevel === "todos"
      ? sortedById
      : sortedById.filter(course => course.level?.toLowerCase() === selectedLevel);

  // Filtrar cursos por término de búsqueda en tiempo real
  const filteredBySearch = filteredByLevel.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenar cursos según la opción seleccionada
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

  // Paginación
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  // Obtener IDs de los 3 cursos más nuevos
  const newestCourseIds = sortedById.slice(0, 3).map(course => course?.id || "N/A");

  // Cambio de página
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
      <div className="flex justify-between items-center mt-6 mb-10">
        {/* Barra de búsqueda en tiempo real */}
        <SearchComponentBar onSearchChange={setSearchTerm} />

        {/* Filtro de nivel */}
        <div className="flex items-center">
          <label htmlFor="nivel" className="text-xl font-semibold text-gray-800 mr-4">
            Filtrar por Nivel:
          </label>
          <select
            id="nivel"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            onChange={(e) => {
              setSelectedLevel(e.target.value.toLowerCase());
              setCurrentPage(1); // Reiniciar a la primera página
            }}
          >
            <option value="todos">Todos los niveles</option>
            <option value="basico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        {/* Opciones de Orden */}
        <div className="flex items-center">
          <label htmlFor="sort" className="text-xl font-semibold text-gray-800 mr-4">
            Ordenar por:
          </label>
          <select
            id="sort"
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Últimos Añadidos</option>
            <option value="mostLikes">Más Likes</option>
            <option value="leastHours">Menos Horas</option>
          </select>
        </div>
      </div>
      {/* Grid de cursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {currentCourses.map((course) => (
          <div
            key={course.id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-transparent to-transparent text-white p-4 z-0">
                  
                </div>
              </div>
              <div className="p-6">
              <h3 className="text-xl font-bold">{course.title}</h3>
                <p className="text-gray-700 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium text-yellow-600 bg-yellow-300 px-3 py-1 rounded-full">
                    {course.level}
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
                  <span className="text-xl font-bold text-gray-900">{course.price} €</span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-between items-center mt-8">
        <button onClick={goToPreviousPage} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition" disabled={currentPage === 1}>
          Anterior
        </button>
        <span className="text-lg font-semibold text-gray-800">
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={goToNextPage} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CourseGrid;

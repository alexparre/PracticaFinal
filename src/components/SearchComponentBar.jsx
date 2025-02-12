import React, { useState } from "react";

const SearchComponentBar = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm); // Llamar a la función en tiempo real
  };

  return (
    <input
      type="text"
      placeholder="Buscar cursos..."
      value={searchTerm}
      onChange={handleChange} // Filtra en tiempo real
      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-80"
    />
  );
};

export default SearchComponentBar;

import { useState, useEffect } from "react";

export default function LanguageHandler2({ course }) {
  const [language, setLanguage] = useState("es");
  const [courseTitle, setCourseTitle] = useState(course?.title || '');
  const [courseDescription, setCourseDescription] = useState(course?.description || '');

  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLanguage") || "es";
    setLanguage(preferredLanguage);
    updateContent(preferredLanguage);

    // Escuchar cambios en el localStorage
    const handleStorageChange = (e) => {
      if (e.key === "preferredLanguage") {
        setLanguage(e.newValue);
        updateContent(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [course]);

  const updateContent = (selectedLanguage) => {
    if (selectedLanguage === "en" && course?.translations?.en) {
      setCourseTitle(course.translations.en.title || course.title);
      setCourseDescription(course.translations.en.description || course.description);
    } else {
      setCourseTitle(course.title);
      setCourseDescription(course.description);
    }
  };

  return (
    <div className="text-center"> {/* Contenedor centrado */}
      <h1 className="text-5xl font-extrabold mt-10 mb-4">{courseTitle}</h1>
      <p className="text-xl text-gray-700 mb-6">{courseDescription}</p>
    </div>
  );
  
}
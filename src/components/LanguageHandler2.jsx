import { useState, useEffect } from "react";

export default function LanguageHandler({ course }) {
  const [language, setLanguage] = useState("es");
  const [courseTitle, setCourseTitle] = useState(course.title);
  const [courseDescription, setCourseDescription] = useState(course.description);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const preferredLanguage = localStorage.getItem("preferredLanguage") || "es";
      console.log("🌍 Idioma detectado:", preferredLanguage);
      setLanguage(preferredLanguage);

      if (preferredLanguage === "en") {
        console.log("✅ Se está usando la versión en inglés del curso.");
        setCourseTitle(course?.translations?.en?.title || course.title);
        setCourseDescription(course?.translations?.en?.description || course.description);
      } else {
        console.log("✅ Se está usando la versión en español del curso.");
      }
    }
  }, [course]);

  return (
    <div className="text-center"> {/* Contenedor centrado */}
      <h1 className="text-5xl font-extrabold mt-10 mb-4">{courseTitle}</h1>
      <p className="text-xl text-gray-700 mb-6">{courseDescription}</p>
    </div>
  );
  
}
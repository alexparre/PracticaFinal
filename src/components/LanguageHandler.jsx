import { useState, useEffect } from "react";

export default function LanguageHandler({ course }) {
  const [language, setLanguage] = useState("es");
  const [courseTitle, setCourseTitle] = useState(course?.title || '');
  const [courseDescription, setCourseDescription] = useState(course?.description || '');

  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLanguage") || "es";
    setLanguage(preferredLanguage);
    updateContent(preferredLanguage);

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
    <>
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">{courseTitle}</h1>
      <p className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 p-3 text-xl font-bold inline-block rounded-full">
        {courseDescription}
      </p>
    </>
  );
}

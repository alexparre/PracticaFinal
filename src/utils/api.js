// URL base de la Realtime Database (Reemplaza con la tuya)
const BASE_URL = "https://proyectofinal-977a7-default-rtdb.europe-west1.firebasedatabase.app/"; 

// Obtén los cursos ordenados por clave (id)
export async function getCourses() {
  const response = await fetch(`${BASE_URL}/courses.json`);
  if (!response.ok) {
    throw new Error("Error al obtener los cursos");
  }
  const data = await response.json();
  return data ? Object.values(data).reverse() : [];
}

// Obtén los datos de un curso específico
export async function getCourse(id) {
  const response = await fetch(`${BASE_URL}/courses/${id}.json`);
  if (!response.ok) {
    throw new Error("Curso no encontrado");
  }
  const data = await response.json();
  if (!data) {
    throw new Error("Curso no encontrado");
  }
  return data;
}

// Obtén todas las rutas dinámicas para los cursos
export async function getCoursePaths() {
  const response = await fetch(`${BASE_URL}/courses.json`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data ? Object.keys(data).map((key) => ({ id: key })) : [];
}

// Obtén todas las noticias ordenadas por fecha más reciente
export async function getNews() {
  const response = await fetch(`${BASE_URL}/news.json`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  if (!data) {
    return [];
  }

  return Object.values(data).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Obtén los datos de una noticia específica
export async function getNewsItem(id) {
  const response = await fetch(`${BASE_URL}/news/${id}.json`);
  if (!response.ok) {
    throw new Error("Noticia no encontrada");
  }
  const data = await response.json();
  if (!data) {
    throw new Error("Noticia no encontrada");
  }
  return data;
}

// Obtén todas las rutas dinámicas para las noticias
export async function getNewsPaths() {
  const response = await fetch(`${BASE_URL}/news.json`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data ? Object.keys(data).map((key) => ({ id: key })) : [];
}

// Obtén los usuarios desde Firestore usando la API REST
export async function fetchUsers() {
  try {
    const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/TU_PROYECTO_ID/databases/(default)/documents/users`;
    
    const response = await fetch(FIRESTORE_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }
    
    const data = await response.json();
    
    if (!data.documents) {
      return {};
    }

    const users = {};
    data.documents.forEach((doc) => {
      const id = doc.name.split("/").pop(); // Extrae el ID del documento
      users[id] = doc.fields; // Guarda los datos del usuario
    });

    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios desde Firebase:", error);
    return {}; // Devuelve un objeto vacío en caso de error
  }
}

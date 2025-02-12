import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import { ref, get, set, update } from "firebase/database";
import useUserStore from "../utils/useUserStore";

export default function ProfileComponent() {
  const { user, setUser, clearUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [setUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await get(ref(db, "courses"));
        const coursesData = snapshot.val() ? Object.values(snapshot.val()) : [];
        setCourses(coursesData);
      } catch (err) {
        console.error("Error al cargar los cursos:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const snapshot = await get(ref(db, "users"));
      const users = snapshot.val() ? Object.values(snapshot.val()) : [];
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser); // Actualizar Zustand
        localStorage.setItem("user", JSON.stringify(foundUser)); // Guardar en LocalStorage
        setError("");
        setIsDialogOpen(false);
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      console.error(err);
      setError("Error al intentar iniciar sesión");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!name || !email || !password) {
        setError("Todos los campos son obligatorios");
        return;
      }

      const snapshot = await get(ref(db, "users"));
      const users = snapshot.val() || {};
      const newId = Object.keys(users).length + 1;

      const newUser = {
        id: newId.toString(),
        name,
        email,
        password,
        bookmarks: [],
        profilePicture: "https://via.placeholder.com/150",
        purchasedCourses: [],
        role: "student",
        createdAt: new Date().toISOString(),
      };

      await set(ref(db, `users/user${newId}`), newUser);

      setName("");
      setEmail("");
      setPassword("");
      setError("");
      alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      setIsRegistering(false);
    } catch (err) {
      console.error(err);
      setError("Error al registrar al usuario");
    }
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("user");

    setEmail("");
    setPassword("");
    setError("");
    setIsProfileVisible(false);
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleProfileVisibility = () => {
    setIsProfileVisible(!isProfileVisible);
  };

  return (
    <div>
      {!user ? (
        <>
          <button onClick={toggleDialog} className="prueba py-[2px] px-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="29"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M5.5 20a7.5 7.5 0 0 1 13 0"></path>
            </svg>
          </button>
          {isDialogOpen && (
            <div className="prueba fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white relative p-6 rounded-lg shadow-lg max-w-sm w-full">
                <button
                  onClick={toggleDialog}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  ✖
                </button>
                {isRegistering ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center text-black">
                      Registrarse
                    </h2>
                    {error && (
                      <p className="text-red-500 text-center">{error}</p>
                    )}
                    <div>
                      <label className="block text-gray-700 font-semibold">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-black border rounded px-4 py-2"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-black border rounded px-4 py-2"
                        placeholder="Correo electrónico"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-black border rounded px-4 py-2"
                        placeholder="Contraseña"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition"
                    >
                      Registrar
                    </button>
                    <p
                      onClick={() => setIsRegistering(false)}
                      className="text-blue-600 text-center mt-4 cursor-pointer"
                    >
                      ¿Ya tienes una cuenta? Inicia sesión.
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <h2 className="text-2xl font-bold text-center text-black">
                      Iniciar Sesión
                    </h2>
                    {error && (
                      <p className="text-red-500 text-center">{error}</p>
                    )}
                    <div>
                      <label className="block text-gray-700 font-semibold">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-black border rounded px-4 py-2"
                        placeholder="Correo electrónico"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-black border rounded px-4 py-2"
                        placeholder="Contraseña"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
                    >
                      Iniciar Sesión
                    </button>
                    <p
                      onClick={() => setIsRegistering(true)}
                      className="text-blue-600 text-center mt-4 cursor-pointer"
                    >
                      ¿No tienes cuenta? Regístrate.
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
            <button onClick={toggleProfileVisibility} className="prueba2  py-[2px] px-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M5.5 20a7.5 7.5 0 0 1 13 0"></path>
              </svg>
            </button>
          {isProfileVisible ? (<>
            <div className="xxx max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 fixed inset-0 overflow-y-auto">
              <button
                onClick={toggleProfileVisibility}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✖
              </button>
              <div className="flex items-center space-x-6">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-32 h-32 rounded-full shadow-md"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Bienvenido, {user.name}
                  </h2>
                  <p className="text-gray-600 mt-2">Email: {user.email}</p>
                  <p className="text-gray-600">Rol: {user.role}</p>
                  <p className="text-gray-600">
                    Fecha de Registro:{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-bold text-gray-700">
                  Cursos Comprados:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {user.purchasedCourses && user.purchasedCourses.length > 0 ? (
                    user.purchasedCourses.map((courseTag) => {
                      const course = courses.find((c) => c.tag === courseTag);
                      return course ? (
                        <li
                          key={course.id}
                          className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center"
                        >
                          <a
                            href={`/blog/${course.id}`}
                            className="flex items-center w-full"
                          >
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-16 h-16 rounded-md mr-4"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {course.title}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {course.description}
                              </p>
                            </div>
                          </a>
                        </li>
                      ) : null;
                    })
                  ) : (
                    <p className="text-gray-600">
                      No has comprado ningún curso.
                    </p>
                  )}
                </ul>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLogout}
                  className="w-40 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </>) : null}
        </>
      )}
    </div>
  );
}

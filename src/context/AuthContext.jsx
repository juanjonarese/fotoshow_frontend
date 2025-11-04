import { createContext, useState, useEffect } from "react";

// 1. Creamos el contexto (el "parlante" que todos escuchan)
export const AuthContext = createContext();

// 2. Creamos el Provider (el que controla el parlante)
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  // Al cargar la app, verificamos si hay un token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);
      setUser(userData ? JSON.parse(userData) : null);
    }

    setLoading(false); // Terminamos de cargar
  }, []);

  // Función para hacer login (la usaremos desde LoginScreen)
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setIsLoggedIn(true);
    setUser(userData);
  };

  // Función para hacer logout (la usaremos desde Navbar)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
  };

  // Lo que compartimos con todos los componentes
  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, LogOut, Upload } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // 👈 Importamos el contexto

const Navbar = () => {
  const navigate = useNavigate();

  // 👇 Ahora obtenemos el estado desde el contexto
  const { isLoggedIn, logout } = useContext(AuthContext);

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Llamamos a la función del contexto
    navigate("/");
    alert("Sesión cerrada correctamente");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <Camera className="text-primary me-2" size={28} />
          <span className="fw-bold">FotoShow</span>
        </Link>

        {/* Toggle para móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/caracteristicas" className="nav-link">
                Características
              </Link>
            </li> */}
            {/* <li className="nav-item">
              <Link to="/precios" className="nav-link">
                Precios
              </Link>
            </li> */}
            <li className="nav-item">
              <Link to="/contacto" className="nav-link">
                Contacto
              </Link>
            </li>

            {/* Mostrar según si está logeado o no */}
            {isLoggedIn ? (
              <>
                {/* Si está logeado: Subir fotos + Cerrar sesión */}
                <li className="nav-item ms-2">
                  <Link to="/up-photo" className="btn btn-primary btn-sm">
                    <Upload size={16} className="me-1" />
                    Subir Fotos
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <LogOut size={16} className="me-1" />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Si NO está logeado: Iniciar sesión + Registrarse */}
                <li className="nav-item ms-2">
                  <Link to="/login" className="btn btn-outline-primary btn-sm">
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item ms-2">
                  <Link to="/registrarse" className="btn btn-primary btn-sm">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

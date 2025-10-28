import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, LogOut, Upload } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
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
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contacto" className="nav-link">
                Contacto
              </Link>
            </li>

            {/* Mostrar según si está logeado o no */}
            {isLoggedIn ? (
              <>
                {/* Si está logeado: Subir fotos + Cerrar sesión */}
                <li className="nav-item">
                  <Link
                    to="/up-photo"
                    className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                  >
                    <Upload size={16} className="me-1" />
                    Subir Fotos
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center w-100"
                  >
                    <LogOut size={16} className="me-1" />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Si NO está logeado: Iniciar sesión + Registrarse */}
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/registrarse"
                    className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                  >
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

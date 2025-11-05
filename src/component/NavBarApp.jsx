import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, LogOut, Upload, ShoppingBag, BarChart3, ShoppingCart } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  // Verificar si el usuario es admin
  const esAdmin = user?.rol === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
    Swal.fire({
      icon: "success",
      title: "Sesión cerrada",
      text: "Tu sesión se cerró correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
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
              <Link to="/productos" className="nav-link">
                Productos
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/impresiones" className="nav-link">
                Impresiones
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
                {/* Si está logeado: Carrito + Subir fotos + Admin (si es admin) + Cerrar sesión */}
                <li className="nav-item">
                  <Link
                    to="/carrito"
                    className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center"
                  >
                    <ShoppingCart size={16} className="me-1" />
                    Carrito
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/up-photo"
                    className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                  >
                    <Upload size={16} className="me-1" />
                    Subir Fotos
                  </Link>
                </li>

                {/* Mostrar solo si es admin */}
                {esAdmin && (
                  <>
                    <li className="nav-item">
                      <Link
                        to="/admin/dashboard"
                        className="btn btn-info btn-sm d-flex align-items-center justify-content-center"
                      >
                        <BarChart3 size={16} className="me-1" />
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        to="/admin/productos"
                        className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
                      >
                        <ShoppingBag size={16} className="me-1" />
                        Admin Productos
                      </Link>
                    </li>
                  </>
                )}

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
                    to="/register"
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

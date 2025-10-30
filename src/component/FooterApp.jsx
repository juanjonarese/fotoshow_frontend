import React from "react";
import { Link } from "react-router-dom";
import { Camera, MapPin, Phone, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">
        <div className="row g-4">
          {/* Columna 1: Logo y descripción */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="navbar-brand-icon me-2">
                <Camera size={24} color="white" />
              </div>
              <h5 className="mb-0 fw-bold">FotoShow</h5>
            </div>
            <p className="text-white-50 mb-3">
              Dale vida a tus recuerdos con Foto Show. Expertos en impresiones,
              reproducciones y restauraciones de fotos.
            </p>
            {/* Redes sociales */}
            <div className="d-flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3">Enlaces</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/up-photo"
                  className="text-white-50 text-decoration-none"
                >
                  Subir Fotos
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/contacto"
                  className="text-white-50 text-decoration-none"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Servicios */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Servicios</h6>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">Impresiones de fotos</li>
              <li className="mb-2">Reproducciones</li>
              <li className="mb-2">Restauraciones</li>
              <li className="mb-2">Envío a domicilio</li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Contacto</h6>
            <div className="d-flex align-items-start mb-2">
              <MapPin size={18} className="text-white-50 me-2 mt-1 flex-shrink-0" />
              <span className="text-white-50">
                San Lorenzo 418, San Miguel de Tucumán 4000
              </span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <Phone size={18} className="text-white-50 me-2 flex-shrink-0" />
              <a
                href="tel:3815674535"
                className="text-white-50 text-decoration-none"
              >
                381 567-4535
              </a>
            </div>
          </div>
        </div>

        {/* Separador */}
        <hr className="border-secondary my-4" />

        {/* Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-white-50 mb-0 small">
              &copy; {new Date().getFullYear()} FotoShow. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

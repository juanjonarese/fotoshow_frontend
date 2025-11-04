import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";

const CardProductApp = ({ product }) => {
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen";
  };

  return (
    <div className="col">
      <div className="card h-100 shadow-sm hover-card">
        {/* Imagen del producto */}
        <img
          src={product.imagen}
          className="card-img-top"
          alt={product.titulo}
          style={{
            height: "200px",
            objectFit: "cover",
          }}
          onError={handleImageError}
        />

        {/* Badge de stock */}
        {product.stock <= 5 && product.stock > 0 && (
          <span
            className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark"
            style={{ zIndex: 1 }}
          >
            ¡Últimas unidades!
          </span>
        )}

        {product.stock === 0 && (
          <span
            className="position-absolute top-0 end-0 m-2 badge bg-danger"
            style={{ zIndex: 1 }}
          >
            Sin stock
          </span>
        )}

        <div className="card-body d-flex flex-column">
          {/* Categoría */}
          <div className="mb-2">
            <span className="badge bg-secondary">{product.categoria}</span>
          </div>

          {/* Título */}
          <h5 className="card-title fw-bold text-truncate" title={product.titulo}>
            {product.titulo}
          </h5>

          {/* Descripción */}
          <p
            className="card-text text-muted flex-grow-1"
            style={{
              fontSize: "0.9rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.descripcion}
          </p>

          {/* Precio */}
          <div className="mb-3">
            <h4 className="text-success mb-0">
              ${product.precio ? product.precio.toFixed(2) : "0.00"}
            </h4>
            <small className="text-muted">
              Stock: {product.stock || 0} {product.stock === 1 ? "unidad" : "unidades"}
            </small>
          </div>

          {/* Botones */}
          <div className="d-flex gap-2">
            <Link
              to={`/productos/${product._id}`}
              className="btn btn-login flex-grow-1"
              style={{
                opacity: product.stock === 0 ? 0.5 : 1,
                pointerEvents: product.stock === 0 ? "none" : "auto",
              }}
            >
              <Eye size={16} className="me-1" />
              Ver detalles
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default CardProductApp;

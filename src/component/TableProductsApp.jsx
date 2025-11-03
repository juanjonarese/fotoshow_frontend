import React, { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const TableProductsApp = ({ products, borrarProducto, updateProduct }) => {
  const MySwal = withReactContent(Swal);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      titulo: product.titulo,
      descripcion: product.descripcion,
      precio: product.precio,
      stock: product.stock,
      imagen: product.imagen,
      categoria: product.categoria,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id) => {
    try {
      // Validaciones básicas
      if (!editData.titulo || !editData.descripcion) {
        MySwal.fire({
          icon: "warning",
          title: "Campos vacíos",
          text: "El título y descripción son obligatorios",
        });
        return;
      }

      if (editData.precio <= 0) {
        MySwal.fire({
          icon: "warning",
          title: "Precio inválido",
          text: "El precio debe ser mayor a 0",
        });
        return;
      }

      await updateProduct(id, editData);

      MySwal.fire({
        icon: "success",
        title: "Producto actualizado",
        timer: 1500,
        showConfirmButton: false,
      });

      setEditingId(null);
      setEditData({});
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar el producto",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!products || products.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No hay productos disponibles. Agregue uno usando el formulario de arriba.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th style={{ width: "60px" }}>Imagen</th>
            <th>Título</th>
            <th>Descripción</th>
            <th style={{ width: "100px" }}>Precio</th>
            <th style={{ width: "80px" }}>Stock</th>
            <th style={{ width: "120px" }}>Categoría</th>
            <th style={{ width: "130px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              {/* Imagen */}
              <td>
                <img
                  src={product.imagen}
                  alt={product.titulo}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50?text=Sin+Imagen";
                  }}
                />
              </td>

              {/* Título */}
              <td>
                {editingId === product._id ? (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={editData.titulo}
                    onChange={(e) => handleInputChange("titulo", e.target.value)}
                  />
                ) : (
                  <strong>{product.titulo}</strong>
                )}
              </td>

              {/* Descripción */}
              <td>
                {editingId === product._id ? (
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    value={editData.descripcion}
                    onChange={(e) =>
                      handleInputChange("descripcion", e.target.value)
                    }
                  />
                ) : (
                  <small>{product.descripcion}</small>
                )}
              </td>

              {/* Precio */}
              <td>
                {editingId === product._id ? (
                  <input
                    type="number"
                    step="0.01"
                    className="form-control form-control-sm"
                    value={editData.precio}
                    onChange={(e) =>
                      handleInputChange("precio", parseFloat(e.target.value))
                    }
                  />
                ) : (
                  <span className="text-success fw-bold">
                    ${product.precio.toFixed(2)}
                  </span>
                )}
              </td>

              {/* Stock */}
              <td className="text-center">
                {editingId === product._id ? (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={editData.stock}
                    onChange={(e) =>
                      handleInputChange("stock", parseInt(e.target.value))
                    }
                  />
                ) : (
                  <span
                    className={`badge ${
                      product.stock > 10
                        ? "bg-success"
                        : product.stock > 0
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {product.stock}
                  </span>
                )}
              </td>

              {/* Categoría */}
              <td>
                {editingId === product._id ? (
                  <select
                    className="form-select form-select-sm"
                    value={editData.categoria}
                    onChange={(e) => handleInputChange("categoria", e.target.value)}
                  >
                    <option value="marcos">Marcos</option>
                    <option value="albums">Álbumes</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="impresiones">Impresiones</option>
                  </select>
                ) : (
                  <span className="badge bg-secondary">{product.categoria}</span>
                )}
              </td>

              {/* Acciones */}
              <td>
                {editingId === product._id ? (
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSaveEdit(product._id)}
                      title="Guardar"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCancelEdit}
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(product)}
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => borrarProducto(product)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableProductsApp;

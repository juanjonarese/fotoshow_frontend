import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const FormAddProductApp = ({ addProduct }) => {
  const MySwal = withReactContent(Swal);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Crear objeto producto con los datos del formulario
      const nuevoProducto = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        precio: parseFloat(data.precio),
        imagen: data.imagen,
        stock: parseInt(data.stock),
        categoria: data.categoria,
      };

      await addProduct(nuevoProducto);

      // El mensaje de éxito se muestra desde AdminProductsScreen
      reset(); // Limpiar formulario
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo agregar el producto",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row my-4">
      <div className="col">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-4">Agregar Nuevo Producto</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {/* Título */}
                <div className="col-md-6">
                  <label htmlFor="titulo" className="form-label">
                    Título <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
                    id="titulo"
                    {...register("titulo", {
                      required: "El título es obligatorio",
                      minLength: {
                        value: 3,
                        message: "Debe tener al menos 3 caracteres",
                      },
                    })}
                  />
                  {errors.titulo && (
                    <div className="invalid-feedback">{errors.titulo.message}</div>
                  )}
                </div>

                {/* Precio */}
                <div className="col-md-3">
                  <label htmlFor="precio" className="form-label">
                    Precio <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.precio ? "is-invalid" : ""}`}
                    id="precio"
                    {...register("precio", {
                      required: "El precio es obligatorio",
                      min: {
                        value: 0,
                        message: "El precio debe ser mayor a 0",
                      },
                    })}
                  />
                  {errors.precio && (
                    <div className="invalid-feedback">{errors.precio.message}</div>
                  )}
                </div>

                {/* Stock */}
                <div className="col-md-3">
                  <label htmlFor="stock" className="form-label">
                    Stock <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.stock ? "is-invalid" : ""}`}
                    id="stock"
                    {...register("stock", {
                      required: "El stock es obligatorio",
                      min: {
                        value: 0,
                        message: "El stock no puede ser negativo",
                      },
                    })}
                  />
                  {errors.stock && (
                    <div className="invalid-feedback">{errors.stock.message}</div>
                  )}
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                    id="descripcion"
                    rows="3"
                    {...register("descripcion", {
                      required: "La descripción es obligatoria",
                      minLength: {
                        value: 10,
                        message: "Debe tener al menos 10 caracteres",
                      },
                    })}
                  ></textarea>
                  {errors.descripcion && (
                    <div className="invalid-feedback">
                      {errors.descripcion.message}
                    </div>
                  )}
                </div>

                {/* Imagen URL */}
                <div className="col-md-8">
                  <label htmlFor="imagen" className="form-label">
                    URL de Imagen <span className="text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    className={`form-control ${errors.imagen ? "is-invalid" : ""}`}
                    id="imagen"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    {...register("imagen", {
                      required: "La URL de la imagen es obligatoria",
                      pattern: {
                        value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i,
                        message: "Debe ser una URL válida de imagen",
                      },
                    })}
                  />
                  {errors.imagen && (
                    <div className="invalid-feedback">{errors.imagen.message}</div>
                  )}
                </div>

                {/* Categoría */}
                <div className="col-md-4">
                  <label htmlFor="categoria" className="form-label">
                    Categoría <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.categoria ? "is-invalid" : ""}`}
                    id="categoria"
                    {...register("categoria", {
                      required: "La categoría es obligatoria",
                    })}
                  >
                    <option value="">Seleccione...</option>
                    <option value="marcos">Marcos</option>
                    <option value="albums">Álbumes</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="impresiones">Impresiones</option>
                  </select>
                  {errors.categoria && (
                    <div className="invalid-feedback">
                      {errors.categoria.message}
                    </div>
                  )}
                </div>

                {/* Botón Submit */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-login w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Agregando...
                      </>
                    ) : (
                      "Agregar Producto"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddProductApp;

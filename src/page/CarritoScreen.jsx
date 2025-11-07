import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../helpers/clientAxios";
import Swal from "sweetalert2";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

const CarritoScreen = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          icon: "warning",
          title: "Inicia sesión",
          text: "Debes iniciar sesión para ver tu carrito",
        });
        navigate("/login");
        return;
      }

      const response = await clientAxios.get("/carrito");

      if (response.data.carrito && response.data.carrito.items) {
        // Filtrar items inválidos (productos que no existen o no tienen datos)
        const itemsValidos = response.data.carrito.items.filter(item => {
          const esValido = item.producto &&
                          item.producto._id &&
                          item.precioUnitario !== undefined &&
                          item.subtotal !== undefined;

          if (!esValido) {
            console.warn("Item inválido encontrado:", item);
          }

          return esValido;
        });

        setCarrito(itemsValidos);

        // Si había items inválidos, avisar al usuario
        if (itemsValidos.length < response.data.carrito.items.length) {
          Swal.fire({
            icon: "warning",
            title: "Productos inválidos removidos",
            text: "Algunos productos en tu carrito ya no están disponibles y fueron removidos.",
            timer: 3000,
          });
        }
      } else {
        setCarrito([]);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      if (error.response?.status === 404) {
        setCarrito([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.msg ||
            "No se pudo cargar el carrito",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    try {
      const response = await clientAxios.put("/carrito/actualizar", {
        productoId,
        cantidad: nuevaCantidad,
      });

      if (response.data.carrito) {
        setCarrito(response.data.carrito.items);
        Swal.fire({
          icon: "success",
          title: "Cantidad actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.msg ||
          "No se pudo actualizar la cantidad",
      });
      cargarCarrito();
    }
  };

  const eliminarProducto = async (productoId) => {
    const result = await Swal.fire({
      icon: "question",
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await clientAxios.delete(
        `/carrito/eliminar/${productoId}`
      );

      if (response.data.carrito) {
        setCarrito(response.data.carrito.items);
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.msg ||
          "No se pudo eliminar el producto",
      });
    }
  };

  const vaciarCarrito = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Vaciar carrito?",
      text: "¿Estás seguro de que quieres eliminar todos los productos?",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await clientAxios.delete("/carrito/vaciar");
      setCarrito([]);
      Swal.fire({
        icon: "success",
        title: "Carrito vaciado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "No se pudo vaciar el carrito",
      });
    }
  };

  const procederAlPago = async () => {
    try {
      setProcesandoPago(true);

      console.log("🔵 Iniciando proceso de pago...");

      // Crear preferencia de pago en Mercado Pago
      const response = await clientAxios.post(
        "/mercadopago/crear-preferencia"
      );

      console.log("🟢 Respuesta del backend:", response.data);

      if (response.data.preferencia) {
        const { init_point, sandbox_init_point } =
          response.data.preferencia;

        console.log("🔗 init_point:", init_point);
        console.log("🔗 sandbox_init_point:", sandbox_init_point);

        // Usar sandbox_init_point siempre para credenciales de prueba
        const urlPago = sandbox_init_point || init_point;

        console.log("🚀 Redirigiendo a:", urlPago);

        if (!urlPago) {
          throw new Error("No se recibió URL de pago de Mercado Pago");
        }

        // Mostrar alerta de confirmación antes de redirigir
        await Swal.fire({
          icon: "success",
          title: "Redirigiendo a Mercado Pago",
          text: "Serás redirigido al sistema de pago en un momento...",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirigir al usuario a Mercado Pago
        console.log("⏳ Ejecutando redirect con window.location.href");
        window.location.href = urlPago;

        // Si después de 3 segundos no redirigió, mostrar error
        setTimeout(() => {
          console.error("⚠️ El redirect no funcionó después de 3 segundos");
          setProcesandoPago(false);
          Swal.fire({
            icon: "warning",
            title: "Problema con la redirección",
            html: `No se pudo redirigir automáticamente. <br><br>
                   <a href="${urlPago}" target="_blank" class="btn btn-primary">
                     Hacer clic aquí para ir a Mercado Pago
                   </a>`,
            showConfirmButton: false,
            showCloseButton: true,
          });
        }, 3000);
      } else {
        console.error("❌ No se recibió preferencia en la respuesta");
        throw new Error("No se recibió preferencia de pago");
      }
    } catch (error) {
      console.error("❌ Error al crear preferencia:", error);
      console.error("❌ Detalles del error:", error.response?.data);
      setProcesandoPago(false);
      Swal.fire({
        icon: "error",
        title: "Error al procesar pago",
        text:
          error.response?.data?.msg ||
          error.message ||
          "No se pudo iniciar el proceso de pago",
      });
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.subtotal, 0);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate("/productos")}
          >
            <ArrowLeft size={18} className="me-2" />
            Seguir comprando
          </button>
          <h1 className="fw-bold texto-home">
            <ShoppingCart className="me-2" size={40} />
            Mi Carrito
          </h1>
        </div>
      </div>

      {carrito.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm text-center py-5">
              <div className="card-body">
                <ShoppingCart size={80} className="text-muted mb-3" />
                <h3>Tu carrito está vacío</h3>
                <p className="text-muted">
                  Agrega productos para comenzar tu compra
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate("/productos")}
                >
                  Ver productos
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Lista de productos */}
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title mb-0">
                    Productos ({carrito.length})
                  </h5>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={vaciarCarrito}
                  >
                    <Trash2 size={16} className="me-1" />
                    Vaciar carrito
                  </button>
                </div>

                <div className="list-group list-group-flush">
                  {carrito.map((item) => (
                    <div
                      key={item.producto._id}
                      className="list-group-item px-0"
                    >
                      <div className="row align-items-center">
                        {/* Imagen */}
                        <div className="col-md-2 col-3">
                          <img
                            src={item.producto.imagen}
                            alt={item.producto.titulo}
                            className="img-fluid rounded"
                            style={{
                              width: "100%",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        {/* Info del producto */}
                        <div className="col-md-4 col-9">
                          <h6 className="mb-1">{item.producto?.titulo || "Producto sin nombre"}</h6>
                          <p className="text-muted small mb-0">
                            ${(item.precioUnitario || 0).toFixed(2)} c/u
                          </p>
                        </div>

                        {/* Controles de cantidad */}
                        <div className="col-md-3 col-6 mt-2 mt-md-0">
                          <div className="input-group input-group-sm">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                actualizarCantidad(
                                  item.producto._id,
                                  item.cantidad - 1
                                )
                              }
                              disabled={item.cantidad <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="text"
                              className="form-control text-center"
                              value={item.cantidad}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                actualizarCantidad(
                                  item.producto._id,
                                  item.cantidad + 1
                                )
                              }
                              disabled={
                                item.cantidad >= item.producto.stock
                              }
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <small className="text-muted">
                            Stock: {item.producto?.stock || 0}
                          </small>
                        </div>

                        {/* Subtotal y eliminar */}
                        <div className="col-md-3 col-6 mt-2 mt-md-0 text-end">
                          <p className="fw-bold mb-1 text-success">
                            ${(item.subtotal || 0).toFixed(2)}
                          </p>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              eliminarProducto(item.producto._id)
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h5 className="card-title mb-4">Resumen de compra</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-bold">
                    ${calcularTotal().toFixed(2)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Envío:</span>
                  <span className="text-success">A calcular</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5 fw-bold">Total:</span>
                  <span className="fs-5 fw-bold text-success">
                    ${calcularTotal().toFixed(2)}
                  </span>
                </div>

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={procederAlPago}
                  disabled={procesandoPago}
                >
                  {procesandoPago ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} className="me-2" />
                      Proceder al pago
                    </>
                  )}
                </button>

                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate("/productos")}
                >
                  Seguir comprando
                </button>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Pago seguro con Mercado Pago
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarritoScreen;

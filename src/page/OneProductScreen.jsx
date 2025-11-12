import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Offcanvas,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import clientAxios from "../helpers/clientAxios";
import "../css/unProducto.css";

const OneProductScreen = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Sincronizar carrito con localStorage
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = async (producto) => {
    try {
      // Agregar al carrito del backend
      const response = await clientAxios.post("/carrito/agregar", {
        productoId: producto._id,
        cantidad: 1,
      });

      // Actualizar el estado local con la respuesta del backend
      if (response.data.carrito) {
        const carritoItems = response.data.carrito.items.map((item) => ({
          _id: item.producto._id,
          titulo: item.producto.titulo,
          precio: item.precioUnitario,
          imagen: item.producto.imagen,
          stock: item.producto.stock,
          cantidad: item.cantidad,
        }));
        setCarrito(carritoItems);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "No se pudo agregar el producto al carrito",
      });
    }
  };

  const quitarDelCarrito = async (id) => {
    try {
      const item = carrito.find((item) => item._id === id);
      if (!item) return;

      const nuevaCantidad = item.cantidad - 1;

      // Actualizar cantidad en el backend
      const response = await clientAxios.put("/carrito/actualizar", {
        productoId: id,
        cantidad: nuevaCantidad,
      });

      // Actualizar estado local
      if (response.data.carrito) {
        const carritoItems = response.data.carrito.items.map((item) => ({
          _id: item.producto._id,
          titulo: item.producto.titulo,
          precio: item.precioUnitario,
          imagen: item.producto.imagen,
          stock: item.producto.stock,
          cantidad: item.cantidad,
        }));
        setCarrito(carritoItems);
      }
    } catch (error) {
      console.error("Error al quitar del carrito:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "No se pudo actualizar el carrito",
      });
    }
  };

  const eliminarProducto = async (id) => {
    try {
      // Eliminar del backend
      const response = await clientAxios.delete(`/carrito/eliminar/${id}`);

      // Actualizar estado local
      if (response.data.carrito) {
        const carritoItems = response.data.carrito.items.map((item) => ({
          _id: item.producto._id,
          titulo: item.producto.titulo,
          precio: item.precioUnitario,
          imagen: item.producto.imagen,
          stock: item.producto.stock,
          cantidad: item.cantidad,
        }));
        setCarrito(carritoItems);
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "No se pudo eliminar el producto",
      });
    }
  };

  const crearPreferencia = async () => {
    try {
      if (carrito.length === 0) {
        MySwal.fire({
          icon: "warning",
          title: "Carrito vacío",
          text: "No hay productos en el carrito para procesar el pago",
        });
        return;
      }

      MySwal.fire({
        icon: "info",
        title: "Procesando pago...",
        text: "Redirigiendo a Mercado Pago...",
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      // Crear preferencia de pago en Mercado Pago
      const response = await clientAxios.post("/mercadopago/crear-preferencia");

      console.log("🟢 Respuesta del backend:", response.data);

      if (response.data.preferencia) {
        const { init_point } = response.data.preferencia;

        console.log("🔗 init_point:", init_point);

        if (!init_point) {
          throw new Error("No se recibió URL de pago de Mercado Pago");
        }

        // Mostrar alerta de confirmación antes de redirigir
        await MySwal.fire({
          icon: "success",
          title: "Redirigiendo a Mercado Pago",
          text: "Serás redirigido al sistema de pago en un momento...",
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirigir a Mercado Pago
        console.log("🚀 Redirigiendo a:", init_point);
        window.location.href = init_point;
      } else {
        throw new Error(response.data.msg || "Error al crear preferencia de pago");
      }
    } catch (error) {
      console.error("❌ Error al crear la preferencia:", error);
      MySwal.fire({
        icon: "error",
        title: "Error al procesar el pago",
        text: error.response?.data?.msg || error.message || "No se pudo procesar el pago. Por favor, intenta nuevamente.",
        confirmButtonText: "Entendido",
      });
    }
  };

  // Cargar carrito del backend al montar el componente
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const response = await clientAxios.get("/carrito");
        if (response.data.carrito && response.data.carrito.items) {
          const carritoItems = response.data.carrito.items.map((item) => ({
            _id: item.producto._id,
            titulo: item.producto.titulo,
            precio: item.precioUnitario,
            imagen: item.producto.imagen,
            stock: item.producto.stock,
            cantidad: item.cantidad,
          }));
          setCarrito(carritoItems);
        }
      } catch (error) {
        console.error("Error al cargar carrito:", error);
        // Si hay error (ej: no está logueado), usar localStorage
      }
    };
    cargarCarrito();
  }, []);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        setLoading(true);
        const respuesta = await clientAxios.get(`/productos/${id}`);
        setProduct(respuesta.data.producto);
        setError(null);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    obtenerProducto();
  }, [id]);

  const handleComprar = () => {
    agregarAlCarrito(product);
    setMostrarCarrito(true);
    MySwal.fire({
      icon: "success",
      title: "¡Agregado al carrito!",
      text: `El producto "${product.titulo}" se agregó correctamente`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row py-5">
          <div className="col text-center">
            <h3>Cargando información del producto...</h3>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="row py-5">
          <div className="col">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row py-2">
        <div className="col text-center">
          <h1 className="fw-bold texto-home">Detalle de producto</h1>
        </div>
      </div>

      <div className="product-card">
        <div className="product-image">
          <img src={product.imagen} alt={product.titulo} />
        </div>
        <div className="product-info">
          <h2>{product.titulo}</h2>
          <p>{product.descripcion}</p>
          <div className="d-flex justify-content-between align-items-center mt-1">
            {product && (
              <div className="d-flex gap-2">
                <button
                  className="buy-button btn-login"
                  onClick={handleComprar}
                >
                  Comprar Ahora
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => setMostrarCarrito(true)}
                >
                  Ver Carrito ({carrito.length})
                </button>
              </div>
            )}
            <div className="product-price">${product.precio}</div>
          </div>
        </div>
      </div>
      <Offcanvas
        show={mostrarCarrito}
        onHide={() => setMostrarCarrito(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ color: "#235850", fontWeight: "700" }}>
            🛒 Carrito de Compras
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {carrito.length === 0 ? (
            <p style={{ color: "#347e71" }}>No hay productos en el carrito.</p>
          ) : (
            <>
              <ListGroup variant="flush">
                {carrito.map((item) => (
                  <ListGroup.Item
                    key={item._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong style={{ color: "#235850" }}>
                        {item.titulo}
                      </strong>
                      <p className="mb-1" style={{ color: "#347e71" }}>
                        Cantidad: {item.cantidad}
                      </p>
                      <p
                        className="mb-0"
                        style={{ color: "#4caf8f", fontWeight: "600" }}
                      >
                        Precio: ${item.precio ? item.precio.toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#57ad88", border: "none" }}
                        onClick={() => agregarAlCarrito(item)}
                      >
                        ➕
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "#ffc107",
                          border: "none",
                          color: "#235850",
                        }}
                        onClick={() => quitarDelCarrito(item._id)}
                      >
                        ➖
                      </Button>
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#d9534f", border: "none" }}
                        onClick={() => eliminarProducto(item._id)}
                      >
                        🗑
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-3">
                <h5 style={{ color: "#57ad88" }} className="text-end">
                  Total: $
                  {carrito.reduce(
                    (acc, item) => acc + (item.precio || 0) * item.cantidad,
                    0
                  ).toFixed(2)}
                </h5>
                <div className="d-grid gap-2">
                  <Button
                    className="mt-2"
                    style={{ backgroundColor: "#57ad88", border: "none" }}
                    onClick={crearPreferencia}
                  >
                    Proceder a Pagar
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setMostrarCarrito(false);
                      navigate("/productos");
                    }}
                  >
                    Seguir Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default OneProductScreen;

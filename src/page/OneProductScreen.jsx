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
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import clientAxios from "../helpers/clientAxios";
import "../css/unProducto.css";

const OneProductScreen = () => {
  const MySwal = withReactContent(Swal);
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
      // Actualizar en la base de datos
      await clientAxios.post("/carrito/agregar", {
        productoId: producto.id,
        cantidad: 1,
      });

      // Actualizar el estado local
      setCarrito((prev) => {
        const existe = prev.find((item) => item.id === producto.id);
        if (existe) {
          return prev.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }
        return [...prev, { ...producto, cantidad: 1 }];
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto al carrito",
      });
    }
  };

  const quitarDelCarrito = async (id) => {
    try {
      // Actualizar en la base de datos
      await clientAxios.put("/carrito/quitar", {
        productoId: id,
        cantidad: 1,
      });

      // Actualizar el estado local
      setCarrito((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
          )
          .filter((item) => item.cantidad > 0)
      );
    } catch (error) {
      console.error("Error al quitar producto del carrito:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo quitar el producto del carrito",
      });
    }
  };

  const eliminarProducto = async (id) => {
    try {
      // Eliminar de la base de datos
      await clientAxios.delete(`/carrito/eliminar/${id}`);

      // Actualizar el estado local
      setCarrito((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el producto del carrito",
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

      // Preparar datos del pedido
      const datosPedido = {
        productos: carrito.map((item) => ({
          productoId: item._id || item.id,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total: carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
      };

      MySwal.fire({
        icon: "info",
        title: "Procesando pago...",
        text: "Redirigiendo a pasarela de pago",
        timer: 2000,
        showConfirmButton: false,
      });

      // TODO: Aquí deberás integrar con tu backend para crear preferencia de Mercado Pago
      // const response = await clientAxios.post("/pagos/crear-preferencia", datosPedido);
      // window.location.href = response.data.init_point; // Redirigir a Mercado Pago

      console.log("Datos del pedido:", datosPedido);
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo procesar el pago",
      });
    }
  };

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
                    key={item.id}
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
                        Precio: ${item.precio}
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
                        onClick={() => quitarDelCarrito(item.id)}
                      >
                        ➖
                      </Button>
                      <Button
                        size="sm"
                        style={{ backgroundColor: "#d9534f", border: "none" }}
                        onClick={() => eliminarProducto(item.id)}
                      >
                        🗑
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <div className="mt-3 text-end">
                <h5 style={{ color: "#57ad88" }}>
                  Total: $
                  {carrito.reduce(
                    (acc, item) => acc + item.precio * item.cantidad,
                    0
                  )}
                </h5>
                <Button
                  className="mt-2 w-100"
                  style={{ backgroundColor: "#57ad88", border: "none" }}
                  onClick={crearPreferencia}
                >
                  Proceder a Pagar
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default OneProductScreen;

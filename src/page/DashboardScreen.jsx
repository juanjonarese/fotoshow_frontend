import { useState, useEffect } from "react";
import clientAxios from "../helpers/clientAxios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Calendar,
  Filter
} from "lucide-react";

const DashboardScreen = () => {
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const response = await clientAxios.get(`/estadisticas?${params.toString()}`);
      setEstadisticas(response.data.estadisticas);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "No se pudieron cargar las estadísticas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const handleFiltrar = () => {
    cargarEstadisticas();
  };

  const handleLimpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setTimeout(() => cargarEstadisticas(), 100);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">No hay datos disponibles</div>
      </div>
    );
  }

  const { resumen, porEstado, porMetodoPago, productosMasVendidos, ventasPorDia } =
    estadisticas;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold texto-home">
            <TrendingUp className="me-2" size={40} />
            Dashboard de Ventas
          </h1>
          <p className="text-muted">Estadísticas y métricas de tu negocio</p>
        </div>
      </div>

      {/* Filtros de Fecha */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <Filter size={20} className="me-2" />
                Filtros
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">
                    <Calendar size={16} className="me-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <Calendar size={16} className="me-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end gap-2">
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={handleFiltrar}
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleLimpiarFiltros}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="row g-4 mb-4">
        {/* Total Transacciones */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Total Transacciones</p>
                  <h2 className="fw-bold mb-0">{resumen.totalTransacciones}</h2>
                </div>
                <div
                  className="rounded-circle p-3"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <ShoppingCart size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monto Total */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Monto Total</p>
                  <h2 className="fw-bold mb-0 text-success">
                    ${resumen.montoTotal.toLocaleString()}
                  </h2>
                </div>
                <div
                  className="rounded-circle p-3"
                  style={{ backgroundColor: "#e8f5e9" }}
                >
                  <DollarSign size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Ticket Promedio</p>
                  <h2 className="fw-bold mb-0 text-info">
                    ${parseFloat(resumen.ticketPromedio).toLocaleString()}
                  </h2>
                </div>
                <div
                  className="rounded-circle p-3"
                  style={{ backgroundColor: "#e0f7fa" }}
                >
                  <TrendingUp size={24} className="text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Vendidos */}
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="text-muted mb-1">Productos Vendidos</p>
                  <h2 className="fw-bold mb-0 text-warning">
                    {productosMasVendidos.reduce((sum, p) => sum + p.totalVendido, 0)}
                  </h2>
                </div>
                <div
                  className="rounded-circle p-3"
                  style={{ backgroundColor: "#fff8e1" }}
                >
                  <Package size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transacciones por Estado */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Transacciones por Estado</h5>
              {porEstado.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Estado</th>
                        <th className="text-end">Cantidad</th>
                        <th className="text-end">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porEstado.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <span className={`badge bg-${
                              item._id === "completada"
                                ? "success"
                                : item._id === "pendiente"
                                ? "warning"
                                : "secondary"
                            }`}>
                              {item._id}
                            </span>
                          </td>
                          <td className="text-end">{item.cantidad}</td>
                          <td className="text-end text-success fw-bold">
                            ${item.monto.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Métodos de Pago</h5>
              {porMetodoPago.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Método</th>
                        <th className="text-end">Cantidad</th>
                        <th className="text-end">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porMetodoPago.map((item) => (
                        <tr key={item._id}>
                          <td className="text-capitalize">{item._id}</td>
                          <td className="text-end">{item.cantidad}</td>
                          <td className="text-end text-success fw-bold">
                            ${item.monto.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay datos disponibles</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">
                Top 10 Productos Más Vendidos
              </h5>
              {productosMasVendidos.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th className="text-end">Unidades Vendidas</th>
                        <th className="text-end">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosMasVendidos.map((producto, index) => (
                        <tr key={producto._id}>
                          <td>{index + 1}</td>
                          <td>{producto.titulo || "Sin título"}</td>
                          <td className="text-end">
                            <span className="badge bg-primary">
                              {producto.totalVendido}
                            </span>
                          </td>
                          <td className="text-end text-success fw-bold">
                            ${producto.ingresos.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay productos vendidos aún</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

import { useEffect, useState } from "react";
import CardProductApp from "../component/CardProductApp";
import clientAxios from "../helpers/clientAxios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Camera, Sparkles } from "lucide-react";

const ImpresionesScreen = () => {
  const MySwal = withReactContent(Swal);
  const [impresiones, setImpresiones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener solo productos de categoría "impresiones"
  const getImpresiones = async () => {
    try {
      setLoading(true);
      const respuesta = await clientAxios.get("/productos");

      if (respuesta.status === 200) {
        const todosLosProductos = respuesta.data.productos || respuesta.data;
        // Filtrar solo los productos de categoría "impresiones"
        const soloImpresiones = todosLosProductos.filter(
          (producto) => producto.categoria === "impresiones"
        );
        setImpresiones(soloImpresiones);
      } else {
        MySwal.fire({
          title: "Error",
          text: "No se pudieron cargar las promociones de impresión",
          icon: "error",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un error al cargar las promociones",
        icon: "error",
      });
      console.error("Error al obtener impresiones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getImpresiones();
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="row py-5">
        <div className="col text-center">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <Camera size={48} className="text-primary me-3" />
            <h1 className="fw-bold texto-home mb-0">Impresiones y Revelado</h1>
            <Sparkles size={48} className="text-warning ms-3" />
          </div>
          <p className="lead">
            Descubrí nuestras promociones especiales para revelar tus mejores
            momentos
          </p>
          <p className="text-muted">
            Calidad profesional, precios accesibles y entrega rápida
          </p>
        </div>
      </div>

      {/* Productos de Impresiones */}
      {loading ? (
        <div className="row">
          <div className="col text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h3 className="mt-3">Cargando promociones...</h3>
          </div>
        </div>
      ) : impresiones.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
          {impresiones.map((impresion) => (
            <CardProductApp key={impresion._id} product={impresion} />
          ))}
        </div>
      ) : (
        <div className="row">
          <div className="col text-center py-5">
            <Camera size={64} className="text-muted mb-3" />
            <h3>No hay promociones de impresión disponibles</h3>
            <p className="text-muted">
              Volvé pronto para ver nuestras nuevas ofertas de revelado
            </p>
          </div>
        </div>
      )}

      {/* Info adicional */}
      {impresiones.length > 0 && (
        <div className="row py-5 bg-light rounded-3 mb-5">
          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <div className="fs-1 mb-2">📸</div>
            <h5 className="fw-bold">Alta Calidad</h5>
            <p className="text-muted small mb-0">
              Impresión profesional en papel fotográfico premium
            </p>
          </div>
          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            <div className="fs-1 mb-2">⚡</div>
            <h5 className="fw-bold">Entrega Rápida</h5>
            <p className="text-muted small mb-0">
              Recibí tus fotos en pocos días o retiralas en nuestro local
            </p>
          </div>
          <div className="col-12 col-md-4 text-center">
            <div className="fs-1 mb-2">💝</div>
            <h5 className="fw-bold">Momentos Únicos</h5>
            <p className="text-muted small mb-0">
              Convertí tus recuerdos digitales en fotografías tangibles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpresionesScreen;

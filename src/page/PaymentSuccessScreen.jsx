import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";

const PaymentSuccessScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar localStorage del carrito (si lo usabas)
    localStorage.removeItem("carrito");
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center py-5">
              {/* Icono de éxito */}
              <div className="mb-4">
                <CheckCircle
                  size={100}
                  className="text-success"
                  strokeWidth={1.5}
                />
              </div>

              {/* Mensaje principal */}
              <h1 className="fw-bold mb-3 text-success">¡Pago exitoso!</h1>
              <p className="text-muted fs-5 mb-4">
                Tu compra ha sido procesada correctamente
              </p>

              {/* Información adicional */}
              <div className="alert alert-info mb-4">
                <p className="mb-0">
                  <strong>¿Qué sigue?</strong>
                </p>
                <p className="mb-0 small">
                  Recibirás un email de confirmación con los detalles de tu
                  pedido. Nos pondremos en contacto contigo para coordinar la
                  entrega.
                </p>
              </div>

              {/* Botones */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/productos")}
                >
                  <ShoppingBag size={20} className="me-2" />
                  Seguir comprando
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate("/")}
                >
                  <Home size={20} className="me-2" />
                  Volver al inicio
                </button>
              </div>

              {/* Decoración */}
              <div className="mt-5">
                <p className="text-muted small mb-0">
                  Gracias por confiar en FotoShow
                </p>
                <div className="mt-3">
                  <span className="badge bg-success me-2">
                    Pago confirmado
                  </span>
                  <span className="badge bg-info">Pedido en proceso</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;

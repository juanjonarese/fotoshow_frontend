import { useNavigate } from "react-router-dom";
import { Clock, Home, ShoppingBag } from "lucide-react";

const PaymentPendingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center py-5">
              {/* Icono de pendiente */}
              <div className="mb-4">
                <Clock
                  size={100}
                  className="text-warning"
                  strokeWidth={1.5}
                />
              </div>

              {/* Mensaje principal */}
              <h1 className="fw-bold mb-3 text-warning">Pago pendiente</h1>
              <p className="text-muted fs-5 mb-4">
                Tu pago está siendo procesado
              </p>

              {/* Información adicional */}
              <div className="alert alert-info mb-4">
                <p className="mb-2">
                  <strong>¿Qué significa esto?</strong>
                </p>
                <p className="mb-0 small">
                  Tu pago está en proceso de verificación. Esto puede
                  suceder con algunos métodos de pago como transferencias
                  bancarias o pagos en efectivo. Te notificaremos por email
                  cuando el pago sea confirmado.
                </p>
              </div>

              <p className="text-muted mb-4">
                Puedes consultar el estado de tu pedido en cualquier momento.
              </p>

              {/* Botones */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/")}
                >
                  <Home size={20} className="me-2" />
                  Volver al inicio
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate("/productos")}
                >
                  <ShoppingBag size={20} className="me-2" />
                  Ver productos
                </button>
              </div>

              {/* Decoración */}
              <div className="mt-5">
                <p className="text-muted small mb-0">
                  Recibirás un email cuando el pago sea confirmado
                </p>
                <div className="mt-3">
                  <span className="badge bg-warning text-dark me-2">
                    Pago pendiente
                  </span>
                  <span className="badge bg-secondary">
                    En verificación
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingScreen;

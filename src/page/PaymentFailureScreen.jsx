import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";

const PaymentFailureScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center py-5">
              {/* Icono de error */}
              <div className="mb-4">
                <XCircle
                  size={100}
                  className="text-danger"
                  strokeWidth={1.5}
                />
              </div>

              {/* Mensaje principal */}
              <h1 className="fw-bold mb-3 text-danger">
                Pago no completado
              </h1>
              <p className="text-muted fs-5 mb-4">
                Tu pago no pudo ser procesado
              </p>

              {/* Información adicional */}
              <div className="alert alert-warning mb-4">
                <p className="mb-2">
                  <strong>Posibles causas:</strong>
                </p>
                <ul className="text-start mb-0 small">
                  <li>Fondos insuficientes</li>
                  <li>Datos de tarjeta incorrectos</li>
                  <li>Transacción rechazada por el banco</li>
                  <li>Cancelaste el proceso de pago</li>
                </ul>
              </div>

              <p className="text-muted mb-4">
                No te preocupes, tu carrito sigue activo. Puedes intentar
                nuevamente cuando estés listo.
              </p>

              {/* Botones */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/carrito")}
                >
                  <CreditCard size={20} className="me-2" />
                  Volver al carrito
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  onClick={() => navigate("/productos")}
                >
                  <ArrowLeft size={20} className="me-2" />
                  Seguir comprando
                </button>
              </div>

              {/* Decoración */}
              <div className="mt-5">
                <p className="text-muted small mb-0">
                  Si necesitas ayuda, contáctanos
                </p>
                <div className="mt-3">
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => navigate("/contacto")}
                  >
                    Ir a contacto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailureScreen;

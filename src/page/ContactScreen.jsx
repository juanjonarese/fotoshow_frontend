import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import Swal from "sweetalert2";

const ContactScreen = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const enviarConsulta = async (datos) => {
    try {
      // Aquí puedes integrar con tu backend cuando esté listo
      // const respuesta = await clientAxios.post("/consultas", datos);

      // Por ahora mostramos un mensaje de éxito simulado
      console.log("Datos del formulario:", datos);

      Swal.fire({
        icon: "success",
        title: "¡Mensaje enviado!",
        text: "Gracias por contactarnos. Te responderemos a la brevedad.",
        timer: 3000,
        showConfirmButton: false,
      });

      reset(); // Limpiar el formulario
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el mensaje. Intenta nuevamente.",
      });
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Columna izquierda: Información de contacto */}
        <div className="col-lg-5">
          <div className="mb-4">
            <h1 className="fw-bold mb-3">Contáctanos</h1>
            <p className="text-muted">
              ¿Tienes alguna consulta? Estamos aquí para ayudarte. Envíanos un
              mensaje y te responderemos lo antes posible.
            </p>
          </div>

          {/* Tarjetas de información */}
          <div className="d-flex flex-column gap-3">
            {/* Dirección */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="feature-icon me-3 flex-shrink-0">
                    <MapPin size={24} color="white" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Dirección</h6>
                    <p className="text-muted mb-0">
                      San Lorenzo 418
                      <br />
                      San Miguel de Tucumán 4000
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="feature-icon me-3 flex-shrink-0">
                    <Phone size={24} color="white" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Teléfono</h6>
                    <a
                      href="tel:3815674535"
                      className="text-muted text-decoration-none"
                    >
                      381 567-4535
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="feature-icon me-3 flex-shrink-0">
                    <Clock size={24} color="white" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Horario de atención</h6>
                    <p className="text-muted mb-1">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-muted mb-0">Sábados: 9:00 - 13:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="feature-icon me-3 flex-shrink-0">
                    <Mail size={24} color="white" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Email</h6>
                    <a
                      href="mailto:info@fotoshow.com"
                      className="text-muted text-decoration-none"
                    >
                      info@fotoshow.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha: Formulario de contacto */}
        <div className="col-lg-7">
          <div className="card border-0 shadow">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4">Envíanos un mensaje</h3>

              <form onSubmit={handleSubmit(enviarConsulta)}>
                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nombre ? "is-invalid" : ""
                    }`}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && (
                    <div className="invalid-feedback">
                      {errors.nombre.message}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", {
                      required: "El email es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input
                    type="tel"
                    className={`form-control ${
                      errors.telefono ? "is-invalid" : ""
                    }`}
                    {...register("telefono", {
                      required: "El teléfono es obligatorio",
                    })}
                    placeholder="381..."
                  />
                  {errors.telefono && (
                    <div className="invalid-feedback">
                      {errors.telefono.message}
                    </div>
                  )}
                </div>

                {/* Asunto */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Asunto</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.asunto ? "is-invalid" : ""
                    }`}
                    {...register("asunto", {
                      required: "El asunto es obligatorio",
                    })}
                    placeholder="¿En qué podemos ayudarte?"
                  />
                  {errors.asunto && (
                    <div className="invalid-feedback">
                      {errors.asunto.message}
                    </div>
                  )}
                </div>

                {/* Mensaje */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Mensaje</label>
                  <textarea
                    className={`form-control ${
                      errors.mensaje ? "is-invalid" : ""
                    }`}
                    rows="5"
                    {...register("mensaje", {
                      required: "El mensaje es obligatorio",
                      minLength: {
                        value: 10,
                        message: "El mensaje debe tener al menos 10 caracteres",
                      },
                    })}
                    placeholder="Escribe tu consulta aquí..."
                  ></textarea>
                  {errors.mensaje && (
                    <div className="invalid-feedback">
                      {errors.mensaje.message}
                    </div>
                  )}
                </div>

                {/* Botón enviar */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                >
                  <Send size={18} />
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;

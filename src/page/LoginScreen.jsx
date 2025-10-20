import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import clientAxios from "../helpers/clientAxios";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = (props) => {
  const { handleClose } = props;
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const logIn = async (datos) => {
    // Mostrar loading mientras se hace la petición
    Swal.fire({
      title: "Iniciando sesión...",
      text: "Por favor esperá un momento",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const respuesta = await clientAxios.post("/usuarios/login", datos);
      const { token, rolUsuario, msg } = respuesta.data;

      if (token) {
        const userData = {
          email: datos.emailUsuario,
          rol: rolUsuario,
        };

        login(token, userData);

        // ✅ Mensaje de éxito del backend
        await Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: msg || "Sesión iniciada correctamente",
          confirmButtonColor: "#0d6efd",
          confirmButtonText: "Continuar",
          timer: 2500,
        });

        navigate("/up-photo");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se recibió el token de autenticación",
          confirmButtonColor: "#dc3545",
        });
      }
    } catch (error) {
      // ⚠️ Mensaje de error del backend
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: error.response?.data?.msg || "Ocurrió un error inesperado",
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Reintentar",
        footer: "<small>Verificá tu conexión a internet</small>",
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center my-4">
        <div className="col-md-4 col-lg-4">
          <div className="login-container">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3">¡Bienvenido!</h2>
              <p className="text-muted">Iniciá sesión para continuar</p>
            </div>

            <form onSubmit={handleSubmit(logIn)}>
              <div className="mb-4 position-relative">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-lg ps-4"
                  {...register("emailUsuario", { required: true })}
                  placeholder="mail@mail.com"
                />
                {errors.emailUsuario && (
                  <p role="alert" className="text-danger">
                    El campo es obligatorio
                  </p>
                )}
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg ps-4"
                  {...register("contraseniaUsuario", { required: true })}
                  placeholder="••••••••"
                />
                {errors.contraseniaUsuario && (
                  <p role="alert" className="text-danger">
                    El campo es obligatorio
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-lg w-100 my-3 text-white btn-primary"
                id="boton-login"
              >
                Iniciar sesión
              </button>

              <div className="text-center mt-4">
                <span className="text-muted">¿No tenés cuenta? </span>
                <Link
                  className="text-decoration-none fw-bold enlace"
                  to="/register"
                >
                  Registrate
                </Link>
              </div>
              <div className="text-center mt-4">
                <span className="text-muted">¿Olvidaste tu contraseña? </span>
                <Link
                  className="text-decoration-none fw-bold enlace"
                  to="/recoverymail"
                >
                  Recuperar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

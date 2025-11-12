import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Eye, EyeOff } from "lucide-react";
import clientAxios from "../helpers/clientAxios";

const RegisterScreen = () => {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRePassword, setMostrarRePassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const crearUsuario = async (datos) => {
    try {
      const respuesta = await clientAxios.post("/usuarios", datos);
      if (respuesta.status === 201 || respuesta.status === 200) {
        MySwal.fire({
          title: respuesta.data.msg,
          text: "Ya puedes iniciar sesión",
          icon: "success",
        });
        navigate("/login");
      } else {
        MySwal.fire({
          title: "Error",
          text: "No se pudo crear el usuario",
          icon: "error",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un error al registrar el usuario, usuario ya existe con ese mail",
        icon: "error",
      });
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center py-4">
      <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 p-4 rounded shadow bg-white">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Registrate</h2>
        </div>

        <form onSubmit={handleSubmit(crearUsuario)}>
          <div className="mb-3">
            <label className="form-label">Nombre y Apellido</label>
            <input
              type="text"
              className="form-control"
              {...register("nombreUsuario", { required: true })}
              placeholder="Juan Perez"
            />
            {errors.nombreUsuario && (
              <p className="text-danger">El campo es obligatorio</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Teléfono</label>
            <input
              type="number"
              className="form-control"
              {...register("telefonoUsuario", { required: true })}
              placeholder="381..."
            />
            {errors.telefonoUsuario && (
              <p className="text-danger">El campo es obligatorio</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              {...register("emailUsuario", { required: true })}
              placeholder="example@mail.com"
            />
            {errors.emailUsuario && (
              <p className="text-danger">El campo es obligatorio</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="position-relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                className="form-control pe-5"
                {...register("contraseniaUsuario", { required: true })}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{ zIndex: 10, textDecoration: "none" }}
              >
                {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.contraseniaUsuario && (
              <p className="text-danger">El campo es obligatorio</p>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Repetir contraseña</label>
            <div className="position-relative">
              <input
                type={mostrarRePassword ? "text" : "password"}
                className="form-control pe-5"
                {...register("rePassword", {
                  required: true,
                  validate: (value) => value === watch("contraseniaUsuario"),
                })}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                onClick={() => setMostrarRePassword(!mostrarRePassword)}
                style={{ zIndex: 10, textDecoration: "none" }}
              >
                {mostrarRePassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.rePassword && (
              <p className="text-danger">Las contraseñas no coinciden</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Registrarse
          </button>

          <div className="text-center">
            <span className="text-muted">¿Ya tienes cuenta? </span>
            <Link to="/login" className="fw-bold enlace">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;

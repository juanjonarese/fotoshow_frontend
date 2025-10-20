import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import clientAxios from "../helpers/clientAxios";

const RecoveryPassMailScreen = () => {
  const MySwal = withReactContent(Swal);

  const { register, handleSubmit } = useForm();
  // const [emailUsuario, setEmailUsuario] = useState("");

  const mailRecovery = async (data) => {
    try {
      const respuesta = await clientAxios.post("/usuarios/recoveryPass", {
        emailUsuario: data.emailUsuario,
      });

      if (respuesta.status === 200) {
        MySwal.fire({
          title: "Correo enviado",
          text: "Revisá tu bandeja para recuperar tu contraseña.",
          icon: "success",
        });
      } else {
        MySwal.fire({
          title: "Error",
          text: "No se pudo procesar el correo",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
      MySwal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un error al intentar enviar el correo",
        icon: "error",
      });
    }
  };

  return (
    <div className="register-container container my-3">
      <div className="row justify-content-center py-3">
        <div className="col-md-8 col-lg-6">
          <div className="login-container p-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3">Recuperar Contraseña</h2>
            </div>

            <form onSubmit={handleSubmit(mailRecovery)}>
              {/* Correo */}
              <div className="mb-4 position-relative">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-lg ps-4"
                  {...register("emailUsuario")}
                  placeholder="mail@mail.com"
                />

                <p className="text-danger"></p>
              </div>

              <button
                type="submit"
                className="registro-btn btn btn-primary btn-lg w-100 mb-3"
              >
                Recuperar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecoveryPassMailScreen;

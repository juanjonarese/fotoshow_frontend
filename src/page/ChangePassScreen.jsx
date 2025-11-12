import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Eye, EyeOff } from "lucide-react";
import clientAxios from "../helpers/clientAxios";
import Swal from "sweetalert2";

const ChangePassScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarNuevaContrasenia, setConfirmarNuevaContrasenia] =
    useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarRePassword, setMostrarRePassword] = useState(false);

  const handleClickFormChangePass = async (ev) => {
    ev.preventDefault();

    const tokenUrl = new URLSearchParams(location.search).get("token");

    if (!tokenUrl) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Token inválido o faltante",
        confirmButtonColor: "#dc3545"
      });
      return;
    }

    if (nuevaContrasenia !== confirmarNuevaContrasenia) {
      Swal.fire({
        icon: "warning",
        title: "Contraseñas no coinciden",
        text: "Las contraseñas ingresadas no coinciden",
        confirmButtonColor: "#0d6efd"
      });
      return;
    }

    try {
      // ✅ Token en query, contraseña en body
      const res = await clientAxios.post(
        `/usuarios/changeNewPassUser?token=${tokenUrl}`,
        { contrasenia: nuevaContrasenia }
      );

      console.log(res);
      await Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña se actualizó correctamente",
        confirmButtonColor: "#0d6efd",
        confirmButtonText: "Ir al Login"
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al cambiar contraseña",
        text: error.response?.data?.msg || "Error al cambiar la contraseña",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "80vh" }}
    >
      <Card
        style={{
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        className="p-4"
      >
        <Card.Body>
          <h3 className="text-center mb-4">Cambiar Contraseña</h3>
          <Form onSubmit={handleClickFormChangePass}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nueva Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Ingresá tu nueva contraseña"
                  onChange={(ev) => setNuevaContrasenia(ev.target.value)}
                  value={nuevaContrasenia}
                  className="pe-5"
                  required
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
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Repetir Contraseña</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={mostrarRePassword ? "text" : "password"}
                  placeholder="Confirmá tu nueva contraseña"
                  onChange={(ev) => setConfirmarNuevaContrasenia(ev.target.value)}
                  value={confirmarNuevaContrasenia}
                  className="pe-5"
                  required
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
            </Form.Group>

            <div className="text-center mt-4">
              <Button variant="primary" type="submit" className="w-100">
                Cambiar Contraseña
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ChangePassScreen;

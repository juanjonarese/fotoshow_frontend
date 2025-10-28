import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import clientAxios from "../helpers/clientAxios";

const ChangePassScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarNuevaContrasenia, setConfirmarNuevaContrasenia] =
    useState("");

  const handleClickFormChangePass = async (ev) => {
    ev.preventDefault();

    const tokenUrl = new URLSearchParams(location.search).get("token");

    if (!tokenUrl) {
      alert("Token inválido o faltante");
      return;
    }

    if (nuevaContrasenia !== confirmarNuevaContrasenia) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // ✅ Token en query, contraseña en body
      const res = await clientAxios.post(
        `/usuarios/changeNewPassUser?token=${tokenUrl}`,
        { contrasenia: nuevaContrasenia }
      );

      console.log(res);
      alert("Contraseña actualizada correctamente");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Error al cambiar la contraseña");
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
              <Form.Control
                type="password"
                placeholder="Ingresá tu nueva contraseña"
                onChange={(ev) => setNuevaContrasenia(ev.target.value)}
                value={nuevaContrasenia}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Repetir Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirmá tu nueva contraseña"
                onChange={(ev) => setConfirmarNuevaContrasenia(ev.target.value)}
                value={confirmarNuevaContrasenia}
                required
              />
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

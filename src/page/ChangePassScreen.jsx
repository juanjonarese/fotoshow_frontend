import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import clientAxios from "../helpers/clientAxios";

const ChangePassScreen = () => {
  const location = useLocation();

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
      const res = await clientAxios.post(
        `/usuarios/changeNewPassUser?token=${tokenUrl}`,
        { contrasenia: nuevaContrasenia }
      );
      console.log(res);
      alert("Contraseña actualizada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la contraseña");
    }
  };

  return (
    <Container className="d-flex justify-content-center py-5">
      <Form onSubmit={handleClickFormChangePass}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(ev) => setNuevaContrasenia(ev.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Repetir Contraseña</Form.Label>
          <Form.Control
            type="password"
            onChange={(ev) => setConfirmarNuevaContrasenia(ev.target.value)}
          />
        </Form.Group>

        <div className="text-center btn-login">
          <Button variant="succes" type="submit">
            Enviar Datos
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ChangePassScreen;

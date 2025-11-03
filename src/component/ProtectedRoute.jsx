import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

/**
 * Componente para proteger rutas que requieren autenticación y roles específicos
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos a renderizar si está autorizado
 * @param {string[]} props.rolesPermitidos - Array de roles permitidos (ej: ['admin', 'personal'])
 */
const ProtectedRoute = ({ children, rolesPermitidos = [] }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    if (!isLoggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "Debes iniciar sesión para acceder a esta página",
        confirmButtonText: "Ir a Login",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    // Verificar rol si se especificaron roles permitidos
    if (rolesPermitidos.length > 0) {
      const userRol = user?.rol || "usuario";

      if (!rolesPermitidos.includes(userRol)) {
        Swal.fire({
          icon: "error",
          title: "Acceso denegado",
          text: `No tienes permisos para acceder a esta página. Se requiere rol: ${rolesPermitidos.join(
            " o "
          )}`,
          confirmButtonText: "Volver al inicio",
        }).then(() => {
          navigate("/");
        });
        return;
      }
    }
  }, [isLoggedIn, user, rolesPermitidos, navigate]);

  // Si no está autenticado o no tiene el rol, no renderizar nada
  if (!isLoggedIn) {
    return null;
  }

  if (rolesPermitidos.length > 0) {
    const userRol = user?.rol || "usuario";
    if (!rolesPermitidos.includes(userRol)) {
      return null;
    }
  }

  // Si todo está bien, renderizar los hijos
  return <>{children}</>;
};

export default ProtectedRoute;

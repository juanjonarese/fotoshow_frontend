import { Routes, Route } from "react-router-dom";
import HomeScreen from "../page/HomeScreen.jsx";
import PhotoUploadApp from "../component/PhotoUploadApp.jsx";
import RegisterScreen from "../page/RegiterScreen.jsx";
import LoginScreen from "../page/LoginScreen.jsx";
import ChangePassScreen from "../page/ChangePassScreen.jsx";
import RecoveryPassMailScreen from "../page/RecoveryPassScreen.jsx";
import ContactScreen from "../page/ContactScreen.jsx";
import ProductsScreen from "../page/ProductsScreen.jsx";
import OneProductScreen from "../page/OneProductScreen.jsx";
import AdminProductsScreen from "../page/AdminProductsScreen.jsx";
import ImpresionesScreen from "../page/ImpresionesScreen.jsx";
import DashboardScreen from "../page/DashboardScreen.jsx";
import ProtectedRoute from "../component/ProtectedRoute.jsx";

const PrincipalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/up-photo" element={<PhotoUploadApp />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/changepass" element={<ChangePassScreen />} />
      <Route path="/recoverymail" element={<RecoveryPassMailScreen />} />
      <Route path="/contacto" element={<ContactScreen />} />
      <Route path="/productos" element={<ProductsScreen />} />
      <Route path="/productos/:id" element={<OneProductScreen />} />
      <Route path="/impresiones" element={<ImpresionesScreen />} />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute rolesPermitidos={["admin"]}>
            <AdminProductsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute rolesPermitidos={["admin"]}>
            <DashboardScreen />
          </ProtectedRoute>
        }
      />

      {/* Solo para admins
      <Route
        path="/admin/adminusers"
        element={
          <AdminRoute>
            <AdminUsersScreen />
          </AdminRoute>
        }
      />
      
      
      <Route
        path="/admin/adminproducts"
        element={
          <AdminVetRoute>
            <AdminProductsScreen />
          </AdminVetRoute>
        }
      />
      <Route
        path="/admin/pacientes"
        element={
          <AdminVetRoute>
            <PacientesScreen />
          </AdminVetRoute>
        }
      /> */}
    </Routes>
  );
};

export default PrincipalRoutes;

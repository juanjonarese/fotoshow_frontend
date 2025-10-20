import { Routes, Route } from "react-router-dom";
import HomeScreen from "../page/HomeScreen.jsx";
import PhotoUploadApp from "../component/PhotoUploadApp.jsx";
import RegisterScreen from "../page/RegiterScreen.jsx";
import LoginScreen from "../page/LoginScreen.jsx";
import ChangePassScreen from "../page/ChangePassScreen.jsx";
import RecoveryPassMailScreen from "../page/RecoveryPassScreen.jsx";

const PrincipalRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/up-photo" element={<PhotoUploadApp />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/changepass" element={<ChangePassScreen />} />
      <Route path="/recoverymail" element={<RecoveryPassMailScreen />} />

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

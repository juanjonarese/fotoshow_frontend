import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./component/NavBarApp";
import Footer from "./component/FooterApp";
import PrincipalRoutes from "./routes/PrincipalRoutes";
// ... tus otros imports

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <PrincipalRoutes />
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

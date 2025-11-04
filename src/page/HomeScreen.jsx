import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Upload,
  Image,
  Shield,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
  Star,
  Users,
  Heart,
  Menu,
  X,
  Camera,
  ShoppingBag,
} from "lucide-react";
import "../css/home.css";
import clientAxios from "../helpers/clientAxios";
import CardProductApp from "../component/CardProductApp";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState([]);

  const samplePhotos = [
    "https://images.pexels.com/photos/1183986/pexels-photo-1183986.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/1428185/pexels-photo-1428185.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
    "https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
  ];

  const features = [
    {
      icon: <Upload className="w-100 h-100" />,
      title: "Subida Rápida",
      description:
        "Sube tus fotos en segundos desde cualquier dispositivo con nuestra interfaz intuitiva y fácil de usar",
    },
    {
      icon: <Shield className="w-100 h-100" />,
      title: "Seguridad Total",
      description:
        "Tus fotos están protegidas con encriptación avanzada y almacenamiento seguro en la nube",
    },
    {
      icon: <Zap className="w-100 h-100" />,
      title: "Procesamiento Inteligente",
      description:
        "Optimización automática de imágenes y organización inteligente de tu galería personal",
    },
  ];

  const devices = [
    { icon: <Smartphone size={24} />, name: "Móvil" },
    { icon: <Tablet size={24} />, name: "Tablet" },
    { icon: <Monitor size={24} />, name: "Desktop" },
  ];

  const stats = [
    {
      icon: <Users className="text-white" />,
      value: "10K+",
      label: "Usuarios activos",
    },
    {
      icon: <Image className="text-white" />,
      value: "500K+",
      label: "Fotos subidas",
    },
    {
      icon: <Heart className="text-white" />,
      value: "99%",
      label: "Satisfacción",
    },
  ];

  // Cargar productos destacados al montar el componente
  useEffect(() => {
    const cargarProductosDestacados = async () => {
      try {
        const response = await clientAxios.get("/productos");
        const productos = response.data.productos || response.data;
        // Filtrar solo los productos destacados y limitar a 4
        const destacados = productos.filter((p) => p.destacado === true).slice(0, 4);
        setProductosDestacados(destacados);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    };

    cargarProductosDestacados();
  }, []);

  // ✨ NUEVA FUNCIÓN: Verifica si hay token y redirige
  const handleComenzar = () => {
    const token = localStorage.getItem("token");

    if (token) {
      // Si hay token, va directo a subir fotos
      navigate("/up-photo");
    } else {
      // Si no hay token, va al login
      navigate("/login");
    }
  };

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="hero-section py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            {/* Photo Grid */}
            <div className="col-lg-6">
              <div className="photo-grid-container">
                <div className="row g-3 photo-grid">
                  {samplePhotos.map((photo, index) => (
                    <div key={index} className="col-4">
                      <div className="ratio ratio-1x1 rounded-3 overflow-hidden shadow">
                        <img
                          src={photo}
                          alt={`Sample photo ${index + 1}`}
                          className="object-fit-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-dark mb-4">
                Subí y revelá tus
                <span className="gradient-text"> fotos</span> desde cualquier
                lugar
              </h1>
              <p className="lead text-muted mb-4">
                La plataforma más intuitiva para subir, organizar y compartir
                tus recuerdos. Compatible con móviles, tablets y computadoras de
                escritorio.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                {/* ✨ MODIFICADO: Ahora usa handleComenzar */}
                <button
                  className="btn gradient-bg text-white btn-lg px-4"
                  onClick={handleComenzar}
                >
                  <Upload size={20} className="me-2" />
                  Comenzar Gratis
                </button>
                <button className="btn btn-outline-secondary btn-lg px-4">
                  Ver Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados Section */}
      {productosDestacados.length > 0 && (
        <section className="container py-5">
          <div className="row mb-4">
            <div className="col text-center">
              <h2 className="display-5 fw-bold texto-home mb-2">
                <Star className="me-2" size={40} style={{ color: "#FFD700" }} />
                Productos Destacados
              </h2>
              <p className="lead text-muted">
                Los mejores productos para tus recuerdos más especiales
              </p>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {productosDestacados.map((product) => (
              <CardProductApp key={product._id} product={product} />
            ))}
          </div>
          <div className="row mt-4">
            <div className="col text-center">
              <Link to="/productos" className="btn btn-login btn-lg px-5">
                <ShoppingBag size={20} className="me-2" />
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold text-white mb-4">
            ¿Listo para empezar a subir tus fotos?
          </h2>
          <p className="lead text-white-50 mb-4">
            Únete a miles de usuarios que ya confían en Fotos Show para sus
            recuerdos más preciados
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            {/* ✨ MODIFICADO: También usa handleComenzar */}
            <button
              className="btn btn-light btn-lg px-4"
              onClick={handleComenzar}
            >
              <Upload size={20} className="me-2" />
              Empezar Gratis
            </button>
            <button className="btn btn-outline-light btn-lg px-4">
              Conocer Más
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;

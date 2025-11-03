import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FormAddProductApp from "../component/FormAddProductApp";
import TableProductsApp from "../component/TableProductsApp";
import clientAxios from "../helpers/clientAxios";

const AdminProductsScreen = () => {
  const MySwal = withReactContent(Swal);
  const [productos, setProductos] = useState([]);

  const getProducts = async () => {
    try {
      // setLoading(true);
      const respuesta = await clientAxios.get("/productos");
      console.log("RESPUESTA COMPLETA:", respuesta);
      console.log("PRODUCTOS RECIBIDOS:", respuesta.data);

      if (respuesta.status === 200) {
        setProductos(respuesta.data.productos || respuesta.data);
        console.log(respuesta.data.productos || respuesta.data);
      } else {
        MySwal.fire({
          title: "Error",
          text: "No se pudieron cargar los productos",
          icon: "error",
        });
      }
    } catch (error) {
      MySwal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un error al cargar los productos",
        icon: "error",
      });
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const addProduct = async (nuevoProducto) => {
    try {
      const response = await clientAxios.post("/productos", nuevoProducto);
      console.log("Producto guardado:", response.data);

      // Actualizá la lista si querés que se vea reflejado al instante
      setProductos([...productos, response.data]);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const deleteProduct = async (product) => {
    const result = await MySwal.fire({
      title: `¿Eliminar el producto: ${product.titulo}?`,
      showDenyButton: true,
      confirmButtonText: "Sí",
      denyButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        await clientAxios.delete(`/productos/${product._id}`);
        const newProducts = productos.filter((p) => p._id !== product._id);
        setProductos(newProducts);

        MySwal.fire("Producto eliminado", "", "success");
      } catch (error) {
        MySwal.fire("Error", "No se pudo eliminar el producto", "error");
        console.error(error);
      }
    }
  };

  const updateProduct = async (id, datos) => {
    const response = await clientAxios.put(`/productos/${id}`, datos);
    const index = productos.findIndex((product) => product._id === id);
    const productsLocal = [...productos];
    productsLocal[index] = { ...productsLocal[index], ...datos };
    setProductos(productsLocal);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h2 className="texto-home">Administración de productos</h2>
        </div>
      </div>
      <FormAddProductApp addProduct={addProduct} />
      {/* Formulario para dar de alta producto  */}
      <div className="row">
        <div className="col">
          <h3>Tabla de productos</h3>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TableProductsApp
            products={productos}
            borrarProducto={deleteProduct}
            updateProduct={updateProduct}
          />
          {/* Tabla de productos con botones para borrar y actualizar  */}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsScreen;

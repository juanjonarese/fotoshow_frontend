import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../helpers/clientAxios"; // ⚡ CAMBIO: Importar clientAxios
import Swal from "sweetalert2";

const PhotoUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [pedidoId, setPedidoId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipoEntrega: "envio",
    direccion: "",
    telefono: "",
    tamanioFoto: "10x15",
    tipoImpresion: "color",
    comentarios: "",
  });

  // Tamaños disponibles con sus precios
  const tamaniosDisponibles = [
    { valor: "10x15", etiqueta: "10x15 cm (Estándar)", precio: 50 },
    { valor: "13x18", etiqueta: "13x18 cm", precio: 80 },
    { valor: "15x21", etiqueta: "15x21 cm (A5)", precio: 120 },
    { valor: "20x25", etiqueta: "20x25 cm", precio: 180 },
    { valor: "20x30", etiqueta: "20x30 cm (A4)", precio: 250 },
  ];

  // Protección: Verificar token al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Verificando token al cargar:", token ? "Existe" : "No existe");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Acceso denegado",
        text: "Necesitas iniciar sesión para subir fotos",
        confirmButtonText: "Ir al Login",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 10;

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return "Tipo de archivo no permitido. Solo: JPG, PNG, GIF, WebP";
    }
    if (file.size > maxFileSize) {
      return "El archivo es demasiado grande. Máximo 10MB";
    }
    return null;
  };

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const validFiles = [];
    const errors = [];

    if (files.length + fileArray.length > maxFiles) {
      alert(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          file,
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          preview: URL.createObjectURL(file),
          status: "ready",
        });
      }
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const updated = prev.filter((file) => file.id !== id);
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove && fileToRemove.preview)
        URL.revokeObjectURL(fileToRemove.preview);
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleContinuar = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión expiró. Inicia sesión nuevamente.",
        confirmButtonText: "Ir al Login",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    if (files.length === 0) {
      Swal.fire("Error", "No seleccionaste ninguna foto", "error");
      return;
    }

    setShowModal(true);
  };

  // Calcular precio estimado
  const calcularPrecioEstimado = () => {
    const tamanio = tamaniosDisponibles.find(
      (t) => t.valor === formData.tamanioFoto
    );
    const precioPorFoto = tamanio ? tamanio.precio : 50;
    const total = precioPorFoto * files.length;
    return { precioPorFoto, total };
  };

  const enviarPedido = async () => {
    if (!formData.telefono) {
      Swal.fire("Error", "El teléfono es obligatorio", "error");
      return;
    }

    if (formData.tipoEntrega === "envio" && !formData.direccion) {
      Swal.fire("Error", "La dirección es obligatoria para envío", "error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "No hay sesión activa",
        text: "Por favor inicia sesión primero",
        confirmButtonText: "Ir al Login",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      setUploading(true);

      console.log("🚀 PASO 1: Iniciando creación de pedido");

      // ⚡ PASO 1: Crear pedido
      let pedido = pedidoId;
      if (!pedido) {
        console.log("📝 Datos del pedido a enviar:", {
          tipoEntrega: formData.tipoEntrega,
          direccion:
            formData.tipoEntrega === "envio" ? formData.direccion : null,
          telefono: formData.telefono,
          tamanioFoto: formData.tamanioFoto,
          tipoImpresion: formData.tipoImpresion,
          comentarios: formData.comentarios,
          cantidadFotos: files.length,
        });

        const resPedido = await clientAxios.post("/pedidos", {
          tipoEntrega: formData.tipoEntrega,
          direccion:
            formData.tipoEntrega === "envio" ? formData.direccion : null,
          telefono: formData.telefono,
          tamanioFoto: formData.tamanioFoto,
          tipoImpresion: formData.tipoImpresion,
          comentarios: formData.comentarios,
          cantidadFotos: files.length,
        });

        pedido = resPedido.data.pedidoId;
        setPedidoId(pedido);
        console.log("✅ PASO 1 COMPLETADO: Pedido creado con ID:", pedido);
      } else {
        console.log("✅ PASO 1 OMITIDO: Ya existe pedido con ID:", pedido);
      }

      console.log("🚀 PASO 2: Iniciando subida de fotos");
      console.log(`📸 Total de fotos a subir: ${files.length}`);

      // ⚡ PASO 2: Subir fotos una por una
      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        console.log(
          `📤 Subiendo foto ${i + 1}/${files.length}: ${fileObj.name}`
        );

        const formDataUpload = new FormData();
        formDataUpload.append("foto", fileObj.file);
        formDataUpload.append("pedido", pedido);

        try {
          await clientAxios.post("/fotos/subir", formDataUpload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(`✅ Foto ${i + 1}/${files.length} subida correctamente`);
        } catch (fotoError) {
          console.error(`❌ Error al subir foto ${i + 1}:`, fotoError);
          throw new Error(
            `Error al subir foto ${fileObj.name}: ${fotoError.message}`
          );
        }
      }

      console.log("✅ PASO 2 COMPLETADO: Todas las fotos subidas");

      console.log("🚀 PASO 3: Finalizando pedido");

      // ⚡ PASO 3: Finalizar pedido
      await clientAxios.post(`/pedidos/${pedido}/finalizar`);

      console.log("✅ PASO 3 COMPLETADO: Pedido finalizado");
      console.log("🎉 PROCESO COMPLETO EXITOSO");

      Swal.fire(
        "¡Pedido enviado! 🎉",
        "Tus fotos fueron enviadas correctamente. Te contactaremos pronto.",
        "success"
      );

      setFiles([]);
      setPedidoId(null);
      setShowModal(false);
      setFormData({
        tipoEntrega: "envio",
        direccion: "",
        telefono: "",
        tamanioFoto: "10x15",
        tipoImpresion: "color",
        comentarios: "",
      });
    } catch (err) {
      console.error("💥 ERROR EN ENVIAR PEDIDO:", err);
      console.error("💥 ERROR RESPONSE:", err.response);
      console.error("💥 ERROR MESSAGE:", err.message);
      console.error("💥 ERROR STACK:", err.stack);

      // Mostrar información detallada del error
      let mensajeError = "No se pudo enviar el pedido";

      if (err.response) {
        // Error del servidor
        console.error("❌ Error del servidor:", {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        });

        if (err.response.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Sesión expirada",
            text: "Tu sesión expiró. Inicia sesión nuevamente.",
            confirmButtonText: "Ir al Login",
          }).then(() => {
            localStorage.removeItem("token");
            navigate("/login");
          });
          return;
        }

        mensajeError =
          err.response.data?.mensaje ||
          err.response.data?.error ||
          mensajeError;
      } else if (err.request) {
        // Error de red
        console.error(
          "❌ Error de red (sin respuesta del servidor):",
          err.request
        );
        mensajeError =
          "Error de conexión. Verifica tu internet y vuelve a intentar.";
      } else {
        // Error al configurar la petición
        console.error("❌ Error al configurar la petición:", err.message);
        mensajeError = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensajeError,
        footer: "<small>Si el problema persiste, contacta a soporte</small>",
      });
    } finally {
      setUploading(false);
    }
  };

  const { precioPorFoto, total } = calcularPrecioEstimado();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">
              Sube tus <span className="gradient-text">fotos</span>
            </h2>
            <p className="lead text-muted">
              Arrastra y suelta tus imágenes o haz clic para seleccionarlas
            </p>
          </div>

          <div
            className={`upload-zone border-2 border-dashed rounded-4 p-5 text-center mb-4 ${
              dragActive
                ? "border-primary bg-primary bg-opacity-10"
                : "border-secondary"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
          >
            <div className="upload-icon mb-3">
              <Upload
                size={48}
                className={dragActive ? "text-primary" : "text-muted"}
              />
            </div>
            <h5 className="fw-bold text-dark mb-2">
              {dragActive
                ? "¡Suelta tus fotos aquí!"
                : "Arrastra tus fotos aquí"}
            </h5>
            <p className="text-muted mb-3">
              o{" "}
              <span className="text-primary fw-medium">
                haz clic para seleccionar
              </span>
            </p>
            <div className="small text-muted">
              <p className="mb-1">Formatos soportados: JPG, PNG, GIF, WebP</p>
              <p className="mb-0">
                Tamaño máximo: 10MB por archivo • Máximo {maxFiles} archivos
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="d-none"
          />

          {files.length > 0 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">
                    Archivos seleccionados ({files.length})
                  </h6>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setFiles([])}
                    disabled={uploading}
                  >
                    Limpiar todo
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                {files.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="d-flex align-items-center p-3 border-bottom"
                  >
                    <div className="flex-shrink-0 me-3">
                      <div
                        className="ratio ratio-1x1 rounded"
                        style={{ width: "60px" }}
                      >
                        <img
                          src={fileObj.preview}
                          alt={fileObj.name}
                          className="object-fit-cover rounded"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1 me-3">
                      <div className="fw-medium text-dark mb-1">
                        {fileObj.name}
                      </div>
                      <div className="small text-muted">
                        {formatFileSize(fileObj.size)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 d-flex align-items-center gap-2">
                      <span className="badge bg-secondary">Listo</span>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFile(fileObj.id)}
                        disabled={uploading}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="text-center mt-4">
              <button
                onClick={handleContinuar}
                className="btn btn-success btn-lg"
                disabled={uploading}
              >
                Continuar con el pedido
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL MEJORADO */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <ImageIcon className="me-2" size={24} />
                  Configuración del pedido
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* OPCIONES DE IMPRESIÓN */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <ImageIcon size={18} className="me-1" />
                      Tamaño de impresión *
                    </label>
                    <select
                      className="form-select"
                      value={formData.tamanioFoto}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tamanioFoto: e.target.value,
                        })
                      }
                    >
                      {tamaniosDisponibles.map((tamanio) => (
                        <option key={tamanio.valor} value={tamanio.valor}>
                          {tamanio.etiqueta} - ${tamanio.precio} c/u
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">
                      <Palette size={18} className="me-1" />
                      Tipo de impresión *
                    </label>
                    <select
                      className="form-select"
                      value={formData.tipoImpresion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipoImpresion: e.target.value,
                        })
                      }
                    >
                      <option value="color">Color</option>
                      <option value="sepia">Sepia (tono vintage)</option>
                      <option value="bn">Blanco y Negro</option>
                    </select>
                  </div>
                </div>

                {/* RESUMEN DEL PRECIO */}
                <div className="alert alert-info mb-4">
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>{files.length}</strong> foto
                      {files.length > 1 ? "s" : ""} × ${precioPorFoto}
                    </span>
                    <strong className="text-primary">
                      Total estimado: ${total}
                    </strong>
                  </div>
                  <small className="text-muted d-block mt-1">
                    * El precio final puede variar según el método de entrega
                  </small>
                </div>

                {/* TIPO DE ENTREGA */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    ¿Cómo querés recibir tu pedido? *
                  </label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoEntrega"
                        id="envio"
                        value="envio"
                        checked={formData.tipoEntrega === "envio"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipoEntrega: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="envio">
                        Envío a domicilio
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoEntrega"
                        id="retiro"
                        value="retiro"
                        checked={formData.tipoEntrega === "retiro"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipoEntrega: e.target.value,
                          })
                        }
                      />
                      <label className="form-check-label" htmlFor="retiro">
                        Retiro en local
                      </label>
                    </div>
                  </div>
                </div>

                {/* DIRECCIÓN SI ES ENVÍO */}
                {formData.tipoEntrega === "envio" && (
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label fw-bold">
                      Dirección de envío *
                    </label>
                    <textarea
                      id="direccion"
                      className="form-control"
                      rows="3"
                      placeholder="Ej: Av. Corrientes 1234, Piso 5, Depto B, CABA"
                      value={formData.direccion}
                      onChange={(e) =>
                        setFormData({ ...formData, direccion: e.target.value })
                      }
                    />
                    <small className="text-muted">
                      Incluí calle, número, piso, depto y ciudad
                    </small>
                  </div>
                )}

                {/* TELÉFONO */}
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label fw-bold">
                    Teléfono de contacto *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    className="form-control"
                    placeholder="Ej: +54 9 381 123-4567"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                  <small className="text-muted">
                    Te contactaremos por WhatsApp o llamada
                  </small>
                </div>

                {/* COMENTARIOS ADICIONALES */}
                <div className="mb-3">
                  <label htmlFor="comentarios" className="form-label fw-bold">
                    Comentarios adicionales (opcional)
                  </label>
                  <textarea
                    id="comentarios"
                    className="form-control"
                    rows="3"
                    placeholder="Ej: Por favor, impriman con borde blanco. Necesito el pedido para el viernes."
                    value={formData.comentarios}
                    onChange={(e) =>
                      setFormData({ ...formData, comentarios: e.target.value })
                    }
                  />
                  <small className="text-muted">
                    Dejanos cualquier indicación especial sobre tu pedido
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={enviarPedido}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      >
                        <span className="visually-hidden">Enviando...</span>
                      </div>
                      Enviando...
                    </>
                  ) : (
                    <>Confirmar pedido (${total})</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;

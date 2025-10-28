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
    // ✅ CORRECCIÓN: Enviar token y contraseña en el body
    const res = await clientAxios.post(`/usuarios/changeNewPassUser`, {
      token: tokenUrl, // ✅ Token en el body
      nuevaContrasenia: nuevaContrasenia, // ✅ Campo correcto
    });

    console.log(res);
    alert("Contraseña actualizada correctamente");

    // Opcional: redirigir al login
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.msg || "Error al cambiar la contraseña");
  }
};

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/usuarios/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const tokenData = await response.json();
    localStorage.setItem("token", tokenData.token);
    window.location = "/";
    console.log(tokenData);
  } catch (error) {
    console.log(error);
    alert("Usuario o contraseña incorrecta");
  }
}

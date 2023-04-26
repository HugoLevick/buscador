async function signUp() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/usuarios/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.location = "/login.html";
  } catch (error) {
    console.log(error);
    alert("No se pudo completar el registro. Inténtalo de nuevo");
  }
}

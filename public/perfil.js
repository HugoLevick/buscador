const jwt = localStorage.getItem("token");

if (!jwt) {
  window.location = "/";
}

const container = document.getElementById("request-container");
const titulo = document.getElementById("titulo");

async function establecerDatos() {
  const usuarioReq = await fetch("/usuarios/perfil", {
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });

  if (!usuarioReq.ok) return (window.location = "/login.html");
  const usuario = (await usuarioReq.json()).user;
  titulo.innerHTML += ` ${usuario.name}`;

  const peliculasRequest = await fetch(
    "/peliculas?fromUser=" + encodeURIComponent(usuario._id)
  );

  if (!peliculasRequest.ok) return (window.location = "/");
  const peliculas = await peliculasRequest.json();

  let html = "";
  for (const pelicula of peliculas) {
    html += `
    <div>
        <h1>${pelicula.titulo}</h1>
        <p>${pelicula.actores}</p>
        <button onclick="borrarPelicula('${pelicula._id}')">Solicitar borrado</button>
    </div>
    `;
  }
  container.innerHTML = html;
  if (peliculas.length === 0) container.innerHTML = "<h1>Sin peliculas</h1>";
}

async function borrarPelicula(id) {
  const borrarRequest = await fetch("/peliculas/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });

  alert((await borrarRequest.json()).message);

  window.location = window.location;
}

establecerDatos();

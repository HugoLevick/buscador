const jwt = localStorage.getItem("token");

if (!jwt) {
  window.location = "/";
}

const container = document.getElementById("request-container");

async function obtenerPeticiones() {
  const peticionesRequest = await fetch("/peticiones", {
    headers: {
      Authorization: "Bearer " + jwt,
    },
  });

  if (peticionesRequest.statusCode === 401 || !peticionesRequest.ok) {
    window.location = "/";
    return;
  }
  const peticiones = await peticionesRequest.json();

  let html = "";
  for (const peticion of peticiones) {
    html += `
    <div>
        <h1>${peticion.pelicula.titulo}</h1>
        <p>${peticion.pelicula.actores}</p>
        <button onclick="borrarPelicula('${peticion.pelicula._id}')">Borrar pelicula</button>
    </div>
    `;
  }
  container.innerHTML = html;
  if (peticiones.length === 0) container.innerHTML = "<h1>Sin peticiones</h1>";
}

async function obtenerTodas() {
  const peliculasRequest = await fetch("/peliculas");

  if (!peliculasRequest.ok) return (window.location = "/");
  const peliculas = await peliculasRequest.json();

  let html = "";
  for (const pelicula of peliculas) {
    html += `
    <div>
        <h1>${pelicula.titulo}</h1>
        <p>${pelicula.actores}</p>
        <button onclick="borrarPelicula('${pelicula._id}')">Borrar pelicula</button>
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

  if (borrarRequest.ok) {
    alert("Pelicula borrada");
  } else {
    alert("No se pudo borrar la pelicula");
  }

  window.location = window.location;
}

obtenerPeticiones();

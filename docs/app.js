const API = "https://impostor-2-u22d.onrender.com"; // tu render

let codigo = "";
let nombre = "";

function crearSala() {
  fetch(`${API}/crear-sala`, { method: "POST" })
    .then(res => res.json())
    .then(data => {
      codigo = data.codigo;
      document.getElementById("codigoSala").textContent =
        "Código: " + codigo;
    });
}

function unirseSala() {
  codigo = document.getElementById("codigoInput").value;
  nombre = document.getElementById("nombreInput").value;

  fetch(`${API}/unirse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo, nombre })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) return alert(data.error);

      document.getElementById("sala").style.display = "block";
      actualizarJugadores(data.jugadores);
    });
}

function actualizarJugadores(jugadores) {
  const ul = document.getElementById("listaJugadores");
  ul.innerHTML = "";
  jugadores.forEach(j => {
    const li = document.createElement("li");
    li.textContent = j;
    ul.appendChild(li);
  });
}

function empezar() {
  fetch(`${API}/empezar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("carta").style.display = "flex";
    });
}

function verCarta() {
  fetch(`${API}/ver-carta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo, nombre })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("carta").textContent =
        data.rol || "ERROR";
    });
}


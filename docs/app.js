const API_URL = "https://impostor-2-u22d.onrender.com";

// =====================
// ELEMENTOS DOM
// =====================

const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaLobby = document.getElementById("pantallaLobby");

const btnCrearSala = document.getElementById("btnCrearSala");
const btnUnirse = document.getElementById("btnUnirse");
const btnEmpezar = document.getElementById("btnEmpezar");

const inputNombre = document.getElementById("inputNombre");
const inputCodigo = document.getElementById("inputCodigo");

const textoCodigo = document.getElementById("textoCodigo");
const codigoLobby = document.getElementById("codigoLobby");
const listaJugadores = document.getElementById("listaJugadores");

// =====================
// ESTADO
// =====================

let codigoSala = null;
let nombreJugador = null;

// =====================
// CREAR SALA
// =====================

btnCrearSala.addEventListener("click", async () => {
  nombreJugador = inputNombre.value.trim();
  if (!nombreJugador) return alert("Poné tu nombre");

  const res = await fetch(`${API_URL}/crear-sala`, {
    method: "POST"
  });

  const data = await res.json();
  codigoSala = data.codigo;

  textoCodigo.textContent = "Código de sala: " + codigoSala;

  await unirseSala();
});

// =====================
// UNIRSE A SALA
// =====================

btnUnirse.addEventListener("click", async () => {
  nombreJugador = inputNombre.value.trim();
  codigoSala = inputCodigo.value.trim().toUpperCase();

  if (!nombreJugador || !codigoSala) {
    return alert("Faltan datos");
  }

  await unirseSala();
});

async function unirseSala() {
  const res = await fetch(`${API_URL}/unirse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo: codigoSala,
      nombre: nombreJugador
    })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  mostrarLobby();
  actualizarLobby();
}

// =====================
// LOBBY
// =====================

function mostrarLobby() {
  pantallaInicio.style.display = "none";
  pantallaLobby.style.display = "block";
  codigoLobby.textContent = codigoSala;
}

async function actualizarLobby() {
  const res = await fetch(`${API_URL}/sala/${codigoSala}`);
  const sala = await res.json();

  listaJugadores.innerHTML = "";
  sala.jugadores.forEach(j => {
    const li = document.createElement("li");
    li.textContent = j;
    listaJugadores.appendChild(li);
  });
}

// =====================
// EMPEZAR PARTIDA
// =====================

btnEmpezar.addEventListener("click", () => {
  alert("Acá arranca la lógica del juego (siguiente paso)");
});

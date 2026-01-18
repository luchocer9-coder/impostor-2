const API_URL = "https://impostor-2-u22d.onrender.com";

// =====================
// ELEMENTOS DOM
// =====================

const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaLobby = document.getElementById("pantallaLobby");
const pantallaCarta = document.getElementById("pantallaCarta");

const inputNombre = document.getElementById("inputNombre");
const inputCodigo = document.getElementById("inputCodigo");

const btnCrearSala = document.getElementById("btnCrearSala");
const btnUnirse = document.getElementById("btnUnirse");
const btnEmpezar = document.getElementById("btnEmpezar");

const textoCodigo = document.getElementById("textoCodigo");
const codigoLobby = document.getElementById("codigoLobby");
const listaJugadores = document.getElementById("listaJugadores");
const selectCategoria = document.getElementById("selectCategoria");

const card = document.getElementById("card");
const textoCarta = document.getElementById("textoCarta");

// =====================
// ESTADO
// =====================

let codigoSala = null;
let nombreJugador = null;
let cartaMostrada = false;

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
  sala.jugadores.forEach(jugador => {
    const li = document.createElement("li");
    li.textContent = jugador;
    listaJugadores.appendChild(li);
  });
}

// =====================
// EMPEZAR PARTIDA
// =====================

btnEmpezar.addEventListener("click", async () => {
  const categoria = selectCategoria.value;

  await fetch(`${API_URL}/empezar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo: codigoSala,
      categoria
    })
  });

  pantallaLobby.style.display = "none";
  pantallaCarta.style.display = "block";
});

// =====================
// CARTA
// =====================

card.addEventListener("click", async () => {
  if (!cartaMostrada) {
    const res = await fetch(`${API_URL}/ver-carta`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: codigoSala,
        nombre: nombreJugador
      })
    });

    const data = await res.json();
    card.textContent = data.rol;
    textoCarta.textContent = "Volvé a tocar para ocultar";
    cartaMostrada = true;
  } else {
    card.textContent = "🂠";
    textoCarta.textContent = "Pasá el celu al siguiente";
    cartaMostrada = false;
  }
});

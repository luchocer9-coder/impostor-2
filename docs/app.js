// =====================
// CONFIG
// =====================
const API_URL = "https://impostor-2-u22d.onrender.com";

// =====================
// ELEMENTOS
// =====================
const crearBtn = document.getElementById("crearSalaBtn");
const unirseBtn = document.getElementById("unirseSalaBtn");

const codigoSalaSpan = document.getElementById("codigoSala");
const inputCodigo = document.getElementById("inputCodigo");
const inputNombre = document.getElementById("inputNombre");

const jugadoresUl = document.getElementById("listaJugadores");

// =====================
// CREAR SALA
// =====================
async function crearSala() {
  try {
    const res = await fetch(`${API_URL}/crear-sala`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    codigoSalaSpan.textContent = data.codigo;

    console.log("Sala creada:", data.codigo);
  } catch (error) {
    alert("Error al crear sala");
    console.error(error);
  }
}

// =====================
// UNIRSE A SALA
// =====================
async function unirseSala() {
  const codigo = inputCodigo.value.toUpperCase();
  const nombre = inputNombre.value.trim();

  if (!codigo || !nombre) {
    alert("Faltan datos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/unirse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo,
        nombre
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    mostrarJugadores(data.jugadores);
    console.log("Unido a sala", codigo);
  } catch (error) {
    alert("Error al unirse");
    console.error(error);
  }
}

// =====================
// MOSTRAR JUGADORES
// =====================
function mostrarJugadores(jugadores) {
  jugadoresUl.innerHTML = "";

  jugadores.forEach(jugador => {
    const li = document.createElement("li");
    li.textContent = jugador;
    jugadoresUl.appendChild(li);
  });
}

document.getElementById("btnEmpezar").addEventListener("click", async () => {
  await fetch("https://impostor-2-u22d.onrender.com/empezar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo })
  });

  alert("Partida iniciada");
});

// =====================
// EVENTOS
// =====================
crearBtn.addEventListener("click", crearSala);
unirseBtn.addEventListener("click", unirseSala);

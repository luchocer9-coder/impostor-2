// ============================
// ELEMENTOS DEL DOM
// ============================

const btnCrear = document.getElementById("btnCrear");
const btnUnirse = document.getElementById("btnUnirse");

const codigoInput = document.getElementById("codigo");
const nombreInput = document.getElementById("nombre");

const codigoSala = document.getElementById("codigoSala");
const resultado = document.getElementById("resultado");
const listaJugadores = document.getElementById("listaJugadores");

// ============================
// ESTADO
// ============================

let codigoActual = null;

// ============================
// CREAR SALA
// ============================

btnCrear.addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/crear-sala", {
      method: "POST"
    });

    const data = await res.json();

    codigoActual = data.codigo;

    codigoSala.textContent = "Código de sala: " + data.codigo;
    codigoInput.value = data.codigo;
    resultado.textContent = "Sala creada";

  } catch (err) {
    alert("Error creando sala");
  }
});

// ============================
// UNIRSE A SALA
// ============================

btnUnirse.addEventListener("click", async () => {
  const codigo = codigoInput.value;
  const nombre = nombreInput.value;

  if (!codigo || !nombre) {
    alert("Completá código y nombre");
    return;
  }

  codigoActual = codigo;

  try {
    const res = await fetch("http://localhost:3000/unirse", {
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
      resultado.textContent = data.error;
      return;
    }

    resultado.textContent = "Te uniste a la sala";

  } catch (err) {
    resultado.textContent = "Error conectando con el servidor";
  }
});

// ============================
// ACTUALIZAR JUGADORES
// ============================

async function actualizarJugadores() {
  if (!codigoActual) return;

  try {
    const res = await fetch(`http://localhost:3000/sala/${codigoActual}`);
    const data = await res.json();

    listaJugadores.innerHTML = "";

    data.jugadores.forEach(jugador => {
      const li = document.createElement("li");
      li.textContent = jugador;
      listaJugadores.appendChild(li);
    });

  } catch (err) {
    console.log("Error actualizando jugadores");
  }
}

const btnEmpezar = document.getElementById("btnEmpezar");
const btnRol = document.getElementById("btnRol");
const rolTexto = document.getElementById("rol");

// Empezar partida
btnEmpezar.addEventListener("click", async () => {
  if (!codigoActual) return;

  try {
    const res = await fetch("http://localhost:3000/empezar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: codigoActual })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Partida iniciada");

  } catch {
    alert("Error al empezar");
  }
});

// Ver mi rol
btnRol.addEventListener("click", async () => {
  const nombre = nombreInput.value;

  try {
    const res = await fetch("http://localhost:3000/mi-rol", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo: codigoActual,
        nombre
      })
    });

    const data = await res.json();

    if (!res.ok) {
      rolTexto.textContent = data.error;
      return;
    }

    rolTexto.textContent =
      data.rol === "IMPOSTOR"
        ? "🕵️ SOS EL IMPOSTOR"
        : "✅ Palabra: " + data.rol;

  } catch {
    rolTexto.textContent = "Error obteniendo rol";
  }
});


// ============================
// POLLING CADA 2 SEGUNDOS
// ============================

setInterval(actualizarJugadores, 2000);

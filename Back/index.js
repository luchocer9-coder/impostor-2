const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// =====================
// MEMORIA DEL SERVIDOR
// =====================

const salas = {};

// =====================
// UTILIDADES
// =====================

function generarCodigoSala() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let codigo = "";
  for (let i = 0; i < 4; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }
  return codigo;
}

function palabraRandom() {
  const palabras = [
    "Messi",
    "Maradona",
    "Boca",
    "River",
    "Scaloni",
    "AFA",
    "Riquelme",
    "Gallardo"
  ];
  return palabras[Math.floor(Math.random() * palabras.length)];
}

// =====================
// ENDPOINTS
// =====================

// Crear sala
app.post("/crear-sala", (req, res) => {
  const codigo = generarCodigoSala();

  salas[codigo] = {
    codigo,
    jugadores: [],
    roles: {},
    palabra: null,
    estado: "esperando"
  };

  console.log("Sala creada:", codigo);
  res.json({ codigo });
});

// Unirse a sala
app.post("/unirse", (req, res) => {
  const { codigo, nombre } = req.body;

  if (!codigo || !nombre) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const sala = salas[codigo];
  if (!sala) {
    return res.status(404).json({ error: "Sala no existe" });
  }

  const nombreNormalizado = nombre.trim().toLowerCase();

  if (sala.jugadores.map(j => j.toLowerCase()).includes(nombreNormalizado)) {
    return res.status(400).json({ error: "Nombre ya usado" });
  }

  sala.jugadores.push(nombre);

  console.log(`${nombre} se unió a ${codigo}`);
  res.json({ ok: true, jugadores: sala.jugadores });
});

// Empezar partida
app.post("/empezar", (req, res) => {
  const { codigo } = req.body;
  const sala = salas[codigo];

  if (!sala) return res.status(404).json({ error: "Sala no existe" });
  if (sala.jugadores.length < 3) {
    return res.status(400).json({ error: "Mínimo 3 jugadores" });
  }

  const palabra = palabraRandom();
  const impostorIndex = Math.floor(Math.random() * sala.jugadores.length);

  sala.roles = {};
  sala.palabra = palabra;
  sala.estado = "jugando";

  sala.jugadores.forEach((jugador, index) => {
    const key = jugador.trim().toLowerCase();
    if (index === impostorIndex) {
      sala.roles[key] = "🕵️ IMPOSTOR";
    } else {
      sala.roles[key] = `🎴 ${palabra}`;
    }
  });

  console.log("Partida iniciada:", codigo);
  res.json({ ok: true });
});

// Ver carta
app.post("/ver-carta", (req, res) => {
  const { codigo, nombre } = req.body;

  const sala = salas[codigo];
  if (!sala) return res.status(404).json({ error: "Sala no existe" });

  const key = nombre.trim().toLowerCase();
  const rol = sala.roles[key];

  if (!rol) {
    return res.status(404).json({ error: "Rol no encontrado" });
  }

  res.json({ rol });
});

// =====================

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

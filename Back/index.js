const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==================
// DATA EN MEMORIA
// ==================
const salas = {};

// ==================
// RUTA TEST
// ==================
app.get("/", (req, res) => {
  res.send("Servidor Impostor OK 🚀");
});

// ==================
// CREAR SALA
// ==================
app.post("/crear", (req, res) => {
  const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();

  salas[codigo] = {
    jugadores: [],
    roles: {},
    estado: "esperando"
  };

  console.log("Sala creada:", codigo);
  res.json({ codigo });
});

// ==================
// UNIRSE A SALA
// ==================
app.post("/unirse", (req, res) => {
  const { codigo, nombre } = req.body;
  const sala = salas[codigo];

  if (!sala) {
    return res.status(404).json({ error: "Sala no existe" });
  }

  if (sala.jugadores.includes(nombre)) {
    return res.status(400).json({ error: "Nombre ya usado" });
  }

  sala.jugadores.push(nombre);

  console.log(`${nombre} se unió a ${codigo}`);
  res.json({ ok: true, jugadores: sala.jugadores });
});

// ==================
// EMPEZAR PARTIDA
// ==================
app.post("/empezar", (req, res) => {
  const { codigo } = req.body;
  const sala = salas[codigo];

  if (!sala) {
    return res.status(404).json({ error: "Sala no existe" });
  }

  if (sala.jugadores.length < 3) {
    return res.status(400).json({ error: "Mínimo 3 jugadores" });
  }

  const indice = Math.floor(Math.random() * sala.jugadores.length);
  const impostor = sala.jugadores[indice];

  sala.roles = {};

  sala.jugadores.forEach(jugador => {
    sala.roles[jugador] =
      jugador === impostor ? "impostor" : "tripulante";
  });

  sala.estado = "jugando";

  console.log("Roles asignados:", sala.roles);
  res.json({ ok: true });
});

// ==================
// VER MI ROL (PRIVADO)
// ==================
app.post("/mi-rol", (req, res) => {
  const { codigo, nombre } = req.body;
  const sala = salas[codigo];

  if (!sala || sala.estado !== "jugando") {
    return res.status(400).json({ error: "Partida no iniciada" });
  }

  const rol = sala.roles[nombre];

  if (!rol) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }

  res.json({ rol });
});

// ==================
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* =====================
   MEMORIA DEL SERVIDOR
===================== */

const salas = {};

/* =====================
   CARTAS / PALABRAS
===================== */

const cartas = {
  futbol: [
    "Messi",
    "Maradona",
    "Di María",
    "Scaloni",
    "Boca",
    "River",
    "Racing",
    "Independiente",
    "San Lorenzo",
    "AFA",
    "Bombonera",
    "Monumental"
  ],
  peliculas: [
    "Titanic",
    "Matrix",
    "El Padrino",
    "Gladiador",
    "Rocky",
    "Star Wars"
  ]
};

/* =====================
   UTILIDADES
===================== */

function generarCodigoSala() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let codigo = "";
  for (let i = 0; i < 4; i++) {
    codigo += letras[Math.floor(Math.random() * letras.length)];
  }
  return codigo;
}

function randomDeArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* =====================
   ENDPOINTS
===================== */

// Crear sala
app.post("/crear-sala", (req, res) => {
  const codigo = generarCodigoSala();

  salas[codigo] = {
    codigo,
    jugadores: [],
    roles: {},
    palabra: null,
    categoria: null,
    estado: "esperando"
  };

  console.log("Sala creada:", codigo);
  res.json({ codigo });
});

// Unirse a sala
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

// Empezar partida (reparte roles)
app.post("/empezar", (req, res) => {
  const { codigo, categoria } = req.body;
  const sala = salas[codigo];

  if (!sala) {
    return res.status(404).json({ error: "Sala no existe" });
  }

  if (sala.jugadores.length < 3) {
    return res.status(400).json({ error: "Mínimo 3 jugadores" });
  }

  const categoriaElegida = categoria || "futbol";
  const palabraElegida = randomDeArray(cartas[categoriaElegida]);

  const impostorIndex = Math.floor(
    Math.random() * sala.jugadores.length
  );

  sala.roles = {};
  sala.palabra = palabraElegida;
  sala.categoria = categoriaElegida;
  sala.estado = "jugando";

  sala.jugadores.forEach((jugador, index) => {
    sala.roles[jugador] =
      index === impostorIndex
        ? "🕵️ IMPOSTOR"
        : palabraElegida;
  });

  console.log("Partida iniciada en", codigo);
  console.log("Palabra:", palabraElegida);
  console.log("Impostor:", sala.jugadores[impostorIndex]);

  res.json({ ok: true });
});

// Ver carta (rol individual)
app.post("/ver-carta", (req, res) => {
  const { codigo, nombre } = req.body;
  const sala = salas[codigo];

  if (!sala) {
    return res.status(404).json({ error: "Sala no existe" });
  }

  if (sala.estado !== "jugando") {
    return res.status(400).json({ error: "La partida no empezó" });
  }

  const rol = sala.roles[nombre];

  if (!rol) {
    return res.status(400).json({ error: "Jugador no válido" });
  }

  res.json({ rol });
});

// Info sala (debug / lobby)
app.get("/sala/:codigo", (req, res) => {
  const sala = salas[req.params.codigo];
  if (!sala) {
    return res.status(404).json({ error: "Sala no existe" });
  }
  res.json(sala);
});

/* ===================== */

app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});

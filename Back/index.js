const palabras = [
    "Messi",
    "Maradona",
    "Boca",
    "River",
    "Barcelona",
    "Real Madrid"
  ];
  

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

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

// =====================
// ENDPOINTS
// =====================

// Crear sala
app.post("/crear-sala", (req, res) => {
  const codigo = generarCodigoSala();

  salas[codigo] = {
    codigo,
    jugadores: [],
    palabra: null,
    roles: {},
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

app.post("/empezar", (req, res) => {
    const { codigo } = req.body;
    const sala = salas[codigo];
  
    if (!sala) {
      return res.status(404).json({ error: "Sala no existe" });
    }
  
    if (sala.jugadores.length < 3) {
      return res.status(400).json({ error: "Mínimo 3 jugadores" });
    }
  
    // Elegir palabra
    const palabra =
      palabras[Math.floor(Math.random() * palabras.length)];
  
    // Elegir impostor
    const impostorIndex = Math.floor(
      Math.random() * sala.jugadores.length
    );
  
    sala.palabra = palabra;
    sala.roles = {};
    sala.estado = "jugando";
  
    sala.jugadores.forEach((jugador, index) => {
      sala.roles[jugador] =
        index === impostorIndex ? "IMPOSTOR" : palabra;
    });
  
    console.log("Partida iniciada en sala", codigo);
  
    res.json({ ok: true });
  });
  
  app.post("/mi-rol", (req, res) => {
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
      return res.status(404).json({ error: "Jugador no encontrado" });
    }
  
    res.json({ rol });
  });
  

// Info sala (debug)
app.get("/sala/:codigo", (req, res) => {
  const sala = salas[req.params.codigo];
  if (!sala) return res.status(404).json({ error: "No existe" });
  res.json(sala);
});

// =====================

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

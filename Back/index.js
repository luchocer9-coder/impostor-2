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

// Info sala
app.get("/sala/:codigo", (req, res) => {
  const sala = salas[req.params.codigo];
  if (!sala) return res.status(404).json({ error: "Sala no existe" });
  res.json(sala);
});

// =====================

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

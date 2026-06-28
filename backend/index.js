const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// PRUEBA
// ======================
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

// ======================
// REGISTRO (SEGURO)
app.post("/registro", (req, res) => {
  console.log("BODY RECIBIDO:", req.body);

  const { nombre, apellido, correo, password, rol } = req.body;

  if (!nombre || !apellido || !correo || !password || !rol) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const hash = bcrypt.hashSync(password, 10);

  const sql =
    "INSERT INTO usuarios (nombre, apellido, correo, password, rol) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [nombre, apellido, correo, hash, rol], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json({ message: "Usuario creado correctamente" });
  });
});


// ======================
// LOGIN
// ======================
app.post("/login", (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  const sql = "SELECT * FROM usuarios WHERE correo = ?";

  db.query(sql, [correo], (err, results) => {
    if (err) return res.status(500).json(err);

if (results.length === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = results[0];

    // 🔥 DEBUG (MUY IMPORTANTE)
    console.log("PASSWORD BD:", user.password);
    console.log("PASSWORD INPUT:", password);

    const passwordValida = bcrypt.compareSync(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, correo: user.correo },
      "secreto123",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso 🔐", token });
  });
});

// ======================
// GET USUARIOS
// ======================
app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ======================
// CREATE USUARIO (ADMIN)
// ======================
app.post("/usuarios", (req, res) => {
  const { nombre, correo, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const sql =
    "INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)";

  db.query(sql, [nombre, correo, hash], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Usuario creado" });
  });
});

// ======================
// UPDATE
// ======================
app.put("/usuarios/:id", (req, res) => {
  const { nombre, correo, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  const sql =
    "UPDATE usuarios SET nombre=?, correo=?, password=? WHERE id=?";

  db.query(sql, [nombre, correo, hash, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Usuario actualizado" });
  });
});

// ======================
// DELETE
// ======================
app.delete("/usuarios/:id", (req, res) => {
  db.query("DELETE FROM usuarios WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Usuario eliminado" });
  });
});

// ======================
// SERVER
// ======================
app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});
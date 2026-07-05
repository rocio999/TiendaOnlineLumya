const express = require("express");
const cors = require("cors");
const db = require("./db"); // Asegúrate de que este archivo exista en la misma carpeta
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀 Firebase listo");
});

// Registro
app.post("/registro", async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;
    if (!nombre || !apellido || !correo || !password) {
      return res.status(400).json({ message: "Faltan datos en el servidor" });
    }
    const hash = bcrypt.hashSync(password, 10);
    const user = { nombre, apellido, correo, password: hash, estado: "activo", createdAt: new Date() };
    const ref = await db.collection("usuarios").add(user);
    res.status(201).json({ id: ref.id, message: "Usuario creado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    const snapshot = await db.collection("usuarios").where("correo", "==", correo).get();
    if (snapshot.empty) return res.status(404).json({ message: "No encontrado" });
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: "Clave incorrecta" });
    res.json({ message: "Login exitoso", user: { id: userDoc.id, nombre: user.nombre } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3001, () => console.log("Servidor en http://localhost:3001"));
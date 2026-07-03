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
  res.send("Backend funcionando 🚀 Firebase listo");
});

// ======================
// REGISTRO
// ======================
app.post("/registro", async (req, res) => {
  try {
    const { nombre, apellido, correo, password, rol } = req.body;

    if (!nombre || !apellido || !correo || !password || !rol) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const hash = bcrypt.hashSync(password, 10);

    const user = {
      nombre,
      apellido,
      correo,
      password: hash,
      rol,
      estado: "activo",
      createdAt: new Date(),
    };

    const ref = await db.collection("usuarios").add(user);

    res.json({
      id: ref.id,
      message: "Usuario creado en Firebase",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// LOGIN
// ======================
app.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const snapshot = await db
      .collection("usuarios")
      .where("correo", "==", correo)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const passwordValida = bcrypt.compareSync(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: userDoc.id, correo: user.correo },
      "secreto123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso 🔐",
      token,
      user: {
        id: userDoc.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// GET USUARIOS
// ======================
app.get("/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();

    const usuarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// UPDATE USUARIO
// ======================
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("usuarios").doc(id).update(req.body);

    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// DELETE USUARIO
// ======================
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await db.collection("usuarios").doc(req.params.id).delete();

    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// PRODUCTOS
// ======================

// GET
app.get("/productos", async (req, res) => {
  try {
    const snapshot = await db.collection("productos").get();

    const productos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST
app.post("/productos", async (req, res) => {
  try {
    const data = {
      ...req.body,
      createdAt: new Date(),
    };

    const ref = await db.collection("productos").add(data);

    res.json({ id: ref.id, message: "Producto creado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BY ID
app.get("/productos/:id", async (req, res) => {
  try {
    const doc = await db.collection("productos").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
app.put("/productos/:id", async (req, res) => {
  try {
    await db.collection("productos").doc(req.params.id).update(req.body);

    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
app.delete("/productos/:id", async (req, res) => {
  try {
    await db.collection("productos").doc(req.params.id).delete();

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// PAGOS
// ======================

// GET
app.get("/pagos", async (req, res) => {
  try {
    const snapshot = await db.collection("pagos").get();

    const pagos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST
app.post("/pagos", async (req, res) => {
  try {
    const data = {
      ...req.body,
      estado: "Pendiente",
      createdAt: new Date(),
    };

    const ref = await db.collection("pagos").add(data);

    res.json({ id: ref.id, message: "Pago registrado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE ESTADO
app.put("/pagos/:id", async (req, res) => {
  try {
    const { estado } = req.body;

    await db.collection("pagos").doc(req.params.id).update({ estado });

    res.json({ message: "Pago actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// SUSPENDER USUARIO
// ======================
app.put("/usuarios/:id/suspender", async (req, res) => {
  try {
    const { estado } = req.body;

    await db.collection("usuarios").doc(req.params.id).update({ estado });

    res.json({ message: "Estado de usuario actualizado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ======================
// SERVER
// ======================
app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});
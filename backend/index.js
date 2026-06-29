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
// PRODUCTOS
// ======================
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, precio, descripcion, categoria, stock, vendedor_id } = req.body;
  const sql = "INSERT INTO productos (nombre, precio, descripcion, categoria, stock, vendedor_id) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [nombre, precio, descripcion, categoria, stock, vendedor_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Producto creado" });
  });
});

app.get("/productos/:id", (req, res) => {
  db.query("SELECT * FROM productos WHERE id=?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});

app.put("/productos/:id", (req, res) => {
  const { nombre, precio, descripcion, categoria, stock } = req.body;
  const sql = "UPDATE productos SET nombre=?, precio=?, descripcion=?, categoria=?, stock=? WHERE id=?";
  db.query(sql, [nombre, precio, descripcion, categoria, stock, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Producto actualizado" });
  });
});

app.delete("/productos/:id", (req, res) => {
  db.query("DELETE FROM productos WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Producto eliminado" });
  });
});

// ======================
// PAGOS
// ======================
app.get("/pagos", (req, res) => {
  db.query("SELECT * FROM pagos", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/pagos", (req, res) => {
  const { cliente_id, vendedor_id, producto_id, monto, comprobante } = req.body;
  const sql = "INSERT INTO pagos (cliente_id, vendedor_id, producto_id, monto, comprobante, estado) VALUES (?, ?, ?, ?, ?, 'Pendiente')";
  db.query(sql, [cliente_id, vendedor_id, producto_id, monto, comprobante], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Pago registrado" });
  });
});

app.put("/pagos/:id", (req, res) => {
  const { estado } = req.body;
  const sql = "UPDATE pagos SET estado=? WHERE id=?";
  db.query(sql, [estado, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Pago actualizado" });
  });
});

// ======================
// SUSPENDER USUARIO
// ======================
app.put("/usuarios/:id/suspender", (req, res) => {
  const { estado } = req.body;
  const sql = "UPDATE usuarios SET estado=? WHERE id=?";
  db.query(sql, [estado, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Usuario actualizado" });
  });
});
// ======================
// SERVER
// ======================
app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});
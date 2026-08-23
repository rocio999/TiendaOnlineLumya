import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Si usas archivos locales (asegúrate de que terminen en .js si son locales)
// import { db } from "./firebase.js"; 
// import imagekit from "./imagekit.js";

// Inicializar Firebase usando la variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Configuración de CORS
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options(/.*/, cors());

app.use(express.json({ limit: "10mb" }));

const JWT_SECRET = process.env.JWT_SECRET || "secreto123";
const ADMIN_KEY = process.env.ADMIN_KEY || "lumya-admin-2026";

// ======================
// MIDDLEWARES & HELPERS
// ======================
function verificarAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}


async function registrarAuditoria(usuarioId, accion, tipo) {
  try {
    await db.collection("historial").add({
      usuarioId,
      accion,
      tipo,
      fecha: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
  }
}

async function crearNotificacion(usuarioId, mensaje, tipo) {
  try {
    await db.collection("notificaciones").add({
      usuarioId,
      mensaje,
      tipo,
      leida: false,
      fecha: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al crear notificación:", error);
  }
}

// ======================
// RUTAS PRINCIPALES
// ======================

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀 (Firestore)");
});

// ----------------------
// AUTENTICACIÓN Y USUARIOS
// ----------------------

// Registro de Admin
app.post("/registro-admin", verificarAdmin, async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existente = await db.collection("usuarios").where("correo", "==", correo).get();
    if (!existente.empty) {
      return res.status(409).json({ message: "Ese correo ya está registrado" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const nuevoDoc = await db.collection("usuarios").add({
      nombre,
      apellido: apellido || "",
      correo,
      password: hash,
      rol: "admin",
      estado: "activo",
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ message: "Administrador creado correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en /registro-admin:", error);
    res.status(500).json({ message: "Error al registrar administrador" });
  }
});

// Login de Admin
app.post("/login-admin", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const resultado = await db.collection("usuarios")
      .where("correo", "==", correo)
      .where("rol", "==", "admin")
      .get();

    if (resultado.empty) {
      return res.status(404).json({ message: "Correo o contraseña incorrectos" });
    }

    const doc = resultado.docs[0];
    const admin = doc.data();

    if (!bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: doc.id, correo: admin.correo, rol: admin.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login exitoso 🔐",
      token,
      admin: {
        id: doc.id,
        nombre: admin.nombre,
        correo: admin.correo,
      },
    });
  } catch (error) {
    console.error("Error en /login-admin:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Registro de Cliente
app.post("/registro-cliente", async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existente = await db.collection("usuarios").where("correo", "==", correo).get();
    if (!existente.empty) {
      return res.status(409).json({ message: "Ese correo ya está registrado" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const nuevoDoc = await db.collection("usuarios").add({
      nombre,
      apellido: apellido || "",
      correo,
      password: hash,
      rol: "cliente",
      estado: "activo",
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ message: "Usuario creado correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en /registro-cliente:", error);
    res.status(500).json({ message: "Error al registrar cliente" });
  }
});

// Login General
app.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const resultado = await db.collection("usuarios").where("correo", "==", correo).get();
    if (resultado.empty) {
      return res.status(404).json({ message: "Correo o contraseña incorrectos" });
    }

    const doc = resultado.docs[0];
    const usuario = doc.data();

    if (!bcrypt.compareSync(password, usuario.password)) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    if (usuario.estado === "suspendido") {
      return res.status(403).json({ message: "Tu cuenta está suspendida" });
    }

    const token = jwt.sign(
      { id: doc.id, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login exitoso 🔐",
      token,
      usuario: {
        id: doc.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido || "",
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Recuperar Contraseña
app.post("/recuperar-contrasena", async (req, res) => {
  try {
    const { correo, nuevaPassword } = req.body;

    if (!correo || !nuevaPassword) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const usuario = await db.collection("usuarios").where("correo", "==", correo).get();
    if (usuario.empty) {
      return res.status(404).json({ message: "El correo no está registrado" });
    }

    const doc = usuario.docs[0];
    const nuevaClaveHash = bcrypt.hashSync(nuevaPassword, 10);

    await doc.ref.update({ password: nuevaClaveHash });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en /recuperar-contrasena:", error);
    res.status(500).json({ message: "Error al actualizar contraseña" });
  }
});

// Obtener Cliente por ID
app.get("/clientes/:id", async (req, res) => {
  try {
    const docSnap = await db.collection("usuarios").doc(req.params.id).get();
    if (!docSnap.exists) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error en GET /clientes/:id:", error);
    res.status(500).json({ message: "Error al obtener cliente" });
  }
});

// Listar todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const snap = await db.collection("usuarios").get();
    const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(lista);
  } catch (error) {
    console.error("Error en GET /usuarios:", error);
    res.status(500).json({ message: "Error al listar usuarios" });
  }
});

// Cambiar estado de Usuario
app.put("/usuarios/:id/estado", verificarAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["activo", "suspendido"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const docSnap = await db.collection("usuarios").doc(req.params.id).get();
    const usuario = docSnap.data();
    await db.collection("usuarios").doc(req.params.id).update({ estado });

    const accion = estado === "suspendido" ? "Suspendió" : "Activó";
    await registrarAuditoria(
      req.params.id,
      `${accion} al usuario ${usuario?.nombreNegocio || usuario?.nombre}`,
      "usuario"
    );

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /usuarios/:id/estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});

// ----------------------
// VENDEDORES
// ----------------------

// Registro de Vendedor
app.post("/registro-vendedor", async (req, res) => {
  try {
    const {
      nombre, cedula, correo, telefono, password,
      nombreNegocio, descripcion, banco, numeroCuenta,
      whatsapp, qrUrl, qrDeUnaUrl, aceptaTerminos
    } = req.body;

    if (!nombre || !correo || !password || !nombreNegocio) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existente = await db.collection("usuarios").where("correo", "==", correo).get();
    if (!existente.empty) {
      return res.status(409).json({ message: "Ese correo ya está registrado" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const nuevoDoc = await db.collection("usuarios").add({
      nombre,
      cedula: cedula || "",
      correo,
      telefono: telefono || "",
      password: hash,
      rol: "vendedor",
      estado: "pendiente",
      nombreNegocio,
      descripcion: descripcion || "",
      banco: banco || "",
      numeroCuenta: numeroCuenta || "",
      whatsapp: whatsapp || "",
      qrUrl: qrUrl || "",
      qrDeUnaUrl: qrDeUnaUrl || "",
      aceptaTerminos: aceptaTerminos || false,
      fechaAceptacionTerminos: aceptaTerminos ? FieldValue.serverTimestamp() : null,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ message: "Solicitud enviada correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en /registro-vendedor:", error);
    res.status(500).json({ message: "Error al registrar vendedor" });
  }
});

// Login Vendedor
app.post("/login-vendedor", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const resultado = await db.collection("usuarios")
      .where("correo", "==", correo)
      .where("rol", "==", "vendedor")
      .get();

    if (resultado.empty) {
      return res.status(404).json({ message: "Correo o contraseña incorrectos" });
    }

    const doc = resultado.docs[0];
    const vendedor = doc.data();

    if (!bcrypt.compareSync(password, vendedor.password)) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    if (vendedor.estado === "pendiente") {
      return res.status(403).json({ message: "Tu solicitud aún está pendiente de aprobación" });
    }
    if (vendedor.estado === "suspendido") {
      return res.status(403).json({ message: "Tu cuenta está suspendida" });
    }
    if (vendedor.estado === "rechazado") {
      return res.status(403).json({ message: "Tu solicitud fue rechazada" });
    }
    if (vendedor.estado !== "activo") {
      return res.status(403).json({ message: "Tu cuenta no tiene acceso habilitado" });
    }

    const token = jwt.sign(
      { id: doc.id, correo: vendedor.correo, rol: vendedor.rol },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login exitoso 🔐",
      token,
      vendedor: {
        id: doc.id,
        nombre: vendedor.nombre,
        nombreNegocio: vendedor.nombreNegocio,
        correo: vendedor.correo,
      },
    });
  } catch (error) {
    console.error("Error en /login-vendedor:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

// Listar Vendedores
app.get("/vendedores", async (req, res) => {
  try {
    const snap = await db.collection("usuarios").where("rol", "==", "vendedor").get();
    const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(lista);
  } catch (error) {
    console.error("Error en GET /vendedores:", error);
    res.status(500).json({ message: "Error al listar vendedores" });
  }
});

// Obtener Vendedor por ID
app.get("/vendedores/:id", async (req, res) => {
  try {
    const docSnap = await db.collection("usuarios").doc(req.params.id).get();
    if (!docSnap.exists) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error en GET /vendedores/:id:", error);
    res.status(500).json({ message: "Error al obtener vendedor" });
  }
});

// Cambiar Estado Vendedor
app.put("/vendedores/:id/estado", verificarAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["activo", "rechazado", "suspendido", "pendiente"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const docSnap = await db.collection("usuarios").doc(req.params.id).get();
    const vendedor = docSnap.data();

    await db.collection("usuarios").doc(req.params.id).update({ estado });

    const acciones = {
      activo: "Aprobó",
      rechazado: "Rechazó",
      suspendido: "Suspendió",
      pendiente: "Marcó como pendiente a",
    };

    await registrarAuditoria(
      req.params.id,
      `${acciones[estado]} al vendedor ${vendedor?.nombreNegocio || vendedor?.nombre}`,
      "vendedor"
    );

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /vendedores/:id/estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});

// Actualizar Datos de Vendedor
app.put("/vendedores/:id", verificarAdmin, async (req, res) => {
  try {
    const datos = { ...req.body };
    delete datos.password;

    await db.collection("usuarios").doc(req.params.id).update(datos);
    await registrarAuditoria(
      req.params.id,
      `Editó los datos del vendedor ${datos.nombreNegocio || ""}`,
      "vendedor"
    );

    res.json({ message: "Vendedor actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /vendedores/:id:", error);
    res.status(500).json({ message: "Error al actualizar vendedor" });
  }
});

// ----------------------
// PRODUCTOS Y CATEGORÍAS
// ----------------------

// Listar Productos
app.get("/productos", async (req, res) => {
  try {
    const productosSnap = await db.collection("productos").get();
    const vendedoresSnap = await db.collection("usuarios").where("rol", "==", "vendedor").get();

    const mapaVendedores = {};
    vendedoresSnap.docs.forEach((v) => {
      mapaVendedores[v.id] = v.data().nombreNegocio || v.data().nombre || "Vendedor";
    });

    const lista = productosSnap.docs
      .filter((p) => p.data().estado !== "suspendido")
      .map((p) => {
        const data = p.data();
        return {
          id: p.id,
          ...data,
          vendedorNombre: mapaVendedores[data.vendedorId] || "Desconocido",
        };
      });

    res.json(lista);
  } catch (error) {
    console.error("Error en GET /productos:", error);
    res.status(500).json({ message: "Error al listar productos" });
  }
});

// Crear Producto
app.post("/productos", async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria, stock, vendedorId, imagenUrl } = req.body;

    if (!nombre || !precio || !categoria || stock === undefined || !vendedorId) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nuevoDoc = await db.collection("productos").add({
      nombre,
      precio: Number(precio),
      descripcion: descripcion || "",
      categoria,
      stock: Number(stock),
      vendedorId,
      imagenUrl: imagenUrl || "",
      estado: "activo",
      createdAt: FieldValue.serverTimestamp(),
    });

    await registrarAuditoria(vendedorId, `Subió el producto ${nombre}`, "producto");

    res.json({ message: "Producto creado correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en POST /productos:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
});

// Actualizar producto completo
app.put("/productos/:id", async (req, res) => {
  try {
    const { nombre, precio, descripcion, categoria, stock, imagenUrl } = req.body;
    const productoId = req.params.id;

    const docRef = db.collection("productos").doc(productoId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const datosActualizados = {
      ...(nombre && { nombre }),
      ...(precio !== undefined && { precio: Number(precio) }),
      ...(descripcion !== undefined && { descripcion }),
      ...(categoria && { categoria }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(imagenUrl !== undefined && { imagenUrl }),
    };

    await docRef.update(datosActualizados);

    const productoData = docSnap.data();
    await registrarAuditoria(productoData.vendedorId || "vendedor", `Actualizó el producto ${nombre || productoData.nombre}`, "producto");

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /productos/:id:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

// Eliminar un producto (Sin restricción de admin estricta para permitir borrado directo desde el panel del vendedor)
app.delete("/productos/:id", async (req, res) => {
  try {
    const productoId = req.params.id;
    const docRef = db.collection("productos").doc(productoId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const productoData = docSnap.data();

    // Eliminar de Firestore
    await docRef.delete();

    // Registrar en auditoría
    await registrarAuditoria(productoData.vendedorId || "vendedor", `Eliminó el producto ${productoData?.nombre || productoId}`, "producto");

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error en DELETE /productos/:id:", error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});


// Listar Categorías
app.get("/categorias", async (req, res) => {
  try {
    const snap = await db.collection("categorias").get();
    const lista = snap.docs.map((c) => ({ id: c.id, ...c.data() }));
    res.json(lista);
  } catch (error) {
    console.error("Error en GET /categorias:", error);
    res.status(500).json({ message: "Error al listar categorías" });
  }
});

// Crear Categoría
app.post("/categorias", verificarAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, emoji } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nuevoDoc = await db.collection("categorias").add({
      nombre,
      descripcion,
      emoji: emoji || "📦",
      estado: "Activa",
      createdAt: FieldValue.serverTimestamp(),
    });

    await registrarAuditoria("admin", `Creó categoría ${nombre}`, "categoria");

    res.json({ message: "Categoría creada correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en POST /categorias:", error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
});

// Cambiar Estado Categoría
app.put("/categorias/:id/estado", verificarAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["Activa", "Inactiva"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const docSnap = await db.collection("categorias").doc(req.params.id).get();
    const categoria = docSnap.data();

    await db.collection("categorias").doc(req.params.id).update({ estado });

    const accion = estado === "Inactiva" ? "Desactivó" : "Activó";
    await registrarAuditoria("admin", `${accion} la categoría ${categoria?.nombre}`, "categoria");

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /categorias/:id/estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});

// Eliminar Categoría
app.delete("/categorias/:id", verificarAdmin, async (req, res) => {
  try {
    const docSnap = await db.collection("categorias").doc(req.params.id).get();
    const categoria = docSnap.data();

    await db.collection("categorias").doc(req.params.id).delete();
    await registrarAuditoria("admin", `Eliminó la categoría ${categoria?.nombre}`, "categoria");

    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error en DELETE /categorias/:id:", error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
});

// ----------------------
// PAGOS Y PEDIDOS
// ----------------------

// Listar Pagos
app.get("/pagos", async (req, res) => {
  try {
    const pagosSnap = await db.collection("pagos").get();
    const usuariosSnap = await db.collection("usuarios").get();

 const mapaUsuarios = {};

usuariosSnap.docs.forEach((u) => {
  const datos = u.data();

  if (datos.nombreNegocio) {
    mapaUsuarios[u.id] = datos.nombreNegocio;
  } else if (datos.nombre) {
    mapaUsuarios[u.id] = datos.nombre.split(" ").slice(0, 2).join(" ");
  } else {
    mapaUsuarios[u.id] = "Desconocido";
  }
});

    const lista = pagosSnap.docs.map((p) => {
      const data = p.data();
      return {
        id: p.id,
        ...data,
        clienteNombreResuelto: mapaUsuarios[data.usuarioId] || "Cliente desconocido",
        vendedorNombreResuelto: mapaUsuarios[data.vendedorId] || "Vendedor desconocido",
      };
    });

    res.json(lista);
  } catch (error) {
    console.error("Error en GET /pagos:", error);
    res.status(500).json({ message: "Error al listar pagos" });
  }
});

// Crear Pago / Pedido
app.post("/pagos", async (req, res) => {
  try {
    const {
      usuarioId,
      vendedorId,
      producto,
      monto,
      metodo,
      pedidoId,

      // Datos del comprador
      cliente,

      tipoEntrega,
      provincia,
      ciudad,
      direccion,
      referencia,
      cooperativa,
      ciudadDestino,

      costoEnvio,
      envio,
      subtotal,
      montoTotal,
      comprobanteUrl,
      productos
    } = req.body;

    if (!usuarioId || !producto || !monto) {
      return res.status(400).json({
        message: "Faltan datos obligatorios"
      });
    }

    // Asegurar que productos sea un arreglo
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        message: "No hay productos para procesar"
      });
    }

    const costoEnvioFinal = Number(costoEnvio ?? envio ?? 0);
    const montoNum = Number(monto);

    // ==========================================
    // VERIFICAR Y DESCONTAR STOCK
    // ==========================================

    for (const item of productos) {
      const docRef = db.collection("productos").doc(item.id);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return res.status(404).json({
          message: `Producto no encontrado: ${item.nombre}`
        });
      }

      const datos = docSnap.data();

      const stockActual = Number(datos.stock || 0);
      const cantidadComprar = Number(item.cantidad || 0);

      // Verificar que la cantidad sea válida
      if (cantidadComprar <= 0) {
        return res.status(400).json({
          message: `Cantidad inválida para ${item.nombre}`
        });
      }

      // Verificar que haya suficiente stock
      if (stockActual < cantidadComprar) {
        return res.status(400).json({
          message: `Solo quedan ${stockActual} unidades de ${item.nombre}`
        });
      }

      // Calcular nuevo stock
      const nuevoStock = stockActual - cantidadComprar;

      // Descontar stock UNA SOLA VEZ
      await docRef.update({
        stock: nuevoStock
      });

      // Notificar al vendedor cuando queda exactamente en 0
      if (nuevoStock === 0 && datos.vendedorId) {
        await crearNotificacion(
          datos.vendedorId,
          `Tu producto "${datos.nombre}" se quedó sin stock`,
          "stock"
        );
      }
    }

    // ==========================================
    // CREAR PAGO / PEDIDO
    // ==========================================

    const nuevoDoc = await db.collection("pagos").add({
      usuarioId,
      vendedorId: vendedorId || "",
      pedidoId: pedidoId || `pedido_${Date.now()}`,

      cliente: cliente || {},

      producto,
      productos,

      monto: montoNum,
      subtotal: Number(subtotal) || 0,
      costoEnvio: costoEnvioFinal,
      montoTotal: Number(montoTotal) || montoNum,

      metodo: metodo || "Efectivo",

      tipoEntrega: tipoEntrega || "",
      provincia: provincia || "",
      ciudad: ciudad || "",
      direccion: direccion || "",
      referencia: referencia || "",
      cooperativa: cooperativa || "",
      ciudadDestino: ciudadDestino || "",

      comprobante: comprobanteUrl || "sin_comprobante.jpg",

      estado: "pendiente",

      fecha: FieldValue.serverTimestamp(),
    });

    // ==========================================
    // AUDITORÍA
    // ==========================================

    await registrarAuditoria(
      usuarioId,
      `Realizó una compra: ${producto} - $${monto}`,
      "pago"
    );

    // ==========================================
    // NOTIFICAR AL VENDEDOR
    // ==========================================

    if (vendedorId) {
      await crearNotificacion(
        vendedorId,
        `Nuevo pedido: ${producto} - $${monto}`,
        "pedido"
      );
    }

    res.json({
      message: "Pedido registrado correctamente",
      id: nuevoDoc.id
    });

  } catch (error) {
    console.error("Error en POST /pagos:", error);

    res.status(500).json({
      message: "Error al crear pago"
    });
  }
});
// ----------------------
// NOTIFICACIONES E HISTORIAL
// ----------------------

app.get("/notificaciones/:usuarioId", async (req, res) => {
  try {
    const snap = await db.collection("notificaciones")
      .where("usuarioId", "==", req.params.usuarioId)
      .orderBy("fecha", "desc")
      .get();

    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(lista);
  } catch (error) {
    console.error("Error en GET /notificaciones:", error);
    res.status(500).json({ message: "Error al listar notificaciones" });
  }
});

app.put("/notificaciones/:id/leida", async (req, res) => {
  try {
    await db.collection("notificaciones").doc(req.params.id).update({ leida: true });
    res.json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error en PUT /notificaciones/:id/leida:", error);
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
});

app.get("/historial", async (req, res) => {
  try {
    const historialSnap = await db.collection("historial").orderBy("fecha", "desc").get();
    const usuariosSnap = await db.collection("usuarios").get();

    const mapaUsuarios = {};
    usuariosSnap.docs.forEach((u) => {
      mapaUsuarios[u.id] = {
        nombre: u.data().nombreNegocio || u.data().nombre || "Usuario",
        rol: u.data().rol || "cliente",
      };
    });

    const lista = historialSnap.docs.map((h) => {
      const data = h.data();
      const usuarioInfo = mapaUsuarios[data.usuarioId] || { nombre: "Sistema", rol: "admin" };
      return {
        id: h.id,
        accion: data.accion,
        tipo: data.tipo,
        fecha: data.fecha,
        usuario: usuarioInfo.nombre,
        rol: usuarioInfo.rol,
      };
    });

    res.json(lista);
  } catch (error) {
    console.error("Error en GET /historial:", error);
    res.status(500).json({ message: "Error al listar historial" });
  }
});

// ----------------------
// SUBIDA DE ARCHIVOS (ImageKit)
// ----------------------

app.post("/imagenes", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ninguna imagen" });
    }

    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: `producto_${Date.now()}_${req.file.originalname}`,
      folder: "/productos",
    });

    res.json({ url: result.url });
  } catch (error) {
    console.error("Error en POST /imagenes:", error);
    res.status(500).json({ message: "Error al procesar la imagen" });
  }
});

// ======================
// INICIO DEL SERVIDOR
// ======================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT} (conectado a Firestore)`);
});

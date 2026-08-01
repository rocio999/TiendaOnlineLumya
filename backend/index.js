const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, FieldValue } = require("./firebase");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
});


const imagekit = require("./imagekit");
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "secreto123";
const ADMIN_KEY = "lumya-admin-2026";

function verificarAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(403).json({ message: "No autorizado" });
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
    console.error("Error al crear notificacion:", error);
  }
}

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀 (Firestore)");
});


// ======================
// REGISTRO DE ADMIN (protegido con clave)

app.post("/registro-admin", verificarAdmin, async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existente = await db.collection("usuarios")
      .where("correo", "==", correo)
      .get();

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

// ======================
// LOGIN DE ADMIN
// ======================
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

    const passwordValida = bcrypt.compareSync(password, admin.password);
    if (!passwordValida) {
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

app.post("/registro-cliente", async (req, res) => {
  try {
    const { nombre, apellido, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existente = await db.collection("usuarios")
      .where("correo", "==", correo)
      .get();

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

app.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const resultado = await db.collection("usuarios")
      .where("correo", "==", correo)
      .get();

    if (resultado.empty) {
      return res.status(404).json({ message: "Correo o contraseña incorrectos" });
    }

    const doc = resultado.docs[0];
    const usuario = doc.data();

    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida) {
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

app.post("/registro-vendedor", async (req, res) => {
  try {
    const {
      nombre, cedula, correo, telefono, password,
      nombreNegocio, descripcion, banco, numeroCuenta,
    } = req.body;

    if (!nombre || !correo || !password || !nombreNegocio) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const existente = await db.collection("usuarios")
      .where("correo", "==", correo)
      .get();

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
      createdAt: FieldValue.serverTimestamp(),
    });

    res.json({ message: "Solicitud enviada correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en /registro-vendedor:", error);
    res.status(500).json({ message: "Error al registrar vendedor" });
  }
});

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

    const passwordValida = bcrypt.compareSync(password, vendedor.password);
    if (!passwordValida) {
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
      imagenUrl,
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

app.put("/productos/:id/estado", verificarAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["activo", "suspendido"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }
    const docSnap = await db.collection("productos").doc(req.params.id).get();
    const producto = docSnap.data();
    await db.collection("productos").doc(req.params.id).update({ estado });

    const accion = estado === "suspendido" ? "Suspendió" : "Activó";
    await registrarAuditoria("admin", `${accion} el producto ${producto?.nombre}`, "producto");

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /productos/:id/estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});

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

app.get("/pagos", async (req, res) => {
  try {
    const pagosSnap = await db.collection("pagos").get();
    const usuariosSnap = await db.collection("usuarios").get();

    const mapaUsuarios = {};
    usuariosSnap.docs.forEach((u) => {
      mapaUsuarios[u.id] = u.data().nombreNegocio || u.data().nombre || "Desconocido";
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

app.post("/pagos", async (req, res) => {
  try {
const { 
usuarioId,
vendedorId,
producto,
monto,
metodo,
  pedidoId,
anticipo,
  tipoEntrega,
  provincia,
  ciudad,
  direccion,
  referencia,
  cooperativa,
  ciudadDestino
} = req.body;
    if (!usuarioId || !producto || !monto) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }
    const nuevoDoc = await db.collection("pagos").add({
      
      usuarioId,
      vendedorId: vendedorId || ""
      ,pedidoId,
      producto,
      monto: Number(monto),
      metodo: metodo || "Efectivo",

anticipo: anticipo || 0,

saldoPendiente: Number(monto) - Number(anticipo || 0),
      tipoEntrega: tipoEntrega || "",
      provincia: provincia || "",
      ciudad: ciudad || "",
      direccion: direccion || "",
      referencia: referencia || "",
      cooperativa: cooperativa || "",
      ciudadDestino: ciudadDestino || "",
      comprobante: "sin_comprobante.jpg",
      estado: "pendiente",
      fecha: FieldValue.serverTimestamp(),
    });
    await registrarAuditoria(usuarioId, `Realizo una compra: ${producto} - $${monto}`, "pago");
    if (vendedorId) {
      await crearNotificacion(vendedorId, `Nuevo pedido: ${producto} - $${monto}`, "pedido");
    }
    res.json({ message: "Pedido registrado correctamente", id: nuevoDoc.id });
  } catch (error) {
    console.error("Error en POST /pagos:", error);
    res.status(500).json({ message: "Error al crear pago" });
  }
});
app.put("/pagos/:id/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["pendiente", "aprobado", "rechazado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado invalido" });
    }
    const docSnap = await db.collection("pagos").doc(req.params.id).get();
    const pago = docSnap.data();
    await db.collection("pagos").doc(req.params.id).update({ estado });
    const acciones = {
      aprobado: "Aprobo",
      rechazado: "Rechazo",
      pendiente: "Revirtio a pendiente",
    };
    await registrarAuditoria(
      pago?.usuarioId || "admin",
      `${acciones[estado]} el pago de ${pago?.producto} - $${pago?.monto}`,
      "pago"
    );
    if (estado === "aprobado" || estado === "rechazado") {
      const textoCliente = estado === "aprobado"
        ? `Tu pago de ${pago?.producto} fue aprobado`
        : `Tu pago de ${pago?.producto} fue rechazado`;
      await crearNotificacion(pago?.usuarioId, textoCliente, "pago");
    }
    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error en PUT /pagos/:id/estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});
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
    res.json({ message: "Notificacion marcada como leida" });
  } catch (error) {
    console.error("Error en PUT /notificaciones/:id/leida:", error);
    res.status(500).json({ message: "Error al actualizar notificacion" });
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
app.post("/recuperar-contrasena", async(req,res)=>{

const {correo,nuevaPassword}=req.body;


try{


const usuariosRef = db.collection("usuarios");


const usuario = await usuariosRef
.where("correo","==",correo)
.get();



if(usuario.empty){

return res.status(404).json({
message:"El correo no está registrado"
});

}




const doc = usuario.docs[0];


const nuevaClaveHash = bcrypt.hashSync(nuevaPassword,10);

await doc.ref.update({
  password:nuevaClaveHash
});


res.json({

message:"Contraseña actualizada correctamente"

});


}catch(error){

console.log(error);

res.status(500).json({

message:"Error al actualizar contraseña"

});


}


});

// ======================
// SUBIR IMAGEN (ImageKit)
// ======================
app.post("/imagenes", upload.single("imagen"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ninguna imagen" });
    }

    // Subir la imagen usando ImageKit (ya tienes importado imagekit arriba)
    imagekit.upload({
      file: req.file.buffer, 
      fileName: `producto_${Date.now()}_${req.file.originalname}`,
      folder: "/productos"
    }, (error, result) => {
      if (error) {
        console.error("Error al subir a ImageKit:", error);
        return res.status(500).json({ message: "Error al subir la imagen" });
      }
      // Devolvemos la URL pública que generó ImageKit
      res.json({ url: result.url });
    });

  } catch (error) {
    console.error("Error en POST /imagenes:", error);
    res.status(500).json({ message: "Error al procesar la imagen" });
  }
});

app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001 (conectado a Firestore)");
});

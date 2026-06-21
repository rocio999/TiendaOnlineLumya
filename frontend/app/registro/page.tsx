
import "../../styles/registro.css";

export default function Registro() {
  return (
    <div className="container">
      
      {/* LADO IZQUIERDO */}
      <div className="left">
        <img src="/imagenuno.png" />
      </div>

      
      <div className="right">

         <div className="top">
            <h1>CREAR UNA CUENTA</h1>
            <img src="/registrolumia.jpeg" className="img-below" />
            <p>Regístrate para continuar</p>
  
        </div>

        <form>
          <input type="text" placeholder="Nombre" />
          <input type="text" placeholder="Apellido" />
          <input type="email" placeholder="Correo" />
          <input type="password" placeholder="Contraseña" />
          <input type="password" placeholder="Confirmar Contraseña" />

          <div className="roles">
            <p>Tipo de cuenta:</p>

            <label>
              <input type="radio" name="role" /> Cliente
            </label>

            <label>
              <input type="radio" name="role" /> Vendedor
            </label>
          </div>

          <button type="submit">CREAR CUENTA</button>
        </form>
      </div>

      
    </div>
  );
}

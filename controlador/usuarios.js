import ServicioUsuario from "../servicio/usuarios.js"
import Autentificador from './autentificador.js'
import Correo from './correo.js';
import validaciones from '../validaciones/usuariosValidaciones.js'
import config from "../config.js";

const tiempoToken = config.TIEMPO_TOKEN


class ControladorUsuario {

  constructor() {
    this.servicio = new ServicioUsuario()
    this.autentificador = new Autentificador()
    this.correo = new Correo()
  }


  registro = async (req, res) => {
    try {
      const usuario = req.body
      const validado = validaciones.validar(usuario)
      if (validado.result) {
        const usuarioRegistrado = await this.servicio.registro(usuario);
        const token = this.autentificador.generarTokenUnico(usuarioRegistrado._id);
        await this.correo.enviarCorreoConfirmacion(usuarioRegistrado.email, token);
        res.status(200).json({ message: "Usuario registrado correctamente, espera de confirmacion por email" });
      }
      else {
        throw validado.error;
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  confirmar = async (req, res) => {
    try {
      const token = req.query.token;
      const decodedToken = await this.autentificador.autentificarToken(token);
      await this.servicio.confirmarRegistro(decodedToken.userId);
      res.status(200).send('<div style="background-color: #f3f3f3; padding: 20px; text-align: center;"><h1 style="color: #333;">¡Registro confirmado!</h1></div>');
    } catch (error) {
      console.log(error);
     res.status(200).send('<div style="background-color: #f3f3f3; padding: 20px; text-align: center;"><h1 style="color: #333;">¡Su registro ya se confirmo!</h1></div>');
    }
  };


  validarUsuario = async (req, res) => {
    try {
      const token = req.body.token
      const decodedToken = await this.autentificador.autentificarToken(token);
      const usuario = await this.servicio.devolverUsuarioPorId(decodedToken.userId)
      const tokenNuevo = this.autentificador.generateTokenTiempo(usuario._id, tiempoToken);
      usuario.token = tokenNuevo;
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  enviarCorreoNuevaPass = async (req, res) => {
    try {
      const email = req.body.email;
      const usuario = await this.servicio.esValido(email);
      const token = this.autentificador.generarTokenUnico(usuario._id);
      await this.correo.enviarCorreoCambioPass(email, token);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  cambiarContrasenia = async (req, res) => {
    try {
      const { newPassword, token } = req.body;
      const decodedToken = await this.autentificador.autentificarToken(token); 
      await this.servicio.cambiarContrasenia(decodedToken.userId, newPassword);
      res.status(200).json('Contraseña cambiada exitosamente');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  login = async (req, res) => {
    try {
      const { email, pass } = req.body
      const usuario = await this.servicio.login(email, pass);
      const token = this.autentificador.generateTokenTiempo(usuario._id, tiempoToken);
      usuario.token = token;
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  editarUsuario = async (req, res) => {
    try {
      const usuario = req.body
      const validado = validaciones.validar(usuario)
      if (validado.result) {
        const decodedToken = await this.autentificador.autentificarToken(usuario.token); 
        const usuarioActual = await this.servicio.devolverUsuarioPorId(decodedToken.userId)
        usuario._id = usuarioActual._id;
        const usuarioEditado = await this.servicio.editarUsuario(usuario);
        if (usuarioEditado.email != usuarioActual.email) {
          const token = this.autentificador.generarTokenUnico(usuarioEditado._id);
          await this.correo.enviarCorreoConfirmacion(usuarioEditado.email, token);
          this.servicio.desconfirmarCuenta(usuario._id)
        }
        res.status(200).json(usuarioEditado);
      }
      else {
        throw validado.error;
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


  eliminarUsuario = async (req, res) => {
    try {
      const { token,pass } = req.body
      const decodedToken = await this.autentificador.autentificarToken(token); 
      await this.servicio.validarPass(decodedToken.userId, pass);
      await this.servicio.eliminarCuenta(decodedToken.userId);
      res.status(200).json({ message: "Cuenta eliminada  con exito" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };





  eliminarCuentaPorAdministrador = async (req, res) => {
    try {
      const {token,id } = req.body
      await this.autentificador.autentificarToken(token); 
      await this.servicio.eliminarCuenta(id);
      res.status(200).json("Cuenta eliminada  con exito");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  obtenerUsuarios = async (req, res) => {
    try {
      const usuarios = await this.servicio.obtenerUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  editarAdministrador = async (req, res) => {
    try {
      const {token,usuario } = req.body
      await this.autentificador.autentificarToken(token); 
      await this.servicio.editarUsuario(usuario);
     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
   


  }


};


export default ControladorUsuario
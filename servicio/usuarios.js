import UsuarioFactory from "../model/DAO/usuariosFactory.js"
import bcrypt from 'bcrypt';
import config from "../config.js";
import CalculadorEdad from "../servicio/calculadorEdad.js"


class ServicioUsuario {

  constructor() {
    this.model = UsuarioFactory.get(config.MODO_PERSISTENCIA)
  }

  registro = async (usuario) => {
    try {
      const { pass, fechaNacimiento } = usuario
      let edad = CalculadorEdad.calcularEdad(fechaNacimiento)
      if (edad < 18) {
        throw new Error("Edad no valida para registrarse");
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);
      usuario.pass = hash
      const usuarioRegistrado = await this.model.registro(usuario);
      return usuarioRegistrado;
    } catch (error) {
      throw new Error(error);
    }
  };


  confirmarRegistro = async (id) => {
    try {
      await this.model.confirmarRegistro(id)
    } catch (error) {
      throw new Error("Error al confirmar el registro");
    }
  }




  esValido = async (email) => {
    try {
      const usuario = await this.model.login(email);
      return usuario
    } catch (error) {
      throw new Error(error);
    }

  }


  cambiarContrasenia = async (id, nuevaPass) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(nuevaPass, salt);
      await this.model.cambiarContrasenia(id, hash);
    } catch (error) {
      throw new Error(error);
    }
  };


  login = async (email, pass) => {
    try {
      const usuario = await this.model.login(email);
      const match = await bcrypt.compare(pass, usuario.pass);
      if (match) {
        if (usuario.registro == 0) {
          throw new Error("Cuenta no confirmada, revise el email de confirmacion");
        } else {
          return usuario;
        }
      } else {
        throw new Error("Contraseña incorrecta");
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  editarUsuario = async (usuario) => {
    try {
      let edad = CalculadorEdad.calcularEdad(usuario.fechaNacimiento)
      if (edad < 18) {
        throw new Error("Edad no valida para registrarse");
      }
      const usuarioEditado = await this.model.editarUsuario(usuario)
      return usuarioEditado;
    } catch (error) {
      throw new Error(error);
    }
  };


  desconfirmarCuenta = async (id) => {
    try {
      await this.model.desconfirmarCuenta(id);
    } catch (error) {
      throw new Error(error);
    }
  }


  eliminarCuenta = async (id) => {
    try {
      const usuario = await this.model.eliminarCuenta(id);
      return usuario;
    } catch (error) {
      throw new Error(error);
    }
  };


  validarPass = async (id, pass) => {
    const usuario = await this.devolverUsuarioPorId(id);
    const match = await bcrypt.compare(pass, usuario.pass);

    if (match) {
      return "Contraseña valida";
    } else {
      throw new Error("Contraseña invalida");
    }
  }


  devolverUsuarioPorId = async (id) => {
    try {
      const usuario = await this.model.devolverUsuarioPorId(id);
      return usuario;
    } catch (error) {
      throw new Error(error);
    }
  }

  obtenerUsuarios = async () => {
    try {
      const usuarios = await this.model.obtenerUsuarios();
      return usuarios;
    } catch (error) {
      throw new Error(error);
    }
  };


}

export default ServicioUsuario
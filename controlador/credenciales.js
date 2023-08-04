import ServicioCredencial from "../servicio/credenciales.js"
import Autentificador from './autentificador.js'
import Validaciones from '../validaciones/credencialesValidaciones.js'


class ControladorCredencial {

  constructor() {
    this.servicio = new ServicioCredencial()
    this.autentificador = new Autentificador()
  }

  
  ingresarCredencial = async (req, res) => {
    try {
      const {token,credencial} = req.body
      const validado = Validaciones.validar(credencial)
      if (validado.result) {
        const decodedToken = await this.autentificador.autentificarToken(token);
        credencial.idUsuario = decodedToken.userId;
        this.servicio.ingresarCredencial(credencial)
        res.status(200).json({ message: "Credencial guardada correctamente" });
      }
      else {
        throw validado.error;
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  obtenerCredenciales = async (req, res) => {
    try {
      const {token} = req.body
      const decodedToken = await this.autentificador.autentificarToken(token);
      const credenciales = await this.servicio.obtenerCredenciales(decodedToken.userId);
      res.status(200).json(credenciales);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  eliminarCredencial = async (req, res) => {
    try {
      const { token,credencialId } = req.body
      await this.autentificador.autentificarToken(token); 
      await this.servicio.eliminarCredencial(credencialId);
      res.status(200).json({ message: "Credencial eliminada  con exito" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  obtenerCredencialPorId = async (req, res) => {
    try {
      const {token,id} = req.body
      await this.autentificador.autentificarToken(token);
      const credencial = await this.servicio.obtenerCredencialPorId(id);
      res.status(200).json(credencial);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  editarCredencial = async (req, res) => {
    try {
      const {token,credencial} = req.body
      await this.autentificador.autentificarToken(token);
      await this.servicio.editarCredencial(credencial);

      res.status(200).json();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

};


export default ControladorCredencial
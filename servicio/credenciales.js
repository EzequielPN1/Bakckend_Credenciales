import CredencialFactory from "../model/DAO/credencialesFactory.js"
import config from "../config.js";
import Cifrador from "./cifrador.js"


class ServicioCredencial {
  constructor() {
    this.model = CredencialFactory.get(config.MODO_PERSISTENCIA)
    this.cifrador = new Cifrador();
  }

  ingresarCredencial = async (credencial) => {
    try {
      const nomAcceso = credencial.nomAcceso;
      const nomAccesoCifrado = this.cifrador.EncryptBase64AES(nomAcceso);
      credencial.nomAcceso = nomAccesoCifrado;
      const pass = credencial.pass;
      const passCifrada = this.cifrador.EncryptBase64AES(pass);
      credencial.pass = passCifrada;
      await this.model.ingresarCredencial(credencial);
    } catch (error) {
      throw new Error(error);
    }
  };

  obtenerCredenciales = async (idUsuario) => {
    try {
      const credenciales = await this.model.obtenerCredenciales(idUsuario);

      credenciales.forEach((credencial) => {
        const nomAccesoCifrado = credencial.nomAcceso;
        const nomAccesoDescifrado = this.cifrador.DecryptBase64AES(nomAccesoCifrado.ciphertext, nomAccesoCifrado.tag);
        credencial.nomAcceso = nomAccesoDescifrado;
      });
   
      credenciales.forEach((credencial) => {
        const passCifrada = credencial.pass;
        const passDescifrada = this.cifrador.DecryptBase64AES(passCifrada.ciphertext, passCifrada.tag);
        credencial.pass = passDescifrada;
      });

      return credenciales;
    } catch (error) {
      throw new Error(error);
    }
  };


  eliminarCredencial = async (credencialId) => {
    try {
      await this.model.eliminarCredencial(credencialId);
    } catch (error) {
      throw new Error(error);
    }
  };

  obtenerCredencialPorId = async (idCredencial) => {
    try {
      const credencial = await this.model.obtenerCredencialPorId(idCredencial);
      const nomAccesoCifrado = credencial.nomAcceso;
      const nomAccesoDescifrado = this.cifrador.DecryptBase64AES(nomAccesoCifrado.ciphertext, nomAccesoCifrado.tag);
      credencial.nomAcceso = nomAccesoDescifrado;
      const passCifrada = credencial.pass;
      const passDescifrada = this.cifrador.DecryptBase64AES(passCifrada.ciphertext, passCifrada.tag);
      credencial.pass = passDescifrada;
      return credencial;
    } catch (error) {
      throw new Error(error);
    }
  };


  editarCredencial = async (credencial) => {
    try {
      const nomAcceso = credencial.nomAcceso;
      const nomAccesoCifrado = this.cifrador.EncryptBase64AES(nomAcceso);
      credencial.nomAcceso = nomAccesoCifrado;
      const pass = credencial.pass;
      const passCifrada = this.cifrador.EncryptBase64AES(pass);
      credencial.pass = passCifrada;

      await this.model.editarCredencial(credencial);
    } catch (error) {
      throw new Error(error);
    }
  };








}

export default ServicioCredencial;

import jwt from 'jsonwebtoken';
import TokenFactory from "../model/DAO/tokensFactory.js";
import config from "../config.js";

class Autentificador {

  constructor() {
    this.secretKey = config.SECRET_KEY_AUTENTIFICADOR;
    this.model = TokenFactory.get(config.MODO_PERSISTENCIA)
  }

  generateTokenTiempo = (id, tiempoExpiracion) => {
    const token = jwt.sign({ userId: id }, this.secretKey, { expiresIn: tiempoExpiracion });
    return token;
  };

  generarTokenUnico = (id) => {
    const token = jwt.sign({ userId: id }, this.secretKey);
    this.model.guardarTokenUnico(token);
    return token;
  };


  autentificarToken = async (token) => {
    try {
      const tokeUnico = await this.model.existeTokenEnColeccion(token);
      if (tokeUnico) {
        const isActivated = await this.model.chequearTokenActivado(token);
        if (!isActivated) {
          throw new Error('Token ya autentificado');
        } else {
          await this.model.desactivarToken(token);
        }
      }
      const decodedToken = jwt.verify(token, this.secretKey);
      return decodedToken;
    } catch (error) {
      throw new Error('Error al autentificar el token: ' + error.message);
    }
  };





}

export default Autentificador
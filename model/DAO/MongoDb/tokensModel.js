import ConexionMongo from './conexionMongoDb.js';

class UsuarioMongoDb {
  constructor() {
    this.tokensCollection = null;
    this.init();
  }

  async init() {
    try {
      this.tokensCollection = ConexionMongo.tokensColeccion();
    } catch (error) {
      console.error(error);
    }
  }

  async guardarTokenUnico(token) {
    try {
      const tokenUnico = {
        token,
        activado: true,
      };
      await this.tokensCollection.insertOne(tokenUnico);
    } catch (error) {
      throw new Error('Error al guardar el token en la base de datos: ' + error.message);
    }
  }

  async chequearTokenActivado(token) {
    try {
      const tokenObj = await this.tokensCollection.findOne({ token });

      if (!tokenObj) {
        throw new Error('Token no encontrado');
      }

      return tokenObj.activado;
    } catch (error) {
      throw new Error('Error al chequear el estado del token: ' + error.message);
    }
  }

  async desactivarToken(token) {
    try {
      const tokenObj = await this.tokensCollection.findOne({ token });

      if (!tokenObj) {
        throw new Error('Token no encontrado');
      }

      await this.tokensCollection.updateOne({ _id: tokenObj._id }, { $set: { activado: false } });
    } catch (error) {
      throw new Error('Error al desactivar el token: ' + error.message);
    }
  };

  async existeTokenEnColeccion(token) {
    try {
      const tokenObj = await this.tokensCollection.findOne({ token });

      return !!tokenObj;
    } catch (error) {
      throw new Error('Error al verificar el token en la colección: ' + error.message);
    }
  }
}

export default UsuarioMongoDb;

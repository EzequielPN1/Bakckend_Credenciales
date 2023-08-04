import mongoose from 'mongoose';
import config from '../../../config.js'

class ConexionMongo {
  static uri = config.STRING_DE_CONECCION_MONGODB;
  static dbName = config.NOMBRE_BASE_DATOS;
  static isConnected = false;

  static conectar = async () => {
    try {
      console.log('Conectando a la base de datos...');
      await mongoose.connect(ConexionMongo.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: ConexionMongo.dbName
      });
      ConexionMongo.isConnected = true;
      console.log('Conexión exitosa a MongoDB');
    } catch (error) {
      console.error('Error al conectarse a MongoDB:', error);
    }
  };

  static desconectar = async () => {
    try {
      if (ConexionMongo.isConnected) {
        await mongoose.disconnect();
        ConexionMongo.isConnected = false;
        console.log('Desconexión exitosa de la base de datos');
      } else {
        console.warn('No hay una conexión activa');
      }
    } catch (error) {
      console.error('Error al desconectarse de MongoDB:', error);
    }
  };

  static usuariosColeccion = () => {
    return mongoose.connection.collection('usuarios');
  };

  static credencialesColeccion = () => {
    return mongoose.connection.collection('credenciales');
  };

  static tokensColeccion = () => {
    return mongoose.connection.collection('tokensUnicos');
  };
}

export default ConexionMongo;
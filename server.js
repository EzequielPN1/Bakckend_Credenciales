import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import RouterUsuario from './router/usuarios.js';
import RouterCredencial from './router/credenciales.js';
import ConexionMongoDb from './model/DAO/MongoDb/conexionMongoDb.js'

class Server {

  constructor(port, persistencia) {
    this.app = express();
    this.port = port;
    this.persistencia = persistencia;
  }

  async start() {

    this.app.use(bodyParser.json());
    this.app.use(cors());

    
    if (this.persistencia === 'FILE') {
      console.log('**** Persistiendo en File System ****')
    }

    if (this.persistencia === 'mongoDb') {
      await ConexionMongoDb.conectar();
      console.log('**** Persistiendo en MongoDb ****')
    }

    this.app.use('/usuarios',new RouterUsuario().start())
    this.app.use('/credenciales',new RouterCredencial().start())
    

    const PORT = this.port
    this.server = this.app.listen(PORT,
      () => console.log(`Servidor http express escuchando en http://localhost:${PORT}`)
    )
    this.server.on('error', error => console.log(`Error en servidor: ${error.message}`))

    return this.app
  }


  async stop() {
    this.server.close()
    if (this.persistencia === 'mongoDb') {
      await ConexionMongoDb.desconectar();
    }
  }



}

export default Server
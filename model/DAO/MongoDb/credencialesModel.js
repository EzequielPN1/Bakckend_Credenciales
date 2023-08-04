import ConexionMongo from './conexionMongoDb.js';
import { ObjectId } from 'mongodb';

class UsuarioMongoDb {
    constructor() {
        this.credencialesCollection = null;
        this.init();
    }

    async init() {
        try {
            this.credencialesCollection = ConexionMongo.credencialesColeccion()
        } catch (error) {
            console.error(error);
        }
    }

    async ingresarCredencial(credencial) {
        const { idUsuario, nombreApp, nomAcceso, pass } = credencial;
        try {
            const nuevaCredencial = {
                idUsuario,
                nombreApp,
                nomAcceso,
                pass,
            };
            await this.credencialesCollection.insertOne(nuevaCredencial);
        } catch (error) {
            throw new Error('Error al guardar la credencial en la base de datos: ' + error.message);
        }
    }


    async obtenerCredenciales(idUsuario) {
        try {
            const credencialesFiltradas = await this.credencialesCollection.find({ idUsuario }).toArray();
            return credencialesFiltradas;
        } catch (error) {
            throw new Error("Error al obtener las credenciales de la base de datos.");
        }
    }


    async eliminarCredencial(credencialId) {
        try {
            console.log(credencialId);
            const result = await this.credencialesCollection.deleteOne({  _id: new ObjectId(credencialId) });

            if (result.deletedCount === 0) {
                throw new Error("Credencial no encontrada.");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async obtenerCredencialPorId(credencialId) {
        try {
            const credencialEncontrada = await this.credencialesCollection.findOne({
                _id: new ObjectId(credencialId), 
            });
    
            if (!credencialEncontrada) {
                throw new Error(`No se encontró la credencial con el ID ${credencialId}`);
            }
    
            return credencialEncontrada;
        } catch (error) {
            throw new Error('Error al obtener la credencial: ' + error.message);
        }
    }

    async editarCredencial(credencial) {

        const { _id, nombreApp, nomAcceso, pass } = credencial;

        try {
            const result = await this.credencialesCollection.updateOne(
                {  _id: new ObjectId(_id) },
                {
                    $set: {
                        nombreApp,
                        nomAcceso,
                        pass,
                    },
                }
            );
    
            if (result.matchedCount === 0) {
                throw new Error(`No se encontró la credencial con el ID ${_id}`);
            }
    
            // Obtener la credencial actualizada
            const credencialActualizada = await this.credencialesCollection.findOne({ _id: new ObjectId(_id) });
    
            return credencialActualizada;
        } catch (error) {
            throw new Error(error.message);
        }
    };
      

}


export default UsuarioMongoDb;

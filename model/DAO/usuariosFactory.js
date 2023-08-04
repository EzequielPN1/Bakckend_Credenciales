import UsuarioMongodb from "./MongoDb/usuariosModel.js"

class UsuariosFactory {
    static get(tipo) {

        switch (tipo) {

            case 'mongoDb':
                return new UsuarioMongodb()

            default:
                return new UsuarioMongodb()
        }
    }
}

export default UsuariosFactory
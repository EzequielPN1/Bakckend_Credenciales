import CredencialMongodb from "./MongoDb/credencialesModel.js"

class CredencialFactory {
    static get(tipo) {

        switch (tipo) {

            case 'mongoDb':
                return new CredencialMongodb()

            default:
                return new CredencialMongodb()
        }
    }
}

export default CredencialFactory
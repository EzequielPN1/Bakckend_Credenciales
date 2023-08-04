import TokenMongodb from "./MongoDb/tokensModel.js"

class TokensFactory {
    static get(tipo) {

        switch (tipo) {

            case 'mongoDb':
                return new TokenMongodb()

            default:
                return new TokenMongodb()
        }
    }
}

export default TokensFactory
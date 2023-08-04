import dotenv from 'dotenv'
dotenv.config()


const PORT =  process.env.PORT
const MODO_PERSISTENCIA = process.env.MODO_PERSISTENCIA
const STRING_DE_CONECCION_MONGODB = process.env.STRING_DE_CONECCION_MONGODB
const SECRET_KEY_AUTENTIFICADOR = process.env.SECRET_KEY_AUTENTIFICADOR 
const TIEMPO_TOKEN = process.env.TIEMPO_TOKEN
const NOMBRE_BASE_DATOS = process.env.NOMBRE_BASE_DATOS
const CIFRADOR_KEY = process.env.CIFRADOR_KEY

export default {
    PORT,
    MODO_PERSISTENCIA,
    STRING_DE_CONECCION_MONGODB,
    SECRET_KEY_AUTENTIFICADOR,
    TIEMPO_TOKEN,
    NOMBRE_BASE_DATOS,
    CIFRADOR_KEY
}
import express from "express";
import ControladorUsuario from '../controlador/usuarios.js'

class RouterUsuario {

    constructor() {
        this.router = express.Router()
        this.controlador = new ControladorUsuario()
    }

    start() {
        
        this.router.get("/confirmar", this.controlador.confirmar)
        this.router.get("/obtenerUsuarios",this.controlador.obtenerUsuarios)
        this.router.post("/register", this.controlador.registro)
        this.router.post("/login", this.controlador.login)
        this.router.post("/validarUsuario",this.controlador.validarUsuario)
        this.router.post("/editarUsuario", this.controlador.editarUsuario)
        this.router.post("/enviarCorreoNuevaPass", this.controlador.enviarCorreoNuevaPass)
        this.router.post("/cambiarContrasenia", this.controlador.cambiarContrasenia)
        this.router.post("/editarAdministrador",this.controlador.editarAdministrador)
        this.router.delete("/eliminarCuentaPorAdministrador",this.controlador.eliminarCuentaPorAdministrador)
        this.router.delete("/eliminarUsuario",this.controlador.eliminarUsuario)
       

        return this.router
    }

}

export default RouterUsuario
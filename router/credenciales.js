import express from "express";
import ControladorCredencial from '../controlador/credenciales.js'

class RouterCredencial {

    constructor() {
        this.router = express.Router()
        this.controlador = new ControladorCredencial()
    }

    start() {
        
        this.router.post("/ingresarCredencial",this.controlador.ingresarCredencial)
        this.router.post("/obtenerCredenciales",this.controlador.obtenerCredenciales)
        this.router.delete("/eliminarCredencial",this.controlador.eliminarCredencial)
        this.router.post("/obtenerCredencialPorId",this.controlador.obtenerCredencialPorId)
        this.router.post("/editarCredencial",this.controlador.editarCredencial)
        
        return this.router
    }

}

export default RouterCredencial
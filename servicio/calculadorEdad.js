
class CalculadorEdad {
  

    static calcularEdad(fechaNacimiento) {
        const fechaActual = new Date();
        const fechaNac = new Date(fechaNacimiento);
        const diferenciaMilisegundos = fechaActual - fechaNac;
        const edad = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 365.25));
        return edad;
      }
    

}

export default CalculadorEdad
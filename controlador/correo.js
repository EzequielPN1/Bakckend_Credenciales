import nodemailer from 'nodemailer';


class Mailer {

  constructor() {

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ventaDeTicketsPN1@gmail.com',
        pass: 'sjklkmqbxdnrclqy',
      },
    });
  }



  async enviarCorreoConfirmacion(email, token) {
    const mensaje = {
      from: 'ventaDeTicketsPN1@gmail.com',
      to: email,
      subject: 'Confirmación de registro',
      html: `
      <p>¡Gracias por registrarte!</p>
      <p>Para confirmar tu correo electrónico, haz clic en el siguiente enlace:</p>
      <a href="http://localhost:3001/usuarios/confirmar?token=${encodeURIComponent(token)}">Confirmar registro</a>
    `,
    };

    try {
      const info = await this.transporter.sendMail(mensaje);
      // console.log('Correo electrónico enviado:', info.response);
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
    }
  }


  async enviarCorreoCambioPass(email, token) {
    const mensaje = {
      from: 'ventaDeTicketsPN1@gmail.com',
      to: email,
      subject: 'Cambio de Pass',
      html: `
      <p>Para cambiar tu contraseña, haz clic en el siguiente enlace:</p>
      <a href="http://localhost:5173/cambioDePass?token=${encodeURIComponent(token)}">Cambiar contraseña</a>
    `,
    };

    try {
      const info = await this.transporter.sendMail(mensaje);
      //console.log('Correo electrónico enviado:', info.response);
    } catch (error) {
      console.log('Error al enviar el correo electrónico:', error);
    }
  }
}

export default Mailer
import Joi from "joi";

const credencialSchema = Joi.object({
  nombreApp:Joi.string().required(),
  nomAcceso: Joi.string().required(),
  pass: Joi.string().required(),
  idUsuario:Joi.number().optional(),
  id:Joi.number().optional(),
});

const validar = credencial => {
  const { error } = credencialSchema.validate(credencial);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
}



export default {
  validar,

};
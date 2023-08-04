import Joi from "joi";

const usuarioSchema = Joi.object({
  id:Joi.number().optional(),
  nombre: Joi.string().required(),
  email: Joi.string().email().required(),
  pass: Joi.string().optional(),
  fechaNacimiento:  Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  registro:Joi.boolean().allow(),
  isAdmin:Joi.boolean().allow(),
  token: Joi.string().allow(''),
});

const validar = usuario => {
  const { error } = usuarioSchema.validate(usuario);
  if (error) {
    return { result: false, error };
  }
  return { result: true };
}



export default {
  validar,

};

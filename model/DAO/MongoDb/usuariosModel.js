import ConexionMongo from './conexionMongoDb.js';
import { ObjectId } from 'mongodb';

class UsuarioMongoDb {
    constructor() {
        this.usuariosCollection = null;
        this.init();
    }

    async init() {
        try {
            this.usuariosCollection = ConexionMongo.usuariosColeccion()
        } catch (error) {
            console.error(error);
        }
    }


    async registro(usuario) {
        const { nombre, email, fechaNacimiento, pass } = usuario;

        try {
            const existeUsuario = await this.usuariosCollection.findOne({ email });

            if (existeUsuario) {
                throw new Error(`El correo ${email} ya fue ingresado`);
            }

            const newUsuario = {
                nombre,
                email,
                pass,
                fechaNacimiento,
                registro: false,
                isAdmin: false,
            };

            const { insertedId } = await this.usuariosCollection.insertOne(newUsuario);

            return { ...newUsuario, _id: insertedId };
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async confirmarRegistro(id) {
        try {
            const usuario = await this.usuariosCollection.findOne({ _id: new ObjectId(id) });
    
            if (!usuario) {
                throw new Error(`El usuario con el ID ${id} no está registrado, no se puede confirmar el registro`);
            }
    
            usuario.registro = true;
            await this.usuariosCollection.updateOne({ _id: new ObjectId(id) }, { $set: { registro: true } });
    
        } catch (error) {
            console.log(error);
            throw new Error('Error al confirmar el registro: ' + error.message);
        }
    }


    async desconfirmarCuenta(id) {
        try {
            const usuario = await this.usuariosCollection.findOne({ _id: new ObjectId(id) });
    
            if (!usuario) {
                throw new Error(`El usuario con el ID ${id} no está registrado, no se puede desconfirmar la cuenta`);
            }
    
            usuario.registro = false;
            await this.usuariosCollection.updateOne({ _id: new ObjectId(id) }, { $set: { registro: false } });
    
        } catch (error) {
            throw new Error('Error al desconfirmar la cuenta: ' + error.message);
        }
    }

    async cambiarContrasenia(id, nuevaPass) {
        try {
            const usuarioEncontrado = await this.usuariosCollection.findOne({ _id: new ObjectId(id) });
    
            if (!usuarioEncontrado) {
                throw new Error(`El usuario con el ID ${id} no está registrado, no se puede cambiar la contraseña`);
            }
    
            await this.usuariosCollection.updateOne({ _id: new ObjectId(id) }, { $set: { pass: nuevaPass } });
    
        } catch (error) {
            throw new Error('Error al cambiar la contraseña: ' + error.message);
        }
    }

    async login(email) {
        try {
            const usuarioEncontrado = await this.usuariosCollection.findOne({ email });

            if (!usuarioEncontrado) {
                throw new Error(`El correo ${email} no está registrado`);
            }

            return usuarioEncontrado;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async devolverUsuarioPorId(id) {
        try {
            const usuarioEncontrado = await this.usuariosCollection.findOne({ _id: new ObjectId(id) });
    
            if (!usuarioEncontrado) {
                throw new Error(`El usuario con el ID ${id} no está registrado`);
            }
    
            return usuarioEncontrado;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async eliminarCuenta(id) {
        try {
            const usuarioEliminado = await this.usuariosCollection.findOneAndDelete({ _id: new ObjectId(id) });
    
            if (!usuarioEliminado.value) {
                throw new Error(`El usuario con el ID ${id} no está registrado, no se puede eliminar la cuenta`);
            }
    
            return usuarioEliminado.value;
        } catch (error) {
            throw new Error(error.message);
        }
    }


    async editarUsuario(usuario) {
        const { _id, nombre, email, fechaNacimiento, isAdmin } = usuario;
    
        try {
            const usuarioEncontrado = await this.usuariosCollection.findOne({ _id: new ObjectId(_id) });
    
            if (!usuarioEncontrado) {
                throw new Error(`El usuario con el ID ${_id} no está registrado`);
            }
    
            // Si el correo electrónico se está actualizando, verificamos que no esté duplicado.
            if (usuarioEncontrado.email !== email) {
                const existeUsuario = await this.usuariosCollection.findOne({ email });
                if (existeUsuario) {
                    throw new Error(`El correo ${email} ya fue ingresado`);
                }
            }
    
            await this.usuariosCollection.updateOne(
                { _id: new ObjectId(_id) },
                {
                    $set: {
                        nombre,
                        email,
                        fechaNacimiento,
                        isAdmin,
                    },
                }
            );
    
            // Obtener el usuario actualizado
            const usuarioActualizado = await this.usuariosCollection.findOne({ _id: new ObjectId(_id) });
    
            return usuarioActualizado;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    

    async obtenerUsuarios() {
        try {
            const usuarios = await this.usuariosCollection.find({}).toArray();
            return usuarios;
        } catch (error) {
            throw new Error("Error al obtener los usuarios de la base de datos.");
        }
    };



}


export default UsuarioMongoDb;

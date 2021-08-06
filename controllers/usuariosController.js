//  Requires
const bcrypt = require('bcrypt');
const Usuarios = require('../models/Usuarios');

//  Crear Usuario
exports.crearUsuario = async(req,res) => {
    try {
        //console.log(req.body)
        const { nombre, apellido, usuario, clave } = req.body;

        if(!nombre ||!apellido ||!usuario ||!clave ) return res.status(404).json({Error:'Campos: Nombre, Apellido, Usuario y Clave son requeridos.'}); 

        let result = await Usuarios.findOne({
            where:{
                    nombre,
                    apellido 
                }
        });
        //console.log('result-1: ', result)
        if(result) return res.status(404).json({Error:'El Nombre y Apellido ingresados ya se encuentran registrados.'}); 

        result = await Usuarios.findOne({
            where:{
                    usuario
            }
        });
        //console.log('result-2: ', result)
        if(result) return res.status(404).json({Error:'El Nombre de Usuario ya se encuentra registrado.'}); 

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(clave, saltRounds);
        
        const nuevoUsuario = await Usuarios.create({
            nombre,
            apellido,
            usuario,
            clave:passwordHash
        });

        return res.status(200).json({
            nuevoUsuario
        });
    } catch (error) {
        return res.status(404).json(error);    
    }
}
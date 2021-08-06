//  Requires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');

//  Login de Usuario
exports.loginTokenUsuario = async(req,res) => {
    try{
        const { usuario, clave } = req.body;

        if(!usuario || !clave) return res.status(404).json({ Error: 'El Nombre de Usuario y Password son requeridos.'});

        const result = await Usuarios.findOne({
            where: {
                usuario
            }            
        });        
        if(result.length !== 0){
            //console.log(clave,'  -  ' ,result.clave, '  -  ', await bcrypt.hash(clave, 10))
            const claveCorrecta = await bcrypt.compare(clave, result.clave);
            //console.log(claveCorrecta)
            if(!(result && claveCorrecta)){
                return res.status(401).json({ Error: 'Usuario o Password Incorrectos.' });
            } else {
                const usuarioToken = {
                    usuario,
                    id: result.id
                } 
                console.log(usuarioToken);               
                const token = jwt.sign(usuarioToken, process.env.SECRET);                                  
                console.log(token)
                return res.status(200).json({
                    token, usuario
                });
            }       
        } else {            
            return res.status(404).json({ Error: 'No existe el usuario solicitado.' });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}

//  Obtener el token del encabezado
exports.getToken = req => {
    const authorization = req.get('Authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        return authorization.substring(7);
    }
    return null;
}

//  Validacion del token
exports.validaToken=async(token)=>{
    const decodedToken = jwt.verify(token, process.env.SECRET) || null;
    
    if(!token || !decodedToken.id){
        return false;
    }
    
    return true;
};

exports.decodificaSecreto=(token)=> jwt.verify(token, process.env.SECRET) || null;
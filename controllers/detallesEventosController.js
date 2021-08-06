//  Requires
const DetallesEventos = require('../models/DetallesEventos');

// Listar todos los Detalles de Eventos 
exports.getDetalleEventos = async(req,res,next) => {
    try{
        
        const result = await DetallesEventos.findAll({});
        if(result.length !== 0){             
            return res.status(200).json(result);
        } else {            
            return res.status(404).json({                
                Error: 'No existen detalles en eventos registrados.'
            });        
        }
    }
    catch(error){        
        return res.status(404).json(error);
    }
}

//  Crear Detalles de evento
exports.createDetalleEvento = async(req,res,next) => {
    const { fecha, hora, precio, id_evento } = req.body;
    try{                        
        const result = await DetallesEventos.create({
            fecha,
            hora,
            precio,            
            id_evento
        }); 
        if(result != null){
            return res.status(200).json(result.dataValues);
        } else {
            return res.status(404).json({                
                Error: 'No se pudo registrar el detalle.'
            });        
        }
    }
    catch(error){
        return res.status(404).json(error);
    }
}
//  Requieres
const express = require('express');
const router = express.Router();

//  Importamos los controladores
const eventosController = require('../controllers/eventosController');
const detallesEventosController = require('../controllers/detallesEventosController');
const usuariosController = require('../controllers/usuariosController');
const loginController = require('../controllers/loginController');

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

//  Rutas Eventos
router.get('/eventos',eventosController.getEventos);
router.get('/compartirevento',eventosController.compartirEvento);
router.get('/eventos/:id',eventosController.getEventoById);
router.get('/eventosdestacados/',eventosController.getEventosDestacados);
router.post('/eventodetalles',eventosController.crearEvento); //  Requiere Token

//  Rutas Detalles Eventos
router.get('/detalleseventos',detallesEventosController.getDetalleEventos);
router.post('/detalleseventos',detallesEventosController.createDetalleEvento);

//  Rutas Usuarios
router.get('/usuario/eventos/:page?',eventosController.getEventosUsuario);
router.post('/usuario',usuariosController.crearUsuario); 

//  Rutas Login
router.post('/auth',loginController.loginTokenUsuario); 

//  Rutas desconocidas
const endPointDesconocido = (request, response) => {
    response.status(404).send({ Error: 'Unknown Endpoint' })
  }
  
router.use(endPointDesconocido);

module.exports = router;
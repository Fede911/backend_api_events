const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const db = require('../config/db');
const Usuarios = require('../models/Usuarios');
const Eventos = require('../models/Eventos');

let headers;
let idEvento1;
////////////////////////// ----- CREACION DE USUARIOS ----- ////////////////////////////////////////
describe('Creación de Usuarios', () => {  
    test('Crear un usuario "demo"', async () => {   
        await Usuarios.destroy({
            where: {}  
          });  
        const nuevoUsuario = {
            nombre: 'demo',
            apellido: 'demo',
            usuario: 'demo',
            clave: 'demo'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('nuevoUsuario');
    });       
    
    test('Crear usuario con nombre y apellido ya registrados', async () => {     
        const nuevoUsuario = {
            nombre: 'demo',
            apellido: 'demo',
            usuario: 'demo',
            clave: 'demo'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({Error:'El Nombre y Apellido ingresados ya se encuentran registrados.'});
    });  

    test('Crear usuario con un nombre de usuario repetido', async () => {     
        const nuevoUsuario = {
            nombre: 'Juan',
            apellido: 'Perez',
            usuario: 'demo',
            clave: '123'
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({Error:'El Nombre de Usuario ya se encuentra registrado.'});
    });

    test('Crear usuario sin enviar nombre', async () => {     
        const nuevoUsuario = {            
            apellido: 'Perez',
            usuario: 'JP',
            clave: '123',            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Campos: Nombre, Apellido, Usuario y Clave son requeridos.'})
    });        

    test('Crear usuario sin enviar apellido', async () => {     
        const nuevoUsuario = {
            nombre: 'Juan',            
            usuario: 'Juancho',
            clave: '123'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Campos: Nombre, Apellido, Usuario y Clave son requeridos.'})
    });        

    test('Crear usuario sin enviar usuario', async () => {     
        const nuevoUsuario = {
            nombre: 'Mario',
            apellido: 'Lopez',
            clave: '123'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Campos: Nombre, Apellido, Usuario y Clave son requeridos.'})
    });        

    test('Crear usuario sin enviar clave', async () => {     
        const nuevoUsuario = {
            nombre: 'Mario',
            apellido: 'Lopez',
            usuario: 'Marito'            
        };
        const res = await api.post('/usuario').send(nuevoUsuario);
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({Error:'Campos: Nombre, Apellido, Usuario y Clave son requeridos.'})
    });        
});

////////////////////////////// ------ LOGIN ------ ////////////////////////////////////////////
describe('Login de Usuarios', () => {  
    test('Permitir Login a un usuario correcto', async () => {           
        const nuevoUsuario = {            
            usuario: 'demo',
            clave: 'demo'
        };
        const res = await api.post('/auth').send(nuevoUsuario);
        headers = {
            'Authorization': `bearer ${res.body.token}`
        };
        console.log(headers)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    });       

    test('No Permitir Login a un usuario o clave incorrecta', async () => {           
        const nuevoUsuario = {            
            usuario: 'demo',
            clave: 'dmoo'
        };
        const res = await api.post('/auth').send(nuevoUsuario);
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ Error: 'Usuario o Password Incorrectos.' })
    });     

    test('No existe evento cargado', async () => {
        await Eventos.destroy({
            where: {}  
          });  
        const res = await api.get('/eventos')
        expect(res.statusCode).toEqual(404)
        expect(res.body).toEqual({"Error": "No existen eventos registrados."})
    });
        
    test('Usuario logueado puede registrar el evento 1', async () => {
        const nuevoEvento = {
          "titulo":"Primer Evento",
          "descripcion":"Este es el primer evento registrado",
          "destacado":true,
          "imagenUrl":"www.lol.com", 
          "localidad":"Paraná",
          "detalles":[
              {
                  "fecha":"2021-08-12",
                  "hora":"12:00",
                  "precio":1000
              },
              {
                  "fecha":"2021-09-12",
                  "hora":"12:00",
                  "precio":1200
              }
          ]
        };
  
        const result = await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);
        idEvento1 = result.body.id
        
    });

    test('Usuario logueado puede registrar el segundo evento', async () => {
        const nuevoEvento = {
          "titulo":"Segundo evento",
          "descripcion":"Este es mi segundo evento... ",
          "destacado":false,
          "imagenUrl":"www.lol.com", 
          "localidad":"Santa Fe",
          "detalles":[
              {
                  "fecha":"2021-10-01",
                  "hora":"13:00",
                  "precio":2000
              },
              {
                  "fecha":"2021-11-02",
                  "hora":"13:00",
                  "precio":2200
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);
    });

    test('Usuario logueado puede agregar el tercer evento', async () => {
        const nuevoEvento = {
          "titulo":"Tercer evento",
          "descripcion":"Este es mi tercer evento",
          "destacado":false,
          "imagenUrl":"www.lol.com", 
          "localidad":"Cordoba",
          "detalles":[
              {
                  "fecha":"2021-12-03",
                  "hora":"13:00",
                  "precio":3000
              },
              {
                  "fecha":"2021-12-23",
                  "hora":"13:00",
                  "precio":3100
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);  
        
    });

    test('Un usuario logueado puede agregar el evento ', async () => {
        const nuevoEvento = {
          "titulo":"Cuarto evento",
          "descripcion":"Este es el cuarto",
          "destacado":false,
          "imagenUrl":"www.lol.com", 
          "localidad":"Corrientes",
          "detalles":[
              {
                  "fecha":"2022-01-08",
                  "hora":"13:00",
                  "precio":3500
              },
              {
                  "fecha":"2022-02-09",
                  "hora":"13:00",
                  "precio":3700
              }
          ]
        };
  
        await api
          .post('/eventodetalles')
          .set(headers)
          .send(nuevoEvento)
          .expect(200)
          .expect('Content-Type', /application\/json/);  
        
    });

    test('Usuario logueado puede listar sus Eventos Paginados', async () => {
        const res = await api.get('/usuario/eventos').set(headers)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(3);
    });

    test('Listado de Eventos Destacados', async () => {
        const res = await api.get('/eventosdestacados')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveLength(2);
    });

    test('Obtener detalles de un evento 1', async () => {
        console.log(idEvento1)   
        const res = await api.get(`/eventos/${idEvento1}`)
        expect(res.statusCode).toEqual(200);
        const contents = res.body.map(r => r.titulo);
		expect(contents).toContain('Primer');
    });

    test('Compartir evento en Twitter', async () => {    
        console.log(idEvento1)     
        const id = idEvento1 + "";
        const res = await api.get('/compartirevento').send({id: id});        
        expect(res.statusCode).toEqual(200);        
		expect(res.body).toEqual('Iré al primer @ 2021-10-08 www.lol.com')
    });

    test('Listado de eventos ordenados por fecha', async () => {
        const res = await api.get('/eventos')
        expect(res.statusCode).toEqual(200)
        const contents = res.body.map(r => r.titulo);
		expect(contents).toContain('Cuarto');
        
    });
});

afterAll(() => {
    db.close();
});
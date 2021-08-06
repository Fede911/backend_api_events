# TP Final con NodeJS
Proyecto Final del curso "Desarrollo BackEnd con Node JS" dictado por el Cluster Tecnológico Catamarca - CCT

## Documentación

## Introducción
Esta API se encarga de registrar eventos con un título, descripción, localización y detalles del evento particularizado por la fecha, hora y precio de los mismos.

## Autenticación
Los usuarios se deben registrar mediante su nombre, su apellido, un nombre de usuario, y una clave. La autenticación solo requerirá nombre de usuario y clave. A partir de un nombre de usuario y contraseña válido, se obtiene un token temporal(JWT) para conectarse con la API. Una vez obtenido un token válido, se deberá adjuntarlo en las cabeceras HTTP (Headers) con cada petición que realices a la API.

## Formato de respuestas de la API y Códigos de error.
Si una petición es correcta la API devolverá un JSON con los datos requeridos y un código de respuesta HTTP 200. Por el contrario, si las peticiones son incorrectas devolverá un JSON con el atributo Error y un código de respuesta diferente a HTTP 200.


### API endpoints

`GET /eventos`

Lista todos los eventos vigentes por fecha (Excluye los pasados de fecha).

---

`GET /compartirevento`

Devuelve un mensaje con el nombre del evento, la fecha de realización y el link de la url de la imagen asociada.

---

`GET /eventos/{id}`

Lista todos los detalles de un evento.

---

`GET /eventosdestacados`

Lista todos los eventos destacados.

---

`POST /usuario`

Crea un nuevo usuario.
    Enviar parametros de entrada: nombre, apellido, usuario, y clave.
        Ejemplo: { "nombre":"Mario", "apellido":"Lopez", "usuario":"demo", "clave":"123" }

---

`POST /auth`

Realiza el login ingresando usuario y contraseña, devolviendo un token para validar la sesión.
    Enviar parametros de entrada: usuario y clave.
        Ejemplo: { "usuario":"demo", "clave":"123" }

---

`POST /usuario/eventos`

Crea un evento (solamente permitido para los usuarios que han realizado un login exitoso).
    Enviar parametros de entrada: titulo, descripcion, destacado, imagenUrl, localidad.
        Ejemplo: { "titulo":"Fiesta Anual", "descripcion":"Fiesta anual del asado", "destacado":"true", "imagenUrl":"www.fiesta.com/asados/asado.jpg", "localidad": "Oro Verde, Entre Ríos", { "fecha": "2021-08-15", "hora":"12:00", "precio":"1000.00", "id_evento":"1" } }  
        
---

`GET /usuario/eventos/:page?`

Lista los eventos del usuario paginados (3 por página).

---
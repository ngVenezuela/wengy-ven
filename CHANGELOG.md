## [Unreleased]

## 4.0.0 (2019-02-09)

### Agregado

- Soporte para zeit/now.

### Actualizado

- Dependencias

## 3.3.3 (2018-10-27)

### Actualizado

- Se actualizó a la versión 2.0 de CircleCI

## 3.3.2 (2018-10-19)

### Corregido

- Se modificó el changelog de acuerdo al último cambio

## 3.3.1 (2018-10-18)

### Corregido

- Se agregó un token para la api de github

## 3.3.0 (2017-12-16)

### Agregado

- Se agregó un servicio para reportar errores. (https://sentry.io)

## 3.2.4 (2017-10-07)

### Modificado

- Se reemplazó la librería `twitter` por `twit` para manejar los errores 420 de Twitter.

## 3.2.3 (2017-10-07)

### Corregido

- Mensaje de nuevo tuit se envía como HTML, además se escapan algunos caracteres especiales.

## 3.2.2 (2017-08-20)

### Agregado

- Se agregó JSDoc a todos los métodos, funciones y clases.

## 3.2.1 (2017-08-20)

### Corregido

- Se agregó un tipo nuevo de grupo

## 3.2.0 (2017-08-20)

### Agregado

- Se agregó un changelog.md al proyecto.
- Al enviar un enlace al grupo, se envía dicho enlace al grupo de admins.

### Cambiado

- Se agregó una nueva plantilla para PR's.

## 3.1.0 (2017-06-25)

### Agregado

- Nueva tarea en package.json para verificar estilos de código.
- Agregado archivo de configuración de CircleCI para despliegue automático.

### Cambiado

- Se resaltan las características del bot en el README.md.
- Se actualizó el wiki para reflejar los nuevos cambios.

### Corregido

- Se agregó una url y un puerto por defecto en la configuración del servidor de redis.
- Se modificó el circle.yml para que no intentará utilizar una llave pública suministrada.
- Se arregló la configuración de las variables de entorno de twitter, por eso no funcionaba en producción.

## 3.0.1 (2017-06-05)

### Arreglado

- No publicar los RT que le hacen a la cuenta ngVenezuela.
- Reconocerá los comandos con el sufico @wengybot.


## 3.0.0 (2017-06-04)

### Agregado

- Se añadieron 2 nuevos comandos: /comunidades y /github.
- El usuario puede crear códigos en gist a través del comando /gist.
- Control de comandos para evitar el abuso.

### Corregido

- Funciones de ES5 a ES6.


## 2.3.0 (2017-05-27)

### Agregado

- Se agregaron instrucciones en la wiki para los que quieran colaborar.
- Se agregó archivo de configuración de editorconfig.
- Se agregaron los releases de ionic y nativescript para monitorearlos.

### Cambiado

- La monitorización del blog se cambió a Superfeedr.
- Ahora se está usando el streaming API de twitter.

### Corregido

- Bug donde traía tuits repetidos.


## 2.2.0 (2017-05-24)

### Agregado

- Se integró los releases de github con el repo de angular y de wengy-ven y pública en el grupo cada vez que hay un nuevo release. (Por @osnoser1)

### Corregido

- Se aplicó el ESLint a todos los archivos, y se organizó el código.


## 2.1.1 (2017-05-21)

### Agregado

- El bot lee el TL del twitter de ngVenezuela y publica los tweets en el grupo. (Por @dianjuar y @yossely)


## 2.0.1 (2017-05-20)

### Cambiado

- Se cambió el método en el que el bot recibia updates de Telegram. (Por @osnoser1)

### Corregido

- Bug donde no reconocía que el usuario daba los buenos días.


## 2.0.0 (2017-05-14)

### Agregado

- Integración del bot con https://api.ai/.
- Se agregaron más mensajes.

### Corregido

- Enlace al semver en español.


## 1.3.0 (2017-05-14)

### Agregado

- Se agregó nueva frase de buenos días.

### Corregido

- Refactorización del código.
- Se mejoró el README.md.


## 1.2.0 (2017-05-09)

### Agregado

- El bot se despide si alguien se salió del grupo.

## 1.1.1 (2017-05-09)

### Corregido

- Se subió la versión minor.


## 1.0.2 (2017-05-09)

### Añadido

- Se implementó Jest para Unit testing. (Por @davidjsalazarmoreno)
- Se crea automáticamente un gist cuando el usuario coloca un código en el chat. (Por @davidjsalazarmoreno)

### Cambiado

- Se cambió la URL del blog.
- Al recibir un nuevo miembro, se le envía una encuesta.

### Corregido

- Formato del mensaje de bienvenida. (Por @dianjuar)


## 1.0.1 (2017-01-22)

### Añadido

- Publica entradas del blog automáticamente al grupo.
- Da los buenos días, dadas ciertas condiciones.


## 1.0.0 (2016-10-02)

### Añadido

- Da la bienvenida a nuevos miembros.

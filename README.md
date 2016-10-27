# Wengy-ven

BOT de Bienvenida a nuevos integrantes del grupo [ngVenezuela OFF-TOPIC](https://telegram.me/ngvenezuela) 
en Telegram. 

## Comenzando

Clonamos el proyecto con el comando: `git clone git@github.com:ngVenezuela/wengy-ven.git`

### Prerequisitos

Para poder tener un bot, es necesario crearlo, y obtener un token para el mismo, las 
instrucciones las puedes consultar aquí: [¿Cómo creo un bot?](https://core.telegram.org/bots#3-how-do-i-create-a-bot).
Este bot nos va a servir para hacer nuestros desarrollos y/o pruebas.

Luego de creado el bot, lo agregamos a un grupo: 
[Agregar bot a un grupo](images/add-bot-to-group.jpg)
Y ya automáticamente quedará escuchando cualquier comando

Lo otro que debemos hacer es tener instalado una versión de [NodeJS](https://nodejs.org/en/) mayor a la v6.0, debido 
a la compatibilidad de ES6 no tiene un gran soporte en [versiones anteriores](http://node.green/). 

### Instalando

Instalamos todas las dependencias del proyecto con el comando: `npm install` 

Por último creamos un archivo en el directorio `config/` llamado `config.js` con el formato 
que tiene el archivo `config.sample.js`. En este nuevo archivo colocaremos nuestros token que 
pudimos obtener durante la sección de Prerequisitos.

## Corriendo los tests

Por ahora, este proyecto no tienes pruebas.

## Despliegue

Para ejecutar este proyecto, debemos colocarnos sobre el directorio y correr el comando:
`node src/index.js'

## Construido con

* NodeJS 
* API de Telegram

## Contribuyendo

Por favor lee [CONTRIBUTING.md](.github/CONTRIBUTING.md) para los detalle de nuestro código de conducta, 
y el proceso para enviarnos pull requests.

## Versionado

Utilizamos [SemVer](http://semver.org/) para el versionado.
Para ver las versiones disponibles, mira los [tags en este repositorio](https://github.com/ngVenezuela/wengy-ven/tags). 

## Autores

* **Andrés Villanueva** - *Trabajo inicial* - [Villanuevand](https://github.com/Villanuevand)
* **Leonardo Cabeza** - *Código inicial* - [leocabeza](https://github.com/leocabeza)

Ver también la lista de [contribuyentes](https://github.com/ngVenezuela/wengy-ven/graphs/contributors) que participaron en este proyecto.

## Licencia

Este proyecto está licenciado bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Expresiones de gratitud

* La comunidad de [ngVenezuela](https://github.com/orgs/ngVenezuela/people)

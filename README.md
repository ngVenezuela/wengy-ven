# Wengy-ven

> BOT de Bienvenida a nuevos integrantes del grupo [ngVenezuela](https://t.me/ngvenezuela)
en Telegram. Desarrollado con NodeJS y el API de Telegram.

## Prerequisitos

Antes de comenzar a trabajar con nuestro BOT, es necesario cumplir con los siguientes requisitos:

- [Node v6.0 o superior](https://nodejs.org/en/)

  Esta versión es necesaria debido a la compatibilidad de ES6, la cual no tiene gran soporte en [versiones anteriores](http://node.green/).

- [Crear un BOT el Telegram](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

  Para poder tener un bot, es necesario crearlo y así obtener un **Token** para el mismo. Este bot nos va a hacer posible nuestros desarrollos y/o pruebas.

- [Agregar el BOT a un grupo](https://raw.githubusercontent.com/ngVenezuela/wengy-ven/master/images/add-bot-to-group.jpg)

  Luego de haber creado el BOT, lo agregamos a un grupo para que así escuche cualquier comando.


## Installación

Para comenzar a trabajar en nuestro BOT, abrimos nuestra _terminal_ y ejecutamos los siguientes comandos:

```bash
# Clonamos el proyecto.
$ git clone git@github.com:ngVenezuela/wengy-ven.git

# Accedemos al directorio donde se clonó nuestro proyecto.
$ cd wengy-ven

# Instalamos todas las dependencias del proyecto.
$ npm install
```

Por último creamos un archivo en el directorio `config/` llamado `config.js` con el formato
que tiene el archivo `config.sample.js`. En este nuevo archivo colocaremos el [Token](https://core.telegram.org/bots#3-how-do-i-create-a-bot) que
pudimos obtener previamente.

## Corriendo los tests

Para ejecutar los tests (pruebas), simplemente ejecutamos los siguientes comandos:

```bash
$ npm run test

# También puedes activar el modo watch
$ npm run test:watch
```

## Despliegue

Finalmente, para ejecutar nuestro BOT, nos aseguramos de estar en el directorio de nuestro proyecto y escribimos el siguiente comando en nuestra terminal:

```bash
$ node src/index.js
```

## Contribuyendo

Te invitamos a leer el documento [CONTRIBUTING](.github/CONTRIBUTING.md) para conocer todos los detalle de nuestro código de conducta y el proceso para enviarnos _Pull Requests_.

## Versionado

Utilizamos [SemVer](http://semver.org/lang/es/) para el versionado. Para ver las versiones disponibles de nuestro BOT, mira los [Tags](https://github.com/ngVenezuela/wengy-ven/tags) en este repositorio.

## Autores

* **Andrés Villanueva** - *Trabajo inicial* - [Villanuevand](https://github.com/Villanuevand)
* **Leonardo Cabeza** - *Código inicial* - [leocabeza](https://github.com/leocabeza)

Y por acá puedes ver la lista completa de [contribuyentes](https://github.com/ngVenezuela/wengy-ven/graphs/contributors) que participaron en este proyecto.

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](https://github.com/ngVenezuela/wengy-ven/blob/master/LICENSE)

## Expresiones de gratitud

* La comunidad de [ngVenezuela](https://github.com/orgs/ngVenezuela/people)

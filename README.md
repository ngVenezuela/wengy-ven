![Test status](https://img.shields.io/travis/ngVenezuela/wengy-ven.svg?style=popout)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ngVenezuela/wengy-ven/develop/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Wengy-ven

> BOT oficial para la comunidad de [ngVenezuela](https://t.me/ngvenezuela) en Telegram. Desarrollado con NodeJS y el API de Telegram.

## Características

* Comandos:
  * /github - muestra un enlace para este repo.

    ![](http://i.imgur.com/yt4gq19.png)
  * /comunidades - muestra un enlace para el grupo de comunidades de OpenVE.

    ![](http://i.imgur.com/SKDXlHi.png)
  * /gist (acepta un parámetro) - genera un gist y muestra el enlace al mismo.

    ![](http://i.imgur.com/jvfIbnb.png)

* Se saluda a los nuevos miembros que entran al grupo, y también a los que se van.

  ![](http://i.imgur.com/tk7Qct5.png)

* En caso de que el usuario coloque un código formateado entre ```, si es mayor a 400 caracteres se le sugiere que utilice el comando /gist, de lo contrario, crea un gist automáticamente. Esto se hace a través de la [API de github](https://developer.github.com/v3/)

  ![](http://i.imgur.com/96xk4tV.png)
* Se siguen varios repos relacionados a Angular/AngularJS, cuando hay un nuevo release de los mismos, se informa mediante un mensaje al grupo mencionando la versión y un enlace al CHANGELOG.md o al repo en caso de que no tenga changelog. Esto se hace a través de [Zapier](https://https://zapier.com).

  ![](http://i.imgur.com/1SpTTIE.png)
* Se sigue el feed del blog oficial de *ngVenezuela*, y cuando hay nuevas entradas se publica en el grupo el enlace con la nueva entrada con el nombre del autor. Esto se hace a través de [Zapier](https://https://zapier.com).

  ![](http://i.imgur.com/L8zBF8T.png)
* Si se le hace una mención al bot o se le responde a un mensaje, se evaluará la expresión a través de [https://dialogflow.com](https://https://dialogflow.com/) y se le responderá siempre y cuando se le haya entrenado según el mensaje que se le escribió.

  ![](http://i.imgur.com/7E6IlLo.png)
* Se le hace un seguimiento a la cuenta oficial de twitter de *ngVenezuela*, y cualquier tuit o RT que se haga desde esa cuenta, se muestra un enlace al grupo.

  ![](http://i.imgur.com/Z42qTXp.png)

## Contribuyendo

Te invitamos a leer el documento [CONTRIBUTING](.github/CONTRIBUTING.md) para conocer todos los detalle de nuestro código de conducta y el proceso para enviarnos _Pull Requests_.

Para configurar tu ambiente de desarrollo, te invitamos a leer las siguientes instrucciones: [https://github.com/ngVenezuela/wengy-ven/wiki/Instrucciones-para-colaborar-con-wengy-ven](https://github.com/ngVenezuela/wengy-ven/wiki/Instrucciones-para-colaborar-con-wengy-ven)

## Corriendo los tests

Para ejecutar los tests (pruebas), simplemente ejecutamos los siguientes comandos:

```bash
$ npm run test

# También puedes activar el modo watch
$ npm run test:watch
```

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

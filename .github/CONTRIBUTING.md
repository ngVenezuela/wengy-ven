
# Contribuyendo con "Wengy-ven"

Para nosotros tú contribución es muy importante, y en pro de mantener un orden en nuestros repos hemos creado este archivo `contributing.md`, para que puedas enviar todos tus aportes. 
Aquí están los lineamientos para poder contribuir.

## Sobres el "branch" o "rama" a utilizar.

En los proyectos de ngVenezuela, tenemos 2 branches, o ramas por defecto: 

- `master`.
- `develop`.

El branch `master` es tratado como "producción" y `develop` como el de "ci", o "qa", por lo consiguiente, se deben crear branches o ramas individuales para cualquier aporte, luego en el `pull request` se debe especificar que el nuevo cambio será unirá a `develop`.

### **_IMPORTANTE_**
¡NUNCA! debemos hacer merge a `master` ya que estaríamos haciendo cambios a "PRODUCCION". 

## Formato de Commits
Tenemos una estructura a seguir, para facilitar la validación de tus contribuciones y mantener un buen flujo de trabajo. Los mensajes de commits _deberían_ ser de la siguiente manera: 

````
(<Accion>): <Mensaje Corto>
<LINEA EN BLANCO>
<Mensaje Explicativo>
```
 
El Encabezado:  `(<Accion>): <Mensaje Corto>` **es obligatorio**, el resto es opcional. Las acciones disponibles, puedes encontarlas en [Acciones](#acciones), un poco más abajo.

Cualquier línea en un mensaje de commit no de ser mayor de 100 caracteres!. Esto permite la fácil lectura de los mensajes tant oen Github como en varias herramientas de git.

#### Ejemplos:
_Commit Corto:_

`(Agrega): Clase Utils para lectura de atributos.`

_Commit Largo:_
````
(Agrega): Clase Utils para lectura de atributos.

La clase utils,esta divida en varios métodos para diferentes usos.
Para validar se usan los siguientes métodos.
ValidaPhone.
ValidaIp
ValidaNavegador
ValidaNovias
```


## Pull Requests
Por favor asegurate que tú `pull request` cumpla los siguientes lineamientos:

- Crea un `pull request` individual por cada aporte.
- Usa `title-casing` (AP style).
- Presta mucha atención a tu ortografía.
- Nuevas categorias o mejoras a lo que ya existe, siempre es bienvenido.


## Acciones
Las acciones son los indicativos primordiales de los cambios que realizamos en un determinado archivo. Con éstas lo que intentamos es saber con una simple lectura que tipo de modificació fué hecha.
Actualmente tenemos estás acciones disponibles: 

- **Agrega**: Usalo para notificar una nueva funcionalidad, o algún comportamiento que antes no estaba.
- **Elimina**: Cuando eliminas alguna funcionalidad, tratamiento o porción de codigo, sin afectar un comportamiento.
- **Modifica**: Al cambiar sustancialmente un comportamiento, funcionalidad o  tratamiento. 
- **Actualiza**: Exclusivamente para documentos informativos, o dependencias utilizadas.
- **Correccion**: Si existe un bug, y es solventado, esta acción es la ideal para avisarlo. 
- **Refactor**: Cuando se hace un cambio de logica, comportamiento o funcionalidad de manera sustancial. 


_Si quieres proponer un nuevo tipo de "Accion", puedes abrir un `issue`, para ello en este [enlace](https://github.com/ngVenezuela/wengy-ven/issues)_


**_¡Importante!: Las contribuciones que no cumpla con las recomendaciones acá expuestas no será aceptadas._**




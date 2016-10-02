
# Contribuyendo con "Wengy-ven"

Para nosotros tú contribución es muy importante, y en pro de mantener un orden en nuestros repos hemos creado este archivo `contributing.md`, para que puedas enviar todos tus aportes. 
Aquí están los lineamientos para poder contribuir.


## Sobre el "branch" o "rama" a utilizar.

En los proyectos de ngVenezuela, tenemos 2 branches, o ramas por defecto: 

- `master`.
- `develop`.

Te recomendamos nombrar los branches o ramas de tus colaboraciones para ngVenezuela con el prefijo: `ngve-` seguido por la convención de tú preferencia. A nosotros nos agrada esta: `<prefijo ngve>-<palabra "issue">-<numero de issue>-`.

Quedaría algo como esto: `ngve-issue-14-encuesta`. 

El branch `master` es tratado como "producción" y `develop` como el de "ci", o "qa", por lo consiguiente, se deben crear branches o ramas individuales para cualquier aporte, luego en el `pull request` se debe especificar que el nuevo cambio será unirá a `develop`.

##### **_IMPORTANTE_**
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
- Sigue las indicaciones dadas en la plantilla de `pulls requests`.
- Usa `title-casing` (AP style).
- Presta mucha atención a tu ortografía.
- Nuevos aportes o mejoras a lo que ya existe, siempre es bienvenido.

#### Ejemplos 

##### `PULL REQUEST` de un bug o error: Multiplicación de números, ISSUE #14

* * * 

>**Estoy enviando un ...**  (marque con una "x")

```
[ X ] Error reportado #14
[ ] Solicitud de caracteristica, mejora. 

```

>**Comportamiento Actual** 

>Se lanza un error multiplicar por cero.



>**Comportamiento Esperado**

>Debe manejar los casos de multiplicacion por cero.



>**Reproducción del Problema**

>Al ingresar a la sección "multiplicar" y realizar una operación. 



>**Cual es el motivo / Caso util para cambiar el comportamiento?**

>El error generado por la multiplicación con cero, lanza una excepción fatal y finaliza la apliacación.



>**Por favor cuentamos sobre tu ambiente de desarrollo:**

>Windows 8, IDE: Sublime text, Node 5.4.0, y todos la informacion necesaria.


* * * 

Acá dejamos otro ejemplo sobre como hacer un `PULL REQUEST`, en este caso notificaremos que estámos cubriendo una funcionalidad solicitada en un el issue número 15.

* * * 

##### `PULL REQUEST` de una funcionalidad: Graficar una función SENO, ISSUE #15


>**Estoy enviando un ...**  (marque con una "x")

```
[ ] Error reportado.
[ X ] Solicitud de caracteristica, mejora. #15

```

>**Comportamiento Actual** 

>Todas las operaciones matematicas.



>**Comportamiento Esperado**

>Debe graficar un función SENO.



>**Reproducción del Problema**

> _NO APLICA_



>**Cual es el motivo / Caso util para cambiar el comportamiento?**

>Mejora de la aplicación, para ampliar el espectro de usuarios. 



>**Por favor cuentamos sobre tu ambiente de desarrollo:**

>_NO APLICA_

* * * 

Notese que en este segundo ejemplo, aparece la palabra "_NO APLICA_", está es utilizada en el caso de que algúnas de las opciones expuestas en la plantilla, no fuese coherente. 


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




const messages = {
  welcomeMsg: 'Hola #{name}, bienvenido a ngVenezuela, te invitamos a ' +
    'seguirnos en twitter `@ngVenezuela` y a unirte a nuestro grupo ' +
    'en Google bit.ly/ng-venezuela-google-groups Puedes colocar tus ' +
    'preguntas ahí, también tenemos cursos, de typescript e iniciacion con Angular.',
  goodMornings: {
    mondays: [
      'Buenos días comunidad, ¡Que tengan un excelente inicio de semana! \u{1F60E}',
    ],
    fridays: [
      'Buenos días. Recuerden que los viernes no se hacen deploy \u{1F601}',
      'Buenos días. ¡Hoy es viernes y el hardware lo sabe!',
      'Buenos días comunidad. Feliz viernes',
      'Buenos días. Hoy cualquier bug es un feature después de las 4pm',
    ],
    generic: [
      'Buenos días...¿tomaron café? \u{2615}',
      'Buenos días. Recuerden que detrás de una persona exitosa, ' +
      'esta una gran cantidad de café \u{2615}',
      'Buenos días. Keep calm and drink \u{2615}',
      'Buenos días \u{1F601}\u{2615}',
      'Buenos días',
      'Buenos días a todos',
      'Buenos días comunidad',
      'Buenos días comunidad, Y como dice @frick: ¡A trabajar, vagos! Que los yates de sus jefes no se pagan solos'
    ],
  },
  newBlogPost: '*#{author}* ha agregado una nueva entrada al blog titulada: *#{title}*' +
    ' y está disponible en: #{link}',
};

module.exports = messages;

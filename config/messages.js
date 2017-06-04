const messages = {
  welcome: 'Hola #{name}, ¡Bienvenid@ a ngVenezuela!. Te invitamos a '.concat(
    'seguirnos en twitter como [@ngVenezuela](https://twitter.com/ngVenezuela) ',
    'y a mirar nuestra comunidad en Github: https://github.com/ngvenezuela.\n\n',
    'Además nos gustaría que respondieras esta pequeña encuesta: http://bit.ly/ngve-encuesta'),
  goodByes: [
    '¡Nos vemos pronto #{name}! Esperamos NO verte por el grupo de React Venezuela',
    'Goodbye, Hasta la vista, Sayonara #{name}'
  ],
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
      'Buenos días. Recuerden que detrás de una persona exitosa '.concat(
      'está una gran cantidad de café \u{2615}'),
      'Buenos días. Keep calm and drink \u{2615}',
      'Buenos días \u{1F601}\u{2615}',
      'Buenos días',
      'Buenos días a todos',
      'Buenos días comunidad',
      'Buenos días #ngPanas',
      'Buenos días comunidad, Y como dice @cesarfrick: ¡A trabajar, '.concat(
        'vagos! Que los yates de sus jefes no se pagan solos')
    ],
  },
  newBlogPost: '*#{author}* ha agregado una nueva entrada al blog titulada: '.concat(
    '*#{title}* y está disponible en: #{link}'),
  newTweet: '#{hashtagMessage} \u{1F426}\n'.concat(
            '#{tweetText}\n',
            '----\n',
            '[Puedes ver el Tweet aquí](#{tweetUrl})'),
  githubRelease: '*#{name}* acaba de alcanzar la versión *#{version}*\n\n'.concat(
    '[Puedes ver los cambios aquí](#{url})'),
  githubOpenVeLink: 'El enlace de github para comunidades de Telegram es: #{link}',
  gistCreated: 'gist creado por #{fullName} #{user} para #{telegramLink} con #{githubLink}',
  gistRecommendation: 'Utiliza el comando /gist _codigo_ para generar un gist en github'
};

module.exports = messages;

const messages = {
  welcome: 'Hola #{name}, ¡Bienvenid@ a ngVenezuela!. Te invitamos a '.concat(
    'seguirnos en twitter como [@ngVenezuela](https://twitter.com/ngVenezuela) ',
    'y a mirar nuestra comunidad en Github: https://github.com/ngvenezuela.\n\n',
    'Además nos gustaría que respondieras esta pequeña encuesta: http://bit.ly/ngve-encuesta'
  ),
  goodBye:
    '¡Nos vemos pronto #{name}! Esperamos NO verte por el grupo de React Venezuela',
  newBlogPost: '*#{author}* ha agregado una nueva entrada al blog titulada: '.concat(
    '*#{title}* y está disponible en: #{link}'
  ),
  newTweet: '#ngVenezuelaTweet \u{1F426}\n'.concat(
    '#{tweetText}\n',
    '----\n',
    'Puedes ver el Tweet aquí: #{tweetUrl}'
  ),
  githubRelease: '*#{name}* acaba de alcanzar la versión *#{version}*\n\n'.concat(
    '[Puedes ver los cambios aquí](#{url})'
  ),
  githubOpenVeLink:
    'El enlace de github para comunidades de Telegram es: https://github.com/OpenVE/comunidades-en-telegram',
  gistCreated:
    'gist creado por #{fullName} #{user} para https://t.me/ngvenezuela con https://github.com/ngVenezuela/wengy-ven',
  gistRecommendation:
    'Utiliza el comando /gist _codigo_ para generar un gist en github',
};

export default messages;

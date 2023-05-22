const fetch = require('node-fetch');

exports.handler = async (event) => {
  const data = JSON.stringify(event.body);

  fetch(`https://lms.ricesmart.in/webhooks.zoom`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      Authorization: '3c643f2d8c624292ae190df0beb644d7',
      'Content-Type': 'application/json',
      Cookie: 'openedx-language-preference=en',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(event.body), // body data type must match "Content-Type" header
  })
    .then(function (response) {
      return response;
    })
    .catch(function (err) {
      return err;
    });
};
const _request = require('request');

async function request(...args) {
  return new Promise(function (resolve, reject) {
    _request(...args, function (error, response) {
      if (error) {
        reject(error);
      }
      resolve(response);
    });
  });
}

module.exports = request;

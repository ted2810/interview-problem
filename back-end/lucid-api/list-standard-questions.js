const request = require('../utils/request');

const {
  NODE_ENV,
  LUCID_AUTH_KEY // => XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
} = process.env;

const LUCID_DOMAIN = NODE_ENV === 'production'
  ? 'api.samplicio.us'
  : 'sandbox.techops.engineering';

async function listStandardQuestions(countryLanguageID) {
  /*
    countryLanguageID: number. Example: 8

    Documentation: https://developer.lucidhq.com/?shell#get-list-standard-questions
  */

  const response = await request({
    method: 'GET',
    url: `https://${LUCID_DOMAIN}/Lookup/v1/QuestionLibrary/AllQuestions/${countryLanguageID}`,
    headers: {'Authorization': LUCID_AUTH_KEY}
  });

  return response;
}

module.exports = listStandardQuestions;

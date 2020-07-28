const request = require('../utils/request');

const {
  NODE_ENV,
  LUCID_AUTH_KEY // => XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
} = process.env;

const LUCID_DOMAIN = NODE_ENV === 'production'
  ? 'api.samplicio.us'
  : 'sandbox.techops.engineering';

async function createSurvey(surveyName, countryLanguageID, clientSurveyLiveURL) {
  /*
    surveyName: string. Example: "Survey1"
    countryLanguageID: number. Example: 8
    clientSurveyLiveURL: string. Example: "https://www.example.com/"

    Documentation: https://developer.lucidhq.com/?shell#post-create-a-survey
  */

  const response = await request({
    method: 'POST',
    url: `https://${LUCID_DOMAIN}/Demand/v1/Surveys/Create`,
    headers: {
      'Authorization': LUCID_AUTH_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      SurveyName: surveyName,
      CountryLanguageID: countryLanguageID,
      ClientSurveyLiveURL: clientSurveyLiveURL
    })
  });

  return response;
}

module.exports = createSurvey;

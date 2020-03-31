const request = require('../utils/request');

const {
  NODE_ENV,
  LUCID_AUTH_KEY // => XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
} = process.env;

const LUCID_DOMAIN = NODE_ENV === 'production'
  ? 'api.samplicio.us'
  : 'sandbox.techops.engineering';

async function createQualification(
  surveyNumber,
  name,
  questionID,
  order,
  logicalOperator = 'OR',
  numberOfRequiredConditions = 0,
  isActive = true,
  preCodes = []
) {
  /*
    surveyNumber: number. Example: 44120
    name: string. Example: "STANDARD_RELATIONSHIP"
    questionID: number. Example: 632
    order: number. Example: 7
    logicalOperator: string. Example: "OR"
    numberOfRequiredConditions: number. Example: 0
    isActive: boolean. Example: true
    preCodes: Array<string>. Example: ["1"]

    Documentation: https://developer.lucidhq.com/?shell#post-create-a-qualification
  */

  const response = await request({
    method: 'POST',
    url: `https://${LUCID_DOMAIN}/Demand/v1/SurveyQualifications/Create/${surveyNumber}`,
    headers: {
      'Authorization': LUCID_AUTH_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Name: name,
      QuestionID: questionID,
      Order: order,
      LogicalOperator: logicalOperator,
      NumberOfRequiredConditions: numberOfRequiredConditions,
      IsActive: isActive,
      PreCodes: preCodes
    })
  });

  return response;
}

module.exports = createQualification;

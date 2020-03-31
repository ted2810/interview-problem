const request = require('../utils/request');

const {
  NODE_ENV,
  LUCID_AUTH_KEY // => XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
} = process.env;

const LUCID_DOMAIN = NODE_ENV === 'production'
  ? 'api.samplicio.us'
  : 'sandbox.techops.engineering';

async function listGlobalDefinitions(bundle) {
  /*
    bundle: string. Example: "Countries,CountryLanguages"

    Documentation: https://developer.lucidhq.com/?shell#get-list-global-definitions
  */

  const response = await request({
    method: 'GET',
    url: `https://${LUCID_DOMAIN}/Lookup/v1/BasicLookups/BundledLookups/${bundle}`,
    headers: {'Authorization': LUCID_AUTH_KEY}
  });

  return response;
}

module.exports = listGlobalDefinitions;

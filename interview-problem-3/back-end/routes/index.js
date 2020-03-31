const {promisify} = require('util');
const express = require('express');
const redis = require('redis');

const request = require('../utils/request');
const createQualification = require('../lucid-api/create-qualification');
const createSurvey = require('../lucid-api/create-survey');
const listGlobalDefinitions = require('../lucid-api/list-global-definitions');
const listStandardQuestions = require('../lucid-api/list-standard-questions');

const router = express.Router();

const redisClient = redis.createClient({host: 'redis'});
redisClient.get = promisify(redisClient.get);
redisClient.set = promisify(redisClient.set);

redisClient.on('error', function (error) {
  throw error;
});

router.get('/api/v1/countries', async function (req, res, next) {
  // Returns the response of listGlobalDefinitions()

  let result = await redisClient.get('/api/v1/countries');
  if (!result) {
    // Cache the response in Redis

    const response = await listGlobalDefinitions('Countries,CountryLanguages');
    if (response.statusCode !== 200) {
      res.status(502).send("Invalid response from Lucid.");
      return;
    }
    await redisClient.set('/api/v1/countries', response.body);
    result = JSON.parse(response.body);
  } else {
    result = JSON.parse(result);
  }
  res.json(result);
  return;
});

router.get('/api/v1/countries/:countryCode/questions', async function (req, res, next) {
  // Returns the response of listStandardQuestions()
  // :countryCode example: "GB"

  const countryCode = req.params.countryCode;
  let result = await redisClient.get(`/api/v1/countries/${countryCode}/questions`);
  if (!result) {
    // Cache the response in Redis

    const countries = await request('http://nginx/api/v1/countries')
      .then(response => JSON.parse(response.body));

    const country = countries
      .AllCountries
      .find(country => country.Code === countryCode);
  
    if (!country) {
      res.status(400).send('Invalid country code.');
      return;
    }
    
    const countryLanguagePair = countries
      .AllCountryLanguages
      .find(countryLanguagePair => countryLanguagePair.Code.endsWith(country.Code));

    if (!countryLanguagePair) {
      result = {};
      await redisClient.set(`/api/v1/countries/${countryCode}/questions`, JSON.stringify(result));
    } else {
      const response = await listStandardQuestions(countryLanguagePair.Id);
      if (response.statusCode !== 200) {
        res.status(502).send("Invalid response from Lucid.");
        return;
      }
      await redisClient.set(`/api/v1/countries/${countryCode}/questions`, response.body);
      result = JSON.parse(response.body);
    }
  } else {
    result = JSON.parse(result);
  }
  res.json(result);
  return;
});

router.post('/api/v1/surveys/create', async function (req, res, next) {
  // Creates a new survey + qualifications and returns its information

  const {
    surveyName,
    respondents,
    country: countryName,
    qualifications
  } = req.body;

  const countries = await request('http://nginx/api/v1/countries')
    .then(response => JSON.parse(response.body));

  const country = countries
    .AllCountries
    .find(country => country.Name === countryName);

  if (!country) {
    res.status(400).send('Invalid country code.');
    return;
  }
  
  const countryLanguagePair = countries
    .AllCountryLanguages
    .find(countryLanguagePair => countryLanguagePair.Code.endsWith(country.Code));

  if (!countryLanguagePair) {
    res.status(500).send('Could not find countryLanguagePair.');
    return;
  }

  const standardQuestions = await request(
    `http://nginx/api/v1/countries/${country.Code}/questions`
  ).then(response => JSON.parse(response.body).Questions);

  const countryLanguageID = Number(countryLanguagePair.Id);

  // Create survey

  const survey = await createSurvey(surveyName, countryLanguageID, 'http://example.com/')
    .then(response => response.statusCode === 201 ? JSON.parse(response.body).Survey : undefined);

  if (!survey) {
    res.status(502).send("Failed to create survey.");
    return;
  }

  // Create qualifications

  const createdQualifications = await Promise.all(qualifications.map((qualification, index) => (
    createQualification(
      survey.SurveyNumber,
      qualification,
      standardQuestions.find(question => question.Name === qualification).QuestionID,
      index + 1
    )
  ))).then(responses => !responses.find(response => response.statusCode !== 201));

  if (!createdQualifications) {
    res.status(502).send("Failed to create qualifications.");
    return;
  }

  res.json({
    surveyNumber: survey.SurveyNumber,
    surveyName,
    countryName,
    qualifications
  });
  return;
});

module.exports = router;

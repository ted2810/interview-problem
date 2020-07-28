import React from 'react';
import Button from 'react-bootstrap/Button';

import './SurveyResults.css';

function SurveyResults(props) {
  const {
    surveyNumber,
    name,
    country,
    qualifications,
    onSurveyCreate
  } = props;

  return (
    <div className="SurveyResults">
      <h2 className="mb-4">Success. Details for survey #{surveyNumber}:</h2>
      <div className="mb-2"><b>Name: </b>{name}</div>
      <div className="mb-2"><b>Country: </b>{country}</div>
      <div className="mb-2"><b>Qualifications: </b>{qualifications.join(', ')}</div>
      <Button variant="primary" className="mt-3 Button" onClick={onSurveyCreate}>Create new survey</Button>
    </div>
  );
}

export default SurveyResults;

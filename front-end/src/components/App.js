import React, {useState} from 'react';

import SurveyForm from './SurveyForm';
import SurveyResults from './SurveyResults';

function App(props) {
  const initialState = {
    surveyResults: undefined,
    isLoading: false,
    validated: false
  };
  const [state, setState] = useState(initialState);

  function onFormSubmit(event) {
    event.persist();
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === true) {
      // Submit

      setState(state => ({
        ...state,
        isLoading: true
      }));

      (async function () {
        const formData = new FormData(form);
        const surveyName = formData.get('surveyName');
        const respondents = Number(formData.get('respondents'));
        const country = formData.get('country');

        const qualifications = [];
        for (const [key, value] of formData) {
          if (key.startsWith('qualification')) {
            qualifications.push(value);
          }
        }

        const response = await fetch('/api/v1/surveys/create', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            surveyName,
            respondents,
            country,
            qualifications
          })          
        });
        const body = await response.json();

        setState(state => ({
          ...state,
          isLoading: false,
          surveyResults: body
        }));
      })();
    } else {
      setState(state => ({
        ...state,
        validated: true
      }));
    }
  }

  function onSurveyCreate(event) {
    setState(state => initialState);
  }

  return (
    <div className="App">
      {
        state.surveyResults
          ? <SurveyResults
              country={state.surveyResults.countryName}
              qualifications={state.surveyResults.qualifications}
              name={state.surveyResults.surveyName}
              surveyNumber={state.surveyResults.surveyNumber}
              onSurveyCreate={onSurveyCreate}
            />
          : <SurveyForm
              onFormSubmit={onFormSubmit}
              isLoading={state.isLoading}
              validated={state.validated}
            />
      }
    </div>
  );
}

export default App;

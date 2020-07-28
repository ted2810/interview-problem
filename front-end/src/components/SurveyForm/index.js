import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import NameField from './NameField';
import CountryField from './CountryField';
import QualificationField from './QualificationField';
import RespondentsField from './RespondentsField';

import './index.css';

function SurveyForm(props) {
  const {onFormSubmit, isLoading, validated} = props;

  const initialState = {
    countries: undefined,
    qualifications: undefined,
    selectedQualifications: undefined,
    surveyResults: undefined
  };

  const [state, setState] = useState(initialState);

  useEffect(function () {
    (async function () {
      const response = await fetch('/api/v1/countries');
      const body = await response.json();

      setState(state => ({
        ...state,
        countries: body.AllCountries
      }));
    })();
  }, []); // call useEffect() only on initial render

  function onCountryChange(event) {
    event.persist();
    setState(function (state) {
      (async function () {
        const country = state.countries.find(country => country.Name === event.target.value);
        if (country) {
          const response = await fetch(`/api/v1/countries/${country.Code}/questions`);
          const body = await response.json();
    
          if (!Object.keys(body).length) {
            setState(state => ({
              ...state,
              qualifications: [],
              selectedQualifications: []
            }));
          } else {
            setState(state => ({
              ...state,
              qualifications: body.Questions.map(qualification => qualification.Name),
              selectedQualifications: ['']
            }));
          }
        }
      })();
      return state;
    });
  }

  function onQualificationChange(event) {
    event.persist();
    setState(function (state) {
      // event.target.id: string

      const index = Number(event.target.id);
      const value = event.target.value;

      const selectedQualifications = [...state.selectedQualifications];
      selectedQualifications[index] = value;

      return {
        ...state,
        selectedQualifications        
      };
    });

  }

  function onQualificationAdd(event) {
    setState(function (state) {
      const selectedQualifications = [...state.selectedQualifications, ''];

      return {
        ...state,
        selectedQualifications
      };
    });
  }

  return (
    <div className="SurveyForm">
      <h2 className="mb-3">Create a survey</h2>
      <Form noValidate validated={validated} onSubmit={onFormSubmit}>
        <NameField />
        <RespondentsField />
        {
          state.countries && state.countries.length
            ? <CountryField countries={state.countries} onCountryChange={onCountryChange} />
            : null
        }
        {
          state.qualifications
            ? state.qualifications.length
              ? (
                <>
                  {
                    state.selectedQualifications.map((selectedQualification, index) => (
                      <QualificationField
                        key={index}
                        index={index} // We specify an 'index' property since we cannot access the 'key' property.
                                      // 'index' will be available in onQualificationChange() as 'event.target.id'
                        options={
                          state.selectedQualifications.map(selectedQualification => (
                            // Example:
                            //   state.qualifications: [1, 2, 3, 4, 5]
                            //   state.selectedQualifications: [1, 2, 3]
                            //   => [[1, 4, 5], [2, 4, 5], [3, 4, 5]]

                            // Bug: React renders all the qualifications instead of the filtered qualifications
                            state.qualifications.filter(
                              qualification => (
                                qualification === selectedQualification || !state.selectedQualifications.includes(qualification)
                              )
                            )
                          ))[index]
                        }
                        onQualificationChange={onQualificationChange}
                      />
                    ))
                  }
                  {
                    state.selectedQualifications.length !== state.qualifications.length
                      ? <Button variant="outline-primary" className="mb-3 Button" onClick={onQualificationAdd}>Add qualification</Button>
                      : null
                  }
                  <Button variant="primary" type="submit" className="Button">
                    {isLoading ? 'Loading...' : 'Submit'}
                  </Button>
                </>
              )
              : <div className="mb-3 text-danger">(No available qualifications)</div>
            : null
        }
      </Form>
    </div>
  );
}

export default SurveyForm;

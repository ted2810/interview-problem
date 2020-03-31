import React from 'react';
import Form from 'react-bootstrap/Form';

function CountryField(props) {
  const {countries, onCountryChange} = props;

  return (
    <Form.Group controlId="country">
      <Form.Label>Country</Form.Label>
      <Form.Control as="select" name="country" onChange={onCountryChange} required>
        <option></option>
        {
          countries
            .slice(1) // Skip the first country because its name is 'Not Applicable'
            .map(country => <option key={country.Id}>{country.Name}</option>)
        }
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        Please choose a country.
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default CountryField;

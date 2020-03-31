import React from 'react';
import Form from 'react-bootstrap/Form';

function NameField() {
  return (
    <Form.Group controlId="surveyName">
      <Form.Label>Survey name</Form.Label>
      <Form.Control type="text" name="surveyName" required />
      <Form.Control.Feedback type="invalid">
        Please provide a survey name.
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default NameField;

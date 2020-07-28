import React from 'react';
import Form from 'react-bootstrap/Form';

function RespondentsField() {
  return (
    <Form.Group controlId="respondents">
      <Form.Label>Number of respondents</Form.Label>
      <Form.Control type="number" name="respondents" min="0" required />
      <Form.Control.Feedback type="invalid">
        Please provide a number of respondents.
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default RespondentsField;

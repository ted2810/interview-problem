import React from 'react';
import Form from 'react-bootstrap/Form';

function QualificationField(props) {
  const {
    options,
    onQualificationChange,
    index
  } = props;

  return (
    <Form.Group controlId={`qualification-${index}`}>
      <Form.Label>Qualification</Form.Label>
      <Form.Control as="select" name={`qualification-${index}`} onChange={onQualificationChange} required>
        <option></option>
        {options.map((option, key) => <option key={key}>{option}</option>)}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        Please choose a qualification.
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export default QualificationField;

import React from 'react';
import styled from 'styled-components/macro';
import { Field } from 'redux-form';
import Input from '../../shared/form/Input';

const TextArea = styled(Input)`
  border: none;
  height: 100%;
  resize: none;
  :hover,
  :focus {
    border: none;
    border-bottom: 1px solid ${props => props.theme.border};
    box-shadow: none;
  }
`;

class SearchTextArea extends React.Component {
  onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.onSubmit();
    }
  };

  renderField = field => (
    <TextArea
      as='textarea'
      {...field.input}
      placeholder='Search...'
      rows='1'
      onKeyDown={this.onKeyDown}
    />
  );

  render() {
    return <Field name={this.props.name} component={this.renderField} />;
  }
}

export default SearchTextArea;

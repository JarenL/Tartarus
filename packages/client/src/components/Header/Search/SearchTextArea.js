import React from 'react';
import styled from 'styled-components/macro';
import { Field } from 'redux-form';
import Input from '../../shared/form/Input';
import CancelButton from './CancelButton';
import SearchButton from './SearchButton';

const SearchWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const TextArea = styled(Input)`
  border: none;
  height: 100%;
  width: 100%;
  resize: none;
  :hover,
  :focus {
    border: none;
    // border-bottom: 1px solid ${props => props.theme.border};
    box-shadow: none;
  }
`;

class SearchTextArea extends React.Component {
  onKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.handleSubmit();
    }
  };

  renderField = field => (
    <TextArea
      as='textarea'
      {...field.input}
      placeholder='Search'
      rows='1'
      onKeyDown={this.onKeyDown}
    />
  );

  render() {
    return (
      <SearchWrapper>
        <Field name={this.props.name} component={this.renderField} />
        {this.props.currentQuery !== undefined ? (
          <CancelButton handleCancel={this.props.handleCancel} />
        ) : (
          <SearchButton handleSubmit={this.props.handleSubmit} />
        )}
      </SearchWrapper>
    );
  }
}

export default SearchTextArea;

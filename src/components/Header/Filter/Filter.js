import React, { Component } from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import styled from 'styled-components/macro';
import timeCategories from './FilterTimeCategories';
import typeCategories from './FilterTypeCategories';
import { transition } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 2%;
  justify-content: center;
  align-items: center;
`;

const StyledForm = styled(Form)`
  ${transition('border', 'box-shadow')};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  display: flex;
  margin-right: 5px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  @media (hover: hover) {
    :hover {
      border: 1px solid ${props => props.theme.accent};
    }
  }
  :focus-within {
    border: 1px solid ${props => props.theme.accent};
    box-shadow: 0 0 0 2px ${props => props.theme.accent + '4d'};
  }
  @media (max-width: 768px) {
    margin-top: -1px;
    border-radius: 0;
    border-left: none;
    border-right: none;
    :hover,
    :focus-within {
      border-left: none;
      border-right: none;
    }
  }
`;

class Filter extends Component {
  // onSubmit = post => this.props.attemptCreatePost(post);

  mapTimeCategories = () =>
    timeCategories.map((category, index) => (
      <option key={index} value={category}>
        {category}
      </option>
    ));

  mapTypeCategories = () =>
    typeCategories.map((category, index) => (
      <option key={index} value={category}>
        {category}
      </option>
    ));

  render() {
    return (
      <Wrapper>
        <StyledForm>
          <Field name='type' type='select' component={renderField}>
            {this.mapTypeCategories()}
          </Field>
        </StyledForm>
        <StyledForm>
          <Field name='time' label={null} type='select' component={renderField}>
            {this.mapTimeCategories()}
          </Field>
        </StyledForm>
      </Wrapper>
    );
  }
}

export default Filter;

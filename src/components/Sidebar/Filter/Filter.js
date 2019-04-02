import React, { Component } from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import styled from 'styled-components/macro';
import timeCategories from './FilterTimeCategories';
import typeCategories from './FilterTypeCategories';
import { transition } from '../../shared/helpers';

const Wrapper = styled.aside`
  position: sticky;
  top: 60px;
  display: flex;
  flex-direction: column;
  flex-basis: 100px;
  margin-right: 24px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledForm = styled(Form)`
  ${transition('border', 'box-shadow')};
  border: 1px solid ${props => props.theme.border};
  border-radius: 0 0 2px 2px;
  display: flex;
  width: 100%;
  flex-direction: col;
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
          <Field name='type' label='sort' type='select' component={renderField}>
            {this.mapTypeCategories()}
          </Field>
        </StyledForm>
        <StyledForm>
          <Field name='time' label='sort' type='select' component={renderField}>
            {this.mapTimeCategories()}
          </Field>
        </StyledForm>
      </Wrapper>
    );
  }
}

export default Filter;

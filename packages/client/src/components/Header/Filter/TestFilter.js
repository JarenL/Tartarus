import React, { Component } from 'react';
import { Field } from 'redux-form';
import Form from '../../shared/form/Form';
import renderField from '../../shared/form/renderField';
import styled from 'styled-components/macro';
import timeCategories from './FilterTimeCategories';
import typeCategories from './FilterTypeCategories';
import { transition } from '../../shared/helpers';
import { format } from 'util';
import { wideFont } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
//   margin-right: 2%;
  justify-content: flex-end;
  align-items: center;
  background-color: ${props => props.theme.foreground};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const FormWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 3px;
`;

const StyledForm = styled(Form)`
  ${transition('border', 'box-shadow')};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
//   display: flex;
  margin-right: 2px;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
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

const SortByWrapper = styled.div`
  ${wideFont};
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;
class TestFilter extends Component {
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
        <SortByWrapper>{'sort'}</SortByWrapper>
        <FormWrapper>
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
        </FormWrapper>
      </Wrapper>
    );
  }
}

export default TestFilter;

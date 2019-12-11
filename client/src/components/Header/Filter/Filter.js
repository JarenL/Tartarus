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
import CategoryMenu from '../CategoryMenu/Container';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.foreground};
  // @media (max-width: 768px) {
  //   display: none;
  // }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: auto;
  width: 55%;
`;

const StyledForm = styled(Form)`
  padding: 0px;
  width: 100%;
  margin-left: 8px;
  background-color: ${props => props.theme.foreground};
  font-size: 12px;
  color: ${props => props.theme.normalText};
  appearance: none;
`;

class Filter extends Component {
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
        <CategoryMenu />
        <FormWrapper>
          <StyledForm>
            <Field name='type' type='select' component={renderField}>
              {this.mapTypeCategories()}
            </Field>
          </StyledForm>
          <StyledForm>
            <Field
              name='time'
              label={null}
              type='select'
              component={renderField}
            >
              {this.mapTimeCategories()}
            </Field>
          </StyledForm>
        </FormWrapper>
      </Wrapper>
    );
  }
}

export default Filter;

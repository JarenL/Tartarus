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
import CategoryMenu from '../../CategoryMenu/Container';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 6.5%;
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
  justify-content: flex-end;
  width: 50%;
  // margin: 3px;
`;

const StyledForm = styled(Form)`
  // border: 1px solid ${props => props.theme.border};
  // border-radius: 3px;
  // width: 100%;
  padding: 0px;
  margin-left: 10px;
  background-color: ${props => props.theme.foreground};
  font-size: 12px;
  color: ${props => props.theme.normalText};
  appearance: none;
  // @media (hover: hover) {
  //   :hover {
  //     border: 1px solid ${props => props.theme.accent};
  //   }
  // }
`;

const SortByWrapper = styled.div`
  ${wideFont};
  align-items: center;
  // padding: 12px;
  color: ${props => props.theme.mutedText};
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
        {/* <SortByWrapper>{'sort'}</SortByWrapper> */}
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

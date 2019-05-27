import React from 'react';
import { Field } from 'redux-form';
import Form from '../shared/form/Form';
import renderField from '../shared/form/renderField';
import SubmitButton from '../shared/form/SubmitButton';
import CancelButton from '../shared/form/CancelButton';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

class ReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    return (
      <Form
        loading={this.state.loading}
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
        wide
      >
        <Field
          name='reason'
          label='reason'
          type='text'
          component={renderField}
          // validate={this.props.forumNameValidator}
        />
        <Wrapper>
          <SubmitButton />
          <CancelButton onClick={this.handleCancel} />
        </Wrapper>
      </Form>
    );
  }
}

export default ReportForm;

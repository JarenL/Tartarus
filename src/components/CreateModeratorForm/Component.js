import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../components/shared/form/renderField';
// import Form from '../../../../shared/form/Form';
import SubmitButton from '../shared/form/SubmitButton';
import CancelButton from '../shared/form/CancelButton';
import styled from 'styled-components/macro';
import TartarusContract from '../../contracts/Tartarus.json';
import Checkbox from '../shared/form/Checkbox/Checkbox';
import Label from '../shared/form/Label';
import { transition } from '../shared/helpers';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import CheckButton from '../shared/form/CheckButton';
import ValidIcon from '../shared/form/ValidIcon';
import InvalidIcon from '../shared/form/InvalidIcon';
import { withRouter } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const UsernameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  margin-top: 5px;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  // align-self: flex-end;
  // height: 100%;
  justify-content: center;
  align-items: center;
  // margin-left: 4px;
  // margin-top: 2px;
`;

const StyledForm = styled.form`
  ${transition('filter')};

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${props =>
    props.loading &&
    'filter: grayscale(0.5) blur(5px) opacity(0.6); pointer-events: none'};
`;

const FormWrapper = styled.div`
  position: relative;
  overflow: hidden;
  // margin: 0 auto;
  // border: 1px solid ${props => props.theme.border};
  border-radius: 2px;
  // max-width: ${props => (props.wide ? '600px' : '375px')};
  padding: 12px;
  background-color: ${props => props.theme.foreground};

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: ${props => (props.wide ? '600px' : '375px')}) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const TextWrapper = styled.div`
  width: 20%;
  margin-bottom: 2px;
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
`;

const Form = ({ className, wide, ...props }) => (
  <FormWrapper className={className} wide={wide}>
    <StyledForm {...props} />
    {props.loading && <LoadingIndicatorSpinner />}
  </FormWrapper>
);

class CreateModeratorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wage: 0,
      permissions: [false, false, false, false, false, false]
    };
  }

  componentWillUnmount = () => {
    this.props.reset('createModerator');
  };

  handleSubmit = () => {
    console.log(this.state.permissions.slice(0, 6));
    console.log(this.props.targetUser.values.targetUser);
    console.log(this.props.forumName)
    this.setState({
      laoding: true
    });
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.createModerator
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            this.props.web3.utils.fromAscii(this.props.targetUser.values.targetUser),
            this.state.permissions,
            this.state.wage,
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(result => {
            console.log(result);
            this.setState({
              loading: false
            });
          })
          .catch(error => {
            console.log('error');
            this.setState({
              loading: false
            });
          });
      });
    });
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  togglePermission = props => {
    const newPermissions = this.state.permissions.slice(); //copy the array
    newPermissions[props] = !this.state.permissions[props]; //execute the manipulations
    this.setState({
      permissions: newPermissions
    });
  };

  handleWageChange = event => {
    this.setState({
      wage: event.target.value
    });
  };

  render() {
    console.log(this.props.userPermissions);
    return (
      <Form
        loading={this.state.loading}
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
        wide
      >
        <FieldWrapper>
          <Field
            name='targetUser'
            label='New Moderator'
            type='text'
            component={renderField}
            validate={this.props.usernameValidator}
            onChange={this.handleChange}
          />
        </FieldWrapper>
        <Label>
          <Checkbox
            checked={this.state.permissions[0]}
            onChange={() => this.togglePermission(0)}
          />
          {' Full Moderator'}
        </Label>
        <Label>
          <Checkbox
            checked={this.state.permissions[1]}
            onChange={() => this.togglePermission(1)}
          />
          {' Access'}
        </Label>
        <Label>
          <Checkbox
            checked={this.state.permissions[2]}
            onChange={() => this.togglePermission(2)}
          />
          {' Config'}
        </Label>
        <Label>
          <Checkbox
            checked={this.state.permissions[3]}
            onChange={() => this.togglePermission(3)}
          />
          {' Mail'}
        </Label>
        <Label>
          <Checkbox
            checked={this.state.permissions[4]}
            onChange={() => this.togglePermission(4)}
          />
          {' Flair'}
        </Label>
        <Label>
          <Checkbox
            checked={this.state.permissions[5]}
            onChange={() => this.togglePermission(5)}
          />
          {' Posts'}
        </Label>

        <Wrapper>
          <TextWrapper>
            <Field
              name='wage'
              label='wage %'
              type='permissionsText'
              component={renderField}
              input={this.state.wage}
              handleInput={this.handleWageChange}
              // validate={this.props.forumNameValidator}
            />
          </TextWrapper>
          <ButtonWrapper>
            <SubmitButton />
            <CancelButton onClick={this.handleCancel} />
          </ButtonWrapper>
        </Wrapper>
      </Form>
    );
  }
}

export default withRouter(CreateModeratorForm);

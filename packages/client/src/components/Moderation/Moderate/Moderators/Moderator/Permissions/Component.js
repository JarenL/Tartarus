import React from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../../../../../shared/form/renderField';
// import Form from '../../../../shared/form/Form';
import styled from 'styled-components/macro';
import TartarusContract from '../../../../../../contracts/Tartarus.json.js';
import Checkbox from '../../../../../shared/form/Checkbox/Checkbox';
import Label from '../../../../../shared/form/Label';
import { transition } from '../../../../../shared/helpers';
import LoadingIndicatorSpinner from '../../../../../shared/LoadingIndicator/Spinner';
import RemoveModeratorButton from './RemoveModerator';
import SubmitButton from '../../../../../Buttons/SubmitButton';
import CancelButton from '../../../../../Buttons/CancelButton';
import { warningToast, confirmToast, errorToast } from '../../../../../Notifications/Toasts/Toast';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
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

const items = ['One', 'Two', 'Three'];

class Permissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      canEdit: false,
      permissions: this.props.permissions
    };
  }

  handleSubmit = () => {
    console.log(this.state.permissions.slice(0, 6));
    console.log(this.props.moderator);
    this.setState({
      laoding: true
    });
    warningToast();
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.updateModeratorPermissions
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            this.props.web3.utils.fromAscii(this.props.moderator),
            this.state.permissions.slice(0, 6),
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
            confirmToast();
          })
          .catch(error => {
            console.log('error');
            this.setState({
              loading: false
            });
            errorToast();
          });
      });
    });
  };

  componentWillUnmount = () => {
    this.setState({
      permissions: this.props.permissions
    });
  };

  togglePermission = props => {
    console.log(this.props.permissions[0]);
    if (this.props.userPermissions.moderator[0]) {
      const newPermissions = this.state.permissions.slice(); //copy the array
      newPermissions[props] = !this.state.permissions[props]; //execute the manipulations
      this.setState({
        permissions: newPermissions
      });
    }
  };

  handleWageChange = event => {
    console.log(event.target.value);
    if (this.props.userPermissions.moderator[0]) {
      const newPermissions = this.state.permissions.slice(); //copy the array
      newPermissions[6].c[0] = event.target.value; //execute the manipulations
      this.setState({
        permissions: newPermissions
      });
    }
  };

  handleRemoveModerator = () => {
    this.setState({
      laoding: true
    });
    console.log(this.props.web3.utils.fromAscii(this.props.moderator));
    console.log(this.props.web3.utils.fromAscii(this.props.forumName))
    console.log(this.props.web3.utils.fromAscii(this.props.username))
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.removeModerator
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.web3.utils.fromAscii(this.props.forumName),
            this.props.web3.utils.fromAscii(this.props.moderator),
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

  render() {
    console.log(this.props.userPermissions);
    return (
      <Form
        loading={this.state.loading}
        onSubmit={this.props.handleSubmit(this.handleSubmit)}
        wide
      >
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
        <TextWrapper>
          <Field
            name='wage'
            label='wage %'
            type='permissionsText'
            component={renderField}
            input={this.state.permissions[6].c[0]}
            handleInput={this.handleWageChange}
            disabled={this.props.userPermissions.moderator[0]}
            // validate={this.props.forumNameValidator}
          />
        </TextWrapper>

        <Wrapper>
          <RemoveModeratorButton removeModerator={this.handleRemoveModerator} />
          {this.props.userPermissions.moderator[0] ? (
            <ButtonWrapper>
              <SubmitButton />
              <CancelButton onClick={this.props.togglePermissions} />
            </ButtonWrapper>
          ) : null}
        </Wrapper>
      </Form>
    );
  }
}

export default Permissions;

import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import styled from 'styled-components/macro';
import Form from '../../../shared/form/Form';
import renderField from '../../../shared/form/renderField';
import { Field } from 'redux-form';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';
import SubmitButton from '../../../Buttons/SubmitButton';
import CancelButton from '../../../Buttons/CancelButton';
import EditButton from '../../../Buttons/EditButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

const services = require('../../../../services');

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: null,
      rules: null,
      editing: false,
      loading: false
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  componentWillUnmount = () => {
    this.props.reset('editForum');
  };

  toggleEdit = () => {
    console.log('hello')
    this.setState({
      editing: !this.state.editing
    })
  }

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const bs58 = require('bs58');
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        instance.forums
          .call(this.props.web3.utils.fromAscii(this.props.forumName))
          .then(forum => {
            console.log(forum);
            if (
              forum[2] ===
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            ) {
              this.setState({
                loading: false,
                exists: false
              });
            } else {
              const forumInfoHex = '1220' + forum[1].slice(2);
              const forumInfoBytes = Buffer.from(forumInfoHex, 'hex');
              const forumInfoHash = bs58.encode(forumInfoBytes);
              services.ipfs.getJson(forumInfoHash).then(forumInfo => {
                console.log(forumInfo);
                if (forumInfo.description) {
                  this.setState({
                    description: forumInfo.description
                  });
                } else {
                  this.setState({
                    description: 'None'
                  });
                }
                if (forumInfo.rules) {
                  this.setState({
                    rules: forumInfo.rules,
                    loading: false
                  });
                } else {
                  this.setState({
                    rules: 'None',
                    loading: false
                  });
                }
              });
            }
          });
      })
      .catch(err => {
        console.log('error');
      });
  };

  handleSubmit = async () => {
    this.setState({
      loading: true
    });
    let forumInfoObject = {
      description: this.props.form.editForum.values.forumDescription,
      rules: this.props.form.editForum.values.forumRules
    };
    const forumInfoIpfsHash = await services.ipfs.uploadObject(forumInfoObject);
    const bs58 = require('bs58');
    const forumInfoBytes32 =
      '0x' +
      bs58
        .decode(forumInfoIpfsHash)
        .slice(2)
        .toString('hex');
    this.editForum({
      forumInfo: forumInfoBytes32
    });
  };

  handleCancel = () => {
    this.props.reset('editForum');
    this.setState({
      editing: !this.state.editing
    })
  }

  editForum = props => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.updateForum
          .sendTransaction(
            this.props.web3.utils.fromAscii(this.props.username),
            this.props.forumName,
            props.forumInfo,
            {
              from: accounts[0],
              gasPrice: 20000000000
            }
          )
          .then(result => {
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
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (
        (this.props.userPermissions.moderator[0] ||
        this.props.userPermissions.moderator[2]) && this.state.editing
      ) {
        return (
          <Form
            loading={this.state.loading}
            onSubmit={this.props.handleSubmit(this.handleSubmit)}
            wide
          >
            <Field
              name='forumDescription'
              label='forum description'
              type='editor'
              component={renderField}
              validate={this.props.forumDescriptionValidator}
              placeholder={'test'}
              defaultValue={this.state.description}
            />
            <Field
              name='forumRules'
              label='forum rules'
              type='editor'
              component={renderField}
              validate={this.props.forumInfoValidator}
              placeholder={'test'}
              defaultValue={this.state.rules}
            />
            <Wrapper>
              <SubmitButton />
              <CancelButton onClick={this.handleCancel} />
            </Wrapper>
          </Form>
        );
      } else {
        console.log(this.state.rules);
        return (
          <Form
            loading={this.state.loading}
            onSubmit={this.props.handleSubmit(this.toggleEdit)}
            wide
          >
            <Field
              name='forumDescription'
              label='forum description'
              type='textarea'
              component={renderField}
              input={{
                disabled: true,
                value: ReactHtmlParser(this.state.description)
              }}
            />
            <Field
              name='forumRules'
              label='forum rules'
              type='textarea'
              component={renderField}
              input={{
                disabled: true,
                value: ReactHtmlParser(this.state.rules)
              }}
            />
            <Wrapper>
              <EditButton />
            </Wrapper>
          </Form>
        );
      }
    }
  }
}

export default Info;

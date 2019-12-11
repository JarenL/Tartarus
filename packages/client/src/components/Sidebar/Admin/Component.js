import React, { Component } from 'react';
import TartarusContract from '../../../contracts/Tartarus.json.js';
import styled from 'styled-components/macro';
import { withRouter } from 'react-router-dom';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest.js.js';
import AdminList from './AdminList';
import AdminHeader from './AdminHeader';
import NotAuthorized from '../../shared/NotAuthorized.js.js';
import Divider from '../Divider.js.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  // width: 100%;
  // border: 1px solid ${props => props.theme.border};
  // background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

class AdminSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isAdmin: false
    };
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.isAdmin
          .call(this.props.web3.utils.fromAscii(this.props.username), {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(isAdmin => {
            console.log(isAdmin);
            this.setState({
              isAdmin: isAdmin,
              loading: false
            });
          });
      });
    });
  };

  createAdmin = () => {
    this.props.history.push(`/admin/admins/create`);
  };

  render() {
    if (this.state.loading) {
      return (
        <Wrapper>
          <LoadingTest />
        </Wrapper>
      );
    } else {
      if (!this.state.isAdmin) {
        return <NotAuthorized />;
      } else {
        return (
          <Wrapper>
            <AdminHeader
              userPermissions={this.props.userPermissions.admin[0]}
              createAdmin={this.createAdmin}
              forumName={this.props.forumName}
            />
            <Divider />
            <AdminList />
          </Wrapper>
        );
      }
    }
  }
}

export default withRouter(AdminSidebar);

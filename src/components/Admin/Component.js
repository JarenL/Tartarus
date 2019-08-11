import React, { Component } from 'react';
import styled from 'styled-components/macro';
// import { Route, Switch } from 'react-router-dom';
import Empty from '../shared/Empty';
// import ModeratorsContainer from './Admins/Container';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
// import CreateModeratorFormContainer from '../CreateModeratorForm/Container';
import NotAuthorized from '../shared/NotAuthorized';
import ActivityContainer from './Activity/Container';
import AdminsContainer from './Admins/Container';
import CreateAdminFormContainer from '../CreateAdminForm/Container';
import ComingSoon from '../shared/ComingSoon';
import BannedContainer from './Banned/Container';
// import InfoContainer from './Info/Container';
// import BannedContainer from './Banned/Container';
// import RemovedContainer from './Removed/Container';
// import ReportsContainer from './Reports/Container';

const Wrapper = styled.div`
  display: flex;
  height: auto;
  background-color: ${props => props.theme.foreground};
`;

const Space = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 10px;
  background-color: ${props => props.theme.pageBackground};
`;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModerator: false,
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    console.log(this.props.username);
    this.props.web3.eth.getAccounts((error, accounts) => {
      tartarus.at(this.props.tartarusAddress).then(instance => {
        instance.isAdmin
          .call(this.props.web3.utils.fromAscii(this.props.username), {
            from: accounts[0],
            gasPrice: 20000000000
          })
          .then(isAdmin => {
            if (isAdmin) {
              instance.getAdmin
                .call(this.props.web3.utils.fromAscii(this.props.username), {
                  from: accounts[0],
                  gasPrice: 20000000000
                })
                .then(admin => {
                  console.log(admin);
                  this.setState({
                    isAdmin: true,
                    loading: false
                  });
                });
            } else {
              this.setState({
                loading: false
              });
            }
          });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicatorSpinner />;
    } else {
      if (this.state.isAdmin) {
        switch (this.props.type) {
          case 'activity':
            return <ActivityContainer />;
          case 'admins':
            return <AdminsContainer />;
          case 'info':
            // return <InfoContainer />;
            return <ComingSoon />;

          case 'banned':
            return <BannedContainer />;
          case 'create':
            return (
              <>
                <CreateAdminFormContainer />
                <Space />
                <AdminsContainer />
              </>
            );
          // case 'removed':
          //   return <RemovedContainer />;
          // case 'reports':
          //   return <ReportsContainer />;

          default:
            return <Empty />;
        }
      } else {
        return <NotAuthorized />;
      }
    }
  }
}

export default Admin;

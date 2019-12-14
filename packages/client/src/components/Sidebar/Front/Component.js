import React, { Component } from 'react';
import styled from 'styled-components/macro';
import CreateForumButton from '../../Buttons/CreateForum';
import { withRouter } from 'react-router-dom';
import FrontHeader from './FrontHeader.js';
import TartarusContract from '../../../contracts/Tartarus.json';
import TartarusAdmins from './TartarusAdmins';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest';
import Divider from '../Divider';
import TrendingContainer from '../Trending/TrendingContainer';
import SearchContainer from '../../Header/Search/SearchContainer';

const services = require('../../../services');

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  // background-color: ${props => props.theme.foreground};
`;

class FrontSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showDescription: true,
      showRules: true,
      showAdmins: true,
      description: 'None',
      rules: 'None',
      time: null,
      admin: true,
      admins: null
    };
  }

  componentDidMount() {
    this.instantiateContract();
  }

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    const bs58 = require('bs58');
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let tartarusInfo = await instance.tartarusInfo.call();
    console.log(tartarusInfo);
    // const tartarusInfoHex = '1220' + tartarusInfo.slice(2);
    // const tartarusInfoBytes = Buffer.from(tartarusInfoHex, 'hex');
    // const tartarusInfoHash = bs58.encode(tartarusInfoBytes);
    // tartarusInfo = await services.ipfs.getJson(tartarusInfoHash);
    if (tartarusInfo.description) {
      this.setState({
        description: tartarusInfo.description
      });
    } else {
      this.setState({
        description: 'None'
      });
    }
    if (tartarusInfo.rules) {
      this.setState({
        rules: tartarusInfo.rules
      });
    } else {
      this.setState({
        rules: 'None'
      });
    }

    let admins = await instance.getAdmins.call();
    console.log(admins);
    this.setState({
      loading: false,
      admins: admins
    });
  };

  createForumHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push(`/createforum`);
    }
  };

  adminHandler = () => {
    if (this.props.username === null) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/admin');
    }
  };

  toggleShowDescription = () => {
    this.setState({ showDescription: !this.state.showDescription });
  };

  toggleShowRules = () => {
    this.setState({ showRules: !this.state.showRules });
  };

  toggleShowAdmins = () => {
    this.setState({ showAdmins: !this.state.showAdmins });
  };

  render() {
    // if (this.state.loading) {
    //   return (
    //     <Wrapper>
    //       <LoadingTest />
    //     </Wrapper>
    //   );
    // } else {
      return (
        <Wrapper>
          <SearchContainer />
          <CreateForumButton createForumHandler={this.createForumHandler} />
          {/* {this.props.username === null ? <FrontHeader /> : null} */}
          {/* <Divider /> */}
          <TrendingContainer />
          <Divider />
          <TartarusAdmins
            username={this.props.username}
            showAdmins={this.state.showAdmins}
            toggleShowAdmins={this.toggleShowAdmins}
            admins={this.state.admins}
            web3={this.props.web3}
          />
        </Wrapper>
      );
    }
  // }
}

export default withRouter(FrontSidebar);

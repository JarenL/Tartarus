import React from 'react';
import Empty from '../../../shared/Empty';
import TartarusContract from '../../../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../../../shared/LoadingIndicator/Spinner';
import ReactList from 'react-list';
import WagesContainer from './Wages/Container';
import styled from 'styled-components/macro';
import AdminContainer from './Admin/Container';

const Space = styled.div`
  display: flex;
  width: 100%;
  height: 10px;
  background-color: ${props => props.theme.pageBackground};
`;

class Admins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let admins = await instance.getAdmins.call();
    this.setState({
      loading: false,
      admins: admins
    });
  };

  renderItem(index, key) {
    return <AdminContainer key={key} admin={this.state.admins[index]} />;
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.admins || this.state.admins.length === 0) {
      return <Empty />;
    } else {
      console.log(this.state.admins);
      return (
        <>
          <WagesContainer admins={this.state.admins} />
          <Space />
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
            length={this.state.admins.length}
            type='simple'
          />
        </>
      );
    }
  }
}

export default Admins;

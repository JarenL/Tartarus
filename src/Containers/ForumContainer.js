import React, { Component } from 'react';
import { connect } from 'react-redux';
import Forum from '../Components/Drawer/Forum';

class ForumContainer extends Component {
    render() {
        return (
            <Forum
                name={this.props.name} 
                address = {this.props.address}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        web3: state.web3,
        accounts: state.accounts,
        tartarusAddress: state.tartarus.tartarusAddress,
    };
}

export default connect(mapStateToProps)(ForumContainer);

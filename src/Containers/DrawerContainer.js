import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuthDrawer from '../Components/Drawer/AuthDrawer';
import UnauthDrawer from '../Components/Drawer/UnauthDrawer';

class DrawerContainer extends Component {
    render() {
        if (this.props.accounts.currentUserAddress === "0" || !this.props.accounts.currentUserAddress || this.props.accounts.currentUserAddress === undefined) {
            return (
                <div>
                    <UnauthDrawer/>
                </div>
            )

        } else {
            return (
                <div>
                    <AuthDrawer />
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        accounts: state.accounts,
    };
}

export default connect(mapStateToProps)(DrawerContainer);

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Forum from '../Components/Forum';

export default class ForumContainer extends Component {
    static propTypes = {
        prop: PropTypes
    }

    render() {
        return (
            <Forum
                name={this.props.name} 
                address = {this.props.address}/>
        )
    }
}

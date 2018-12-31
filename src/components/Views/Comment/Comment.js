import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import TimeAgo from 'timeago-react';

const header = {
    height: '15%',
	paddingTop: '15px',
	paddingBottom: '18px',
    paddingLeft: '20px',
    paddingRight: '20px',
	margin: '0px',
};
const cAddress = {
    fontWeight: 'bold',
	fontSize: '12px',
	color: '#6A6A6A',
	display: 'inline-block',
    paddingTop: '0px',
    marginTop: '0px',
};
const date = {
    fontSize: '12px',
    color: 'grey',
    display: 'inline-block',
    paddingLeft: '4px',
    paddingTop: '0px',
    marginTop: '0px',
};
const comment = {
    fontWeight: 'bold',
	fontSize: '15px',
	paddingTop: '0px',
    paddingBottom: '0px',
    paddingRight: '20px',
	margin: '0px',

};
const address = {
    fontSize: '12px',
	color: 'grey',
	display: 'inline-block',
    paddingBottom: '0px',
    marginBottom: '0px',
};
const target = {
    fontSize: '12px',
	color: 'grey',
	display: 'inline-block',
    paddingBottom: '0px',
    paddingLeft: '4px',
    marginBottom: '0px',
};

export default class Comment extends Component {
    render() {
        return (
            <Card className="comment" style={{ borderRadius: '10px', marginTop:'0px', marginBottom: '15px'}}>
                <div style={header}>
                    <p style={cAddress}>Created by {this.props.creator}</p>
                    <p style={date}><TimeAgo datetime={this.props.time}/></p>
                    <p style={comment}>{this.props.comment}</p>
                    <p style={address}>Address: {this.props.address}</p>
                    <p style={target}>Target: {this.props.target}</p>
                </div>
            </Card>
        )
    }
}

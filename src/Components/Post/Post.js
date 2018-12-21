import React, { Component } from 'react'
import { Card } from '@material-ui/core';
import color from '@material-ui/core/colors';


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
const title = {
    fontWeight: 'bold',
	fontSize: '15px',
	paddingTop: '0px',
    paddingBottom: '0px',
    paddingRight: '20px',
	margin: '0px',

};
const pAddress = {
    fontSize: '12px',
	color: 'grey',
	display: 'inline-block',
    paddingBottom: '0px',
    marginBottom: '0px',
};

export default class Post extends Component {
    render() {
        return (
            <Card className="post" style={{ borderRadius: '10px', marginTop: '0px', marginBottom: '15px' }} >
                <div style={header}>
                    <p style={cAddress}>Created by {this.props.creator}</p>
                    <p style={date}>{this.props.date}</p>
                    <p style={title}>{this.props.title}</p>
                    <p style={pAddress}>Post Address: {this.props.address}</p>
                </div>
            </Card>
        )
    }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Post);
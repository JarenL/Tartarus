import React, { Component } from 'react';
import { Card } from '@material-ui/core';

export default class Comment extends Component {
    render() {
        return (
            <Card className="comment">
                <div>
                    <p>Comment - {this.props.comment}</p>
                    <p>Address - {this.props.address}</p>
                    <p>Creator Address - {this.props.creator}</p>
                    <p>Target - {this.props.target}</p>
                    <p>Time - {this.props.time}</p>
                </div>
            </Card>
        )
    }
}

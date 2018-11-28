import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import CreateCommentOnCommentDialog from '../Dialog/CreateCommentOnCommentDialog'
export default class Comment extends Component {
    render() {
        return (
            <Card className="comment">
                <div>
                    <p>Comment - {this.props.comment}</p>
                    <p>Address - {this.props.address}</p>
                    <p>Creator Address - {this.props.creator}</p>
                    <p>Target - {this.props.target}</p>
                    <p>Date - {this.props.date}</p>
                </div>
                <CreateCommentOnCommentDialog target={this.props.address}/>
            </Card>

        )
    }
}

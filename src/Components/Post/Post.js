import React, { Component } from 'react'
import { Card } from '@material-ui/core';

export default class Post extends Component {
    render() {
        return (
            <Card className="post">
                <div>
                    <p>Title - {this.props.title}</p>
                    <p>Address - {this.props.address}</p>
                    <p>Creator Address - {this.props.creator}</p>
                    <p>Date - {this.props.date}</p>
                   
                </div>
            </Card>
        )
    }
}

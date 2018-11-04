import React, { Component } from 'react';
import { Card } from '@material-ui/core';

const PostContainer = (props) => {
    return (
        <Card className="Match">
            <div>
                <p>Title - {props.title}</p>
                <p>Address - {props.address}</p>
                <p>Owner Address - {props.owner}</p>
            </div>
        </Card>
    )
};

export default PostContainer;

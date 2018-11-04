import React, { Component } from 'react';
import { Card } from '@material-ui/core';

const PostContainer = (props) => {
    return (
        <Card className="Match">
            <div>
                <p>{props.title}</p>
                <p>{props.address}</p>
                <p>{props.owner}</p>

            </div>
        </Card>
    )
};

export default PostContainer;

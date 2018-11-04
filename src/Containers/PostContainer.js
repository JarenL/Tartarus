import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import '../css/Post.css';

const PostContainer = (props) => {
    return (
        <Card className="Post">
            <div>
                <p>Title - {props.title}</p>
                <p>Address - {props.address}</p>
                <p>Owner Address - {props.owner}</p>
            </div>
        </Card>
    )
};

export default PostContainer;

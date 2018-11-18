import React from 'react';
import { Card } from '@material-ui/core';

const PostContainer = (props) => {
    return (
        <Card className="post">
            <div>
                <p>Title - {props.title}</p>
                <p>Address - {props.address}</p>
                <p>Owner Address - {props.owner}</p>
            </div>
        </Card>
    )
};

export default PostContainer;

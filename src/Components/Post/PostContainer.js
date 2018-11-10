import React from 'react';
import { Card } from '@material-ui/core';
import CreateCommentButton from '../Buttons/CreateCommentButton'

const PostContainer = (props) => {
    return (
        <Card className="post">
            <div>
                <p>Title - {props.title}</p>
                <p>Address - {props.address}</p>
                <p>Owner Address - {props.owner}</p>
            </div>
            <CreateCommentButton />
        </Card>
    )
};

export default PostContainer;

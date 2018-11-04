import React from 'react';
import PostContainer from '../Containers/PostContainer';

const PostList = (props) => {
    const postContainers = props.posts.map(post => {
        return (
            <div key={post.address}>
                <PostContainer
                    address={post.address}
                    owner={post.author}
                    title={post.title} />
            </div>
        )
    });
    return (
        <div>
            {postContainers}
        </div>
    );
}

export default PostList
import React, {Component} from 'react';
import PostContainer from '../Containers/PostContainer';

export default class Forum extends Component {
    render() {
        const postContainers = this.props.posts.map(post => {
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
}


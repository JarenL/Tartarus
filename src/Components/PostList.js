import React, {Component} from 'react';
import PostContainer from '../Containers/PostContainer';
import { Route, Link, MemoryRouter } from "react-router-dom";

export default class Forum extends Component {
    render() {
        const postContainers = this.props.posts.map(post => {
            return (
                <Link to={"/post/" + post.address} style={{ textDecoration: 'none', color:'black' }}>
                <div key={post.address}>
                    <PostContainer
                        address={post.address}
                        owner={post.author}
                        title={post.title} />
                </div>
                </Link>
            )
        });
        return (
            <div>
                {postContainers}
            </div>
        );
    }
}


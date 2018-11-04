import React, { Component } from 'react';
import PostList from '../Components/PostList';
import { connect } from 'react-redux';
import ForumContract from '../../build/contracts/Forum.json';
import CreatePostDialog from '../Components/Dialog/CreatePostDialog'

class PostListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
        }
        this.instantiateContract = this.instantiateContract.bind(this);
    }

    componentDidMount = () => {
      this.instantiateContract();
    }

    // event PostCreated (address postAddress, string posttitle, address postOwner, uint timestamp);  

    instantiateContract() {
        const contract = require('truffle-contract')
        const forum = contract(ForumContract)
        forum.setProvider(this.props.web3.currentProvider)
        forum.at(this.props.currentForumAddress).then((instance) => {
            const postCreationEvent = instance.allEvents({ fromBlock: 0, toBlock: 'latest' });
            postCreationEvent.watch((error, result) => {
              if (!error) {
                if (result.event === "PostCreated") {
                  console.log("hello")
                  let newPostArray = this.state.posts.slice();
                  newPostArray.push({
                      address: result.args.postAddress,
                      title: result.args.postTitle,
                      author: result.args.postOwner
                  });
                  this.setState({
                      posts: newPostArray
                  });
                  console.log(newPostArray);
                }
              }
                
            })
        })
      }

    render() {
        if (this.props.currentForumAddress === "0" || !this.props.currentForumAddress || this.props.currentForumAddress === undefined) {
            return (
                <div>
                    <PostList posts={this.state.posts} />
                </div>
            );
        } else {
            return (
                <div>
                    <CreatePostDialog />
                    <PostList posts={this.state.posts} />
                </div>

            )
        }

    }
}

function mapStateToProps(state) {
    return {
        web3: state.web3,
        tartarusAddress: state.tartarus.tartarusAddress,
        accounts: state.accounts,
        currentForum: state.forum.currentForum,
        currentForumAddress: state.forum.currentForumAddress

    };
}

export default connect(mapStateToProps)(PostListContainer);

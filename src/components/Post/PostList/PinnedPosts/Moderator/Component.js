import React from 'react';
import Empty from '../../../../shared/Empty';
import TartarusContract from '../../../../../contracts/Tartarus.json';
import ReactList from 'react-list';
import PostListItem from '../../Item';
import LoadingIndicatorSpinner from '../../../../shared/LoadingIndicator/Spinner';

const blocksInDay = 5760;

class ModeratorPinnedPostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
      // loading: true
      // sorted: false,
      // latest: null
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  componentDidUpdate = (newProps, oldProps) => {
    if (newProps.time !== this.props.time) {
      this.setState({
        loading: true
      });
      this.instantiateContract();
    }

    if (newProps.type !== this.props.type) {
      this.setState({
        loading: true
      });
      this.instantiateContract();
    }

    if (newProps.username !== this.props.username) {
      this.setState({
        loading: true
      });
      this.instantiateContract();
    }
  };

  instantiateContract = async () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let pinnedPosts = await instance.getForumPinnedPosts(
      this.props.web3.utils.fromAscii(this.props.forumName)
    );
    console.log(pinnedPosts);
    let posts = [];
    pinnedPosts = pinnedPosts.filter(
      i =>
        i !==
        '0x0000000000000000000000000000000000000000000000000000000000000000'
    );
    let getPosts = new Promise((resolve, reject) => {
      pinnedPosts.forEach((post, index) => {
        instance
          .PostCreated({ postId: post }, { fromBlock: 0, toBlock: 'latest' })
          .get((error, result) => {
            console.log(result);
            posts.push(result[0]);
            resolve();
          });
      });
    });
    getPosts.then(() => {
      this.setState({
        posts: posts,
        loading: false
      });
    });
    console.log(pinnedPosts);

    // return results;
  };

  renderItem(index, key) {
    console.log(this.state.posts);
    return <PostListItem key={key} post={this.state.posts[index].args} />;
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return null;
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.state.posts.length}
        type='simple'
      />
    );
  }
}

export default ModeratorPinnedPostList;

import React from 'react';
import Empty from '../shared/Empty';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import PostListItem from '../Post/PostList/Item';
import ReactList from 'react-list';

const search = require('ipfsearch-webapp');

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      searchResults: []
      // posts: []
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  // getSearchResults = async () => {
  //   return new Promise((resolve, reject) => {
  //     // let test = search.search(this.props.search);
  //     // console.log(test);
  //     resolve(search.search(this.props.search));
  //   });
  // };

  instantiateContract = async () => {
    // console.log(this.props)
    // console.log(await search.search(this.props.search));
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    let instance = await tartarus.at(this.props.tartarusAddress);
    let query = await search.IndexSearch(this.props.search);
    console.log(query);
    // let posts = [];
    let posts = await Promise.all(
      query.map(post => {
        return new Promise((resolve, reject) => {
          instance
            .PostCreated(
              { postId: post.id },
              { fromBlock: 0, toBlock: 'latest' }
            )
            .get((error, result) => {
              console.log(result);
              // posts.push(result[0]);
              resolve(...result);
            });
        });
      })
    );
    this.setState({
      searchResults: posts,
      loading: false
    });
    // let getPosts = new Promise((resolve, reject) => {
    //   query.forEach((post, index) => {
    //     console.log(post)
    //     instance
    //       .PostCreated({ postId: post.id }, { fromBlock: 0, toBlock: 'latest' })
    //       .get((error, result) => {
    //         console.log(result);
    //         posts.push(result[0]);
    //         resolve();
    //       });
    //   });
    // });
    // getPosts.then(() => {
    //   console.log(posts);
    //   this.setState({
    //     searchResults: posts,
    //     loading: false
    //   });
    // });
    // console.log(pinnedPosts);
  };

  renderItem(index, key) {
    return (
      <PostListItem key={key} post={this.state.searchResults[index].args} />
    );
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (
      !this.state.searchResults ||
      this.state.searchResults.length === 0 ||
      this.state.searchResults[0] === undefined
    )
      return <Empty />;
    console.log(this.state.searchResults)
    return (
      <ReactList
        itemRenderer={this.renderItem.bind(this)}
        length={this.state.searchResults.length}
        type='simple'
      />
    );
  }
}

export default SearchResults;

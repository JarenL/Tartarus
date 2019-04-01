import { connect } from 'react-redux';
// import PostList from './PostList';
import React from 'react';
import Empty from '../shared/Empty';
import UserContract from '../../contracts/User.json';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import PostList from './InfinitePostList';

class PostListContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    console.log(this.props);
    if (this.props.forumAddress === undefined) {
      if (this.props.username === undefined) {
        //front page
        const tartarus = contract(TartarusContract);
        tartarus.setProvider(this.props.web3.currentProvider);
        tartarus
          .at(this.props.tartarusAddress)
          .then(instance => {
            instance
              .PostCreated({}, { fromBlock: 0, toBlock: 'latest' })
              .get((error, posts) => {
                this.setState({
                  posts: posts,
                  loading: false
                });
              });
          })
          .catch(err => {
            console.log('error');
          });
      } else {
        const user = contract(UserContract);
        const tartarus = contract(TartarusContract);
        user.setProvider(this.props.web3.currentProvider);
        tartarus.setProvider(this.props.web3.currentProvider);
        this.props.web3.eth.getAccounts((error, accounts) => {
          tartarus.at(this.props.tartarusAddress).then(instance => {
            instance.users
              .call(this.props.username, {
                from: accounts[0],
                gasPrice: 20000000000
              })
              .then(userAddress => {
                tartarus
                  .at(this.props.tartarusAddress)
                  .then(instance => {
                    instance
                      .PostCreated(
                        { creatorAddress: userAddress },
                        { fromBlock: 0, toBlock: 'latest' }
                      )
                      .get((error, posts) => {
                        this.setState({
                          posts: posts,
                          loading: false
                        });
                        console.log(posts)
                      });
                  })
                  .catch(err => {
                    console.log('error');
                  });
              });
          });
        });
      }
    } else {
      //forum page
      const tartarus = contract(TartarusContract);
      tartarus.setProvider(this.props.web3.currentProvider);
      tartarus
        .at(this.props.tartarusAddress)
        .then(instance => {
          instance
            .PostCreated(
              { forumAddress: this.props.forumAddress },
              { fromBlock: 0, toBlock: 'latest' }
            )
            .get((error, posts) => {
              this.setState({
                posts: posts,
                loading: false
              });
            });
        })
        .catch(err => {
          console.log('error');
        });
    }
  };

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.posts || this.state.posts.length === 0) return <Empty />;
    return <PostList posts={this.state.posts} />;
  }
}

export const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress,
  userAddress: state.user.userAddress
});

export default connect(mapStateToProps)(PostListContainer);

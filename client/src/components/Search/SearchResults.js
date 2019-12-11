import React from 'react';
import Empty from '../shared/Empty';
import TartarusContract from '../../contracts/Tartarus.json';
import LoadingIndicatorSpinner from '../shared/LoadingIndicator/Spinner';
import ForumList from '../Forum/ForumList';
import ComingSoon from '../shared/ComingSoon';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forums: [],
      loading: true
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract() {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    console.log(this.props);
    tartarus
      .at(this.props.tartarusAddress)
      .then(instance => {
        console.log(instance);
        instance
          .ForumCreated({}, { fromBlock: 0, toBlock: 'latest' })
          .get((error, forums) => {
            console.log(forums);
            this.setState({
              forums: forums,
              loading: false
            });
          });
      })
      .catch(err => {
        console.log('error');
      });
  }

  render() {
    if (this.state.loading) return <LoadingIndicatorSpinner />;
    if (!this.state.forums || this.state.forums.length === 0) return <Empty />;
    // return <ForumList forums={this.state.forums} />;
    return <ComingSoon />;
  }
}

export default SearchResults;

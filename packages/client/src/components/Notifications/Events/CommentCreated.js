import React, { Component } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DownButton from '../../Buttons/DownButton';
import CloseButton from '../../Buttons/CloseButton';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TartarusContract from '../../../contracts/Tartarus.json';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble';

const EventWrapper = styled.div`
  overflow-wrap: break-word;
  display: flex;
  border-left: none;
  padding: 8px;
  font-size: 12px;
  list-style-position: inside;
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.normalText};
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 15px;
  color: ${props => props.theme.accent};
  &:hover {
    color: ${props => props.theme.normalText};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
  justify-content: center;
  color: ${props => props.theme.mutedText};
`;

class CommentCreated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      forum: null
    };
    this.instantiateContract = this.instantiateContract.bind(this);
  }

  componentDidMount = () => {
    this.instantiateContract();
  };

  instantiateContract = () => {
    const contract = require('truffle-contract');
    const tartarus = contract(TartarusContract);
    tartarus.setProvider(this.props.web3.currentProvider);
    tartarus.at(this.props.tartarusAddress).then(instance => {
      instance
        .PostCreated(
          {
            postId: this.props.postId
          },
          { fromBlock: 0, toBlock: 'latest' }
        )
        .get((error, post) => {
          console.log(post);
          this.setState({
            loading: false,
            forum: this.props.web3.utils.toAscii(post[0].args.forum)
          });
        });
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingBubble />;
    } else {
      console.log(this.props);
      return (
        <EventWrapper>
          <div>
            <StyledLink to={`/u/${this.props.user}`}>
              {this.props.user}
            </StyledLink>
            {' made a '}
            <StyledLink
              to={`/f/${this.state.forum}/p/${this.props.postId}/c/${this.props.commentId}`}
            >
              {' Comment '}
            </StyledLink>
            {' on a '}
            {this.props.postId === this.props.targetId ? (
              <StyledLink to={`/f/${this.state.forum}/p/${this.props.postId}`}>
                {' Post '}
              </StyledLink>
            ) : (
              <StyledLink
                to={`/f/${this.state.forum}/p/${this.props.postId}/c/${this.props.targetId}`}
              >
                {' Comment '}
              </StyledLink>
            )}
            {!this.props.userWatched ? " you're watching " : null}
            {` ${moment(this.props.time).fromNow()}`}
          </div>
          <ButtonWrapper>
            <CloseButton
              size={18}
              onClick={() =>
                this.props.handleClearNotification(this.props.transactionHash)
              }
            />
            {/* <DownButton
              size={18}
              onClick={() => this.props.toggleShowDetails()}
            /> */}
          </ButtonWrapper>
        </EventWrapper>
      );
    }
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  tartarusAddress: state.tartarus.tartarusAddress
});

const enhance = compose(connect(mapStateToProps));

export default enhance(CommentCreated);

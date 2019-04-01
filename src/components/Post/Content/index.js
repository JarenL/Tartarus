import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PostContentTitle from './Title';
import PostContentPreview from './Preview';
import PostContentFullText from './FullText';
import PostContentDetail from './Detail';
import ReactPlayer from 'react-player';
import EmbedWidget from '../EmbedWidget';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-left: 1px solid ${props => props.theme.border};
  padding: 8px;
  min-width: 0;
`;

// const Player = styled(ReactPlayer)`
//   position: absolute;
//   top: 0;
//   left: 0;
// `;

// const PlayerWrapper = styled.div`
//   position: relative;
//   padding-top: 56.25%; /* Player ratio: 100 / (1280 / 720) */
// `;

const renderContent = props => {
  switch (props.type) {
    case 'link':
      return <PostContentPreview>{props.url}</PostContentPreview>;

    case 'text':
      if (props.showFullPost) {
        return <PostContentFullText>{props.text}</PostContentFullText>;
      }
      break;
    default:
      break;
  }
};
class PostContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false
    };
  }

  handlePreview = () => {
    this.setState({
      preview: !this.state.preview
    });
  };

  render() {
    return (
      <Wrapper>
        <PostContentTitle
          // url={url}
          title={this.props.title}
          postAddress={this.props.postAddress}
          forumAddress={this.props.forumAddress}
          // type={type}
          // full={showFullPost}
          // {...details}
        />
        {renderContent({
          showFullPost: this.props.showFullPost,
          type: this.props.type,
          text: this.props.post
        })}
        {/* <PostContentPreview>{this.props.post}</PostContentPreview> */}
        <PostContentDetail
          preview={this.state.preview}
          handlePreview={this.handlePreview}
          commentCount={this.props.commentCount}
          time={this.props.time}
          creator={this.props.creator}
          forumName={this.props.forumName}
          forumAddress={this.props.forumAddress}
          postAddress={this.props.postAddress}
        />
        {this.state.preview && (
          // <PlayerWrapper>
          //   <Player
          //     controls={true}
          //     width='100%'
          //     height='100%'
          //     url='https://ipfs.infura.io/ipfs/QmcM9ByDkCaR3smz3hYob9JJWaAbXna7fSk43vkWQR4uK2/Streamed%20from%20my%20GoPro%20with%20https%20-_live4.io_v%20%23LIVE4gopro-2350426065176752.mp4'
          //   />
          // </PlayerWrapper>
          // <EmbedWidget
          //   url={
          //     'https://ipfs.infura.io/ipfs/QmbWJCHaKEFULo5FmmQgZSppfET7yThk3erBdYaYtkDRmd'
          //   }
          // />
          <EmbedWidget
            url={
              'https://ipfs.infura.io/ipfs/QmcM9ByDkCaR3smz3hYob9JJWaAbXna7fSk43vkWQR4uK2/Streamed%20from%20my%20GoPro%20with%20https%20-_live4.io_v%20%23LIVE4gopro-2350426065176752.mp4'
            }
          />

          // <EmbedWidget
          //   url={
          //     'https://ipfs.io/ipfs/QmbWJCHaKEFULo5FmmQgZSppfET7yThk3erBdYaYtkDRmd'
          //   }
          // />
        )}
      </Wrapper>
    );
  }
}

export default PostContent;

import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PostContentTitle from './Title';
import PostContentPreview from './Preview';
import PostContentFullText from './FullText';
import PostContentDetail from './Detail';
import ReactPlayer from 'react-player';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-left: 1px solid ${props => props.theme.border};
  padding: 8px;
  min-width: 0;
`;

const Player = styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`;

const PlayerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* Player ratio: 100 / (1280 / 720) */
`;

const renderContent = props => {
  switch (props.type) {
    case 'link':
      return <PostContentPreview>{props.url}</PostContentPreview>;

    case 'text':
      if (props.showFullPost) {
        return <PostContentFullText>{props.text}</PostContentFullText>;
      }
      return <PostContentPreview>{props.text}</PostContentPreview>;

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
        {/* {renderContent({ type, url, text, showFullPost })} */}
        {renderContent({
          showFullPost: false,
          type: 'text',
          text: this.props.post
        })}

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
          <PlayerWrapper>
            <Player
              width='100%'
              height='100%'
              url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
            />
          </PlayerWrapper>
        )}
      </Wrapper>
    );
  }
}

export default PostContent;

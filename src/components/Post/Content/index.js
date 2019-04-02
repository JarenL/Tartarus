import React, { Component } from 'react';
import styled from 'styled-components/macro';
import PostContentTitle from './Title';
import PostContentFullText from './FullText';
import PostContentDetail from './Detail';
import EmbedWidget from '../EmbedWidget';
import PostAddress from './PostAddress';
import LoadingBubble from '../../shared/LoadingIndicator/Bubble';
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2
} from 'react-html-parser';
import LinkPreview from './LinkPreview';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-left: 1px solid ${props => props.theme.border};
  padding: 8px;
  min-width: 0;
  justify-content: center;
  alignitems: center;
`;

const renderContent = props => {
  switch (props.type) {
    case 'link':
      return (
        <LinkPreview onClick={() => window.open(props.post)}>
          {ReactHtmlParser(props.post)}
        </LinkPreview>
      );
    case 'text':
      if (props.showFullPost) {
        return <PostContentFullText post={props.post} />;
      }
      break;
    default:
      break;
  }
};

const renderEmbed = props => {
  if (props.preview && props.type === 'link') {
    return <EmbedWidget url={props.post} />;
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
    if (this.props.loading) {
      return <LoadingBubble />;
    } else {
      return (
        <Wrapper>
          <PostContentTitle
            // url={url}
            title={this.props.title}
            postAddress={this.props.postAddress}
            forumAddress={this.props.forumAddress}
            type={this.props.type}
            post={this.props.post}
            full={false}
          />
          {renderContent({
            showFullPost: this.props.showFullPost,
            type: this.props.type,
            post: this.props.post
          })}
          <PostAddress postAddress={this.props.postAddress} />
          <PostContentDetail
            preview={this.state.preview}
            handlePreview={this.handlePreview}
            commentCount={this.props.commentCount}
            time={this.props.time}
            creator={this.props.creator}
            forumName={this.props.forumName}
            forumAddress={this.props.forumAddress}
            postAddress={this.props.postAddress}
            type={this.props.type}
          />
          {renderEmbed({
            post: this.props.post,
            type: this.props.type,
            preview: this.state.preview
          })}
        </Wrapper>
      );
    }
  }
}

export default PostContent;

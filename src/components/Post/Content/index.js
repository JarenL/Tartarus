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

const isIPFS = require('is-ipfs');

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

const {
  isIpfsContent,
  isTorrent,
  linkToIpfsParams,
  ipfsParamsToLink,
  downloadBlob,
  getMediaSourceType
} = require('./util');

const services = require('../../../services');

const ipfsGateway = 'https://ipfs.infura.io/ipfs/';

class PostContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: false,
      link: null,
      content: null,
      isDownloading: false,
      codecsNeeded: false
    };
  }

  handlePreview = () => {
    this.setState({
      preview: !this.state.preview
    });
  };

  renderEmbed = props => {
    if (props.preview && props.type === 'link') {
      if (isIPFS.multihash(props.post)) {
        this.handleIpfsLink().then(() => {
          console.log("ipfs")
          console.log(this.state);
          return <EmbedWidget url={this.state.link} />;
        });
      } else {
        console.log("not ipfs")
        return <EmbedWidget url={props.post} />;
      }
    }

    if (props.preview && props.type === 'upload') {
      if (isIPFS.multihash(props.post)) {
        this.handleIpfsLink().then(() => {
          console.log("ipfs")
          console.log(this.state);
          return <EmbedWidget url={this.state.link} />;
        });
      } else {
        console.log("not ipfs")
        return <EmbedWidget url={props.post} />;
      }
    }
  };

  renderContent = props => {
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

  handleIpfsLink = async () => {
    this.setState({ link: 'loading' });

    const ipfsHash = this.props.post;
    const fileType = await services.ipfs.getFileTypeFromHash(ipfsHash);
    const fileMimeType = fileType ? fileType.mime : 'unknown';
    const fileExtension = fileType ? `.${fileType.ext}` : '';

    if (fileMimeType.match(/image/)) {
      const image = await services.ipfs.getBase64ImageFromStream(
        ipfsHash,
        progressResponse => {
          const { progressInMbs, killStream } = progressResponse;
          this.killStream = killStream;

          this.setState({ link: 'loading' });

          if (progressInMbs > 10) {
            killStream();
            this.setState({
              link: {
                download: this.download.bind(this, { ipfsHash, fileExtension }),
                message: `File type ${fileMimeType} too big to embed.`,
                downloadMessage: 'Download'
              }
            });
          }
        }
      );
      this.setState({ link: image });
    } else if (fileMimeType.match(/video|audio/)) {
      const type = getMediaSourceType(fileMimeType);
      const mediaSource = {
        src: `${ipfsGateway}/${ipfsHash}`,
        type
      };
      this.setState({ link: mediaSource });
    } else {
      this.setState({
        link: {
          download: this.download.bind(this, { ipfsHash, fileExtension }),
          message: `Cannot embed file type ${fileMimeType}.`,
          downloadMessage: 'Download'
        }
      });
    }
  };

  getBlobFromStream = async ({ ipfsHash, fileExtension }) => {
    this.setState({
      link: {
        download: this.download.bind(this, { ipfsHash, fileExtension }),
        message: 'Connecting.',
        downloadMessage: 'Cancel'
      },
      isDownloading: true
    });

    const blob = await services.ipfs.getBlobFromStream(ipfsHash, progress => {
      this.killStream = progress.killStream;
      this.setState({
        link: {
          download: this.download.bind(this, { ipfsHash, fileExtension }),
          message: `${progress.progressInMbs} MB downloaded.`,
          downloadMessage: 'Cancel'
        },
        isDownloading: true
      });
    });

    return blob;
  };

  download = async ({ ipfsHash, fileExtension }) => {
    const { isDownloading } = this.state;
    const { post } = this.props;
    const username = post.username || post.address;
    const postId = post.id;

    if (!isDownloading) {
      this.setState({ isDownloading: true });

      const blob = await this.getBlobFromStream({ ipfsHash, fileExtension });

      downloadBlob({ blob, fileName: `${username}-${postId}${fileExtension}` });

      this.setState({
        link: {
          download: () =>
            downloadBlob({
              blob,
              fileName: `${username}-${postId}${fileExtension}`
            }),
          message: 'Download complete.',
          downloadMessage: 'Save'
        },
        isDownloading: false
      });
    }

    if (isDownloading) {
      this.killStream();

      this.setState({
        link: {
          download: this.download.bind(this, { ipfsHash, fileExtension }),
          message: 'Cancelled download.',
          downloadMessage: 'Try again'
        },
        isDownloading: false
      });
    }
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
          {this.renderContent({
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
          {this.renderEmbed({
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

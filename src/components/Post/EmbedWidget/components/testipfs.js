// import React, { Component } from 'react';

// const services = require('../../services');

// const {
//   isIpfsContent,
//   isTorrent,
//   linkToIpfsParams,
//   ipfsParamsToLink,
//   downloadBlob,
//   getMediaSourceType
// } = require('./util');

// const ipfsGateway = 'https://ipfs.infura.io/ipfs/';

// class Ipfs extends Component {
//   state = {
//     link: null,
//     content: null,
//     isDownloading: false,
//     codecsNeeded: false
//   };

//   handleIpfsLink = async () => {
//     const { post } = this.props;
//     if (!isIpfsContent(post.link)) {
//       return;
//     }

//     this.setState({ link: 'loading' });

//     const { hash: ipfsHash } = linkToIpfsParams(post.link);
//     const fileType = await services.ipfs.getFileTypeFromHash(ipfsHash);
//     const fileMimeType = fileType ? fileType.mime : 'unknown';
//     const fileExtension = fileType ? `.${fileType.ext}` : '';

//     if (fileMimeType.match(/image/)) {
//       const image = await services.ipfs.getBase64ImageFromStream(
//         ipfsHash,
//         progressResponse => {
//           const { progressInMbs, killStream } = progressResponse;
//           this.killStream = killStream;

//           this.setState({ link: 'loading' });

//           if (progressInMbs > 10) {
//             killStream();
//             this.setState({
//               link: {
//                 download: this.download.bind(this, { ipfsHash, fileExtension }),
//                 message: `File type ${fileMimeType} too big to embed.`,
//                 downloadMessage: 'Download'
//               }
//             });
//           }
//         }
//       );
//       this.setState({ link: image });
//     } else if (fileMimeType.match(/video|audio/)) {
//       const type = getMediaSourceType(fileMimeType);
//       const mediaSource = {
//         src: `${ipfsGateway}/${ipfsHash}`,
//         type
//       };
//       this.setState({ link: mediaSource });
//     } else {
//       this.setState({
//         link: {
//           download: this.download.bind(this, { ipfsHash, fileExtension }),
//           message: `Cannot embed file type ${fileMimeType}.`,
//           downloadMessage: 'Download'
//         }
//       });
//     }
//   };

//   getBlobFromStream = async ({ ipfsHash, fileExtension }) => {
//     this.setState({
//       link: {
//         download: this.download.bind(this, { ipfsHash, fileExtension }),
//         message: 'Connecting.',
//         downloadMessage: 'Cancel'
//       },
//       isDownloading: true
//     });

//     const blob = await services.ipfs.getBlobFromStream(ipfsHash, progress => {
//       this.killStream = progress.killStream;
//       this.setState({
//         link: {
//           download: this.download.bind(this, { ipfsHash, fileExtension }),
//           message: `${progress.progressInMbs} MB downloaded.`,
//           downloadMessage: 'Cancel'
//         },
//         isDownloading: true
//       });
//     });

//     return blob;
//   };

//   download = async ({ ipfsHash, fileExtension }) => {
//     const { isDownloading } = this.state;
//     const { post } = this.props;
//     const username = post.username || post.address;
//     const postId = post.id;

//     if (!isDownloading) {
//       this.setState({ isDownloading: true });

//       const blob = await this.getBlobFromStream({ ipfsHash, fileExtension });

//       downloadBlob({ blob, fileName: `${username}-${postId}${fileExtension}` });

//       this.setState({
//         link: {
//           download: () =>
//             downloadBlob({
//               blob,
//               fileName: `${username}-${postId}${fileExtension}`
//             }),
//           message: 'Download complete.',
//           downloadMessage: 'Save'
//         },
//         isDownloading: false
//       });
//     }

//     if (isDownloading) {
//       this.killStream();

//       this.setState({
//         link: {
//           download: this.download.bind(this, { ipfsHash, fileExtension }),
//           message: 'Cancelled download.',
//           downloadMessage: 'Try again'
//         },
//         isDownloading: false
//       });
//     }
//   };
// }

// export default Ipfs;

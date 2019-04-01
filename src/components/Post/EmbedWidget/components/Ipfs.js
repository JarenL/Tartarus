// const services = require('../../services')

// // util
// const {isIpfsContent, isTorrent, linkToIpfsParams, ipfsParamsToLink, downloadBlob, getMediaSourceType} = require('./util')
// const debug = require('debug')('containers:Post')


// handleIpfsLink = async () => {
//   const {post, settings} = this.props
//   // if (!settings.IPFS_EMBEDS) {
//   //   return
//   // }
//   if (!isIpfsContent(post.link)) {
//     return
//   }

//   this.setState({link: 'loading'})

//   const {hash: ipfsHash} = linkToIpfsParams(post.link)
//   const fileType = await services.ipfs.getFileTypeFromHash(ipfsHash)
//   const fileMimeType = fileType ? fileType.mime : 'unknown'
//   const fileExtension = fileType ? `.${fileType.ext}` : ''

//   if (fileMimeType.match(/image/)) {
//     const image = await services.ipfs.getBase64ImageFromStream(ipfsHash, (progressResponse) => {
//       const {progressInMbs, killStream} = progressResponse
//       this.killStream = killStream

//       this.setState({link: 'loading'})

//       if (progressInMbs > 10) {
//         killStream()
//         this.setState({
//           link: {
//             download: this.download.bind(this, {ipfsHash, fileExtension}),
//             message: `File type ${fileMimeType} too big to embed.`,
//             downloadMessage: 'Download'
//           }
//         })
//       }
//     })
//     this.setState({link: image})
//   }

//   else if (fileMimeType.match(/video|audio/)) {
//     const ipfsGateway = settings.IPFS_GATEWAY
//     const type = getMediaSourceType(fileMimeType)
//     const mediaSource = {
//       src: `${ipfsGateway}/${ipfsHash}`,
//       type
//     }
//     this.setState({link: mediaSource})
//   }

//   else {
//     this.setState({
//       link: {
//         download: this.download.bind(this, {ipfsHash, fileExtension}),
//         message: `Cannot embed file type ${fileMimeType}.`,
//         downloadMessage: 'Download'
//       }
//     })
//   }

//   debug('handleIpfsLink end')
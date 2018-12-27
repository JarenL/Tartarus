/* eslint brace-style: 0 */

// react
import React from 'react'

// components
import Card from '../Card'
import Codecs from './Codecs'

// api
const services = require('../services')

// util
const {isIpfsContent, isTorrent, linkToIpfsParams, ipfsParamsToLink, downloadBlob, getMediaSourceType} = require('./util')
const IPFS_COMMENT_MAX_LENGTH = 10000 // arbitrary small number to prevent too big IPFS files

class Post extends React.Component {
  state = {
    link: null,
    content: null,
    isDownloading: false,
    codecsNeeded: false
  }

  componentDidMount = () => {
    const {isLoading} = this.props
    if (isLoading) return

    this.handleIpfsLink()
    this.handleIpfsComment()
  }

  componentDidUpdate = (prevProps) => {
    const prevPost = (prevProps && prevProps.post) || {}
    const post = (this.props && this.props.post) || {}

    if (prevPost.link !== post.link) {
      this.handleIpfsLink()
    }
  }

  componentWillUnmount = (prevProps) => {
    if (typeof this.killStream === 'function') this.killStream()
  }

  handleIpfsComment = async () => {
    const {post} = this.props
    if (!post.comment) return

    if (isIpfsContent(post.comment)) {
      this.setState({comment: 'loading'})

      const ipfsHash = linkToIpfsParams(post.comment).hash
      const string = await services.ipfs.getStringFromStream(ipfsHash, {maxLength: IPFS_COMMENT_MAX_LENGTH})

      this.setState({comment: string})
    }

  }

  handleIpfsLink = async () => {
    const {post} = this.props
    if (!isIpfsContent(post.link)) {
      return
    }

    this.setState({link: 'loading'})

    const {hash: ipfsHash} = linkToIpfsParams(post.link)
    const fileType = await services.ipfs.getFileTypeFromHash(ipfsHash)
    const fileMimeType = fileType ? fileType.mime : 'unknown'
    const fileExtension = fileType ? `.${fileType.ext}` : ''

    if (fileMimeType.match(/image/)) {
      const image = await services.ipfs.getBase64ImageFromStream(ipfsHash, (progressResponse) => {
        const {progressInMbs, killStream} = progressResponse
        this.killStream = killStream

        this.setState({link: 'loading'})

        if (progressInMbs > 10) {
          killStream()
          this.setState({
            link: {
              download: this.download.bind(this, {ipfsHash, fileExtension}),
              message: `File type ${fileMimeType} too big to embed.`,
              downloadMessage: 'Download'
            }
          })
        }
      })
      this.setState({link: image})
    }

    else if (fileMimeType.match(/video|audio/)) {
      const ipfsGateway = 'https://ipfs.io/ipfs'
      const type = getMediaSourceType(fileMimeType)
      const mediaSource = {
        src: `${ipfsGateway}/${ipfsHash}`,
        type
      }
      this.setState({link: mediaSource})
    }

    else {
      this.setState({
        link: {
          download: this.download.bind(this, {ipfsHash, fileExtension}),
          message: `Cannot embed file type ${fileMimeType}.`,
          downloadMessage: 'Download'
        }
      })
    }
  }

  getBlobFromStream = async ({ipfsHash, fileExtension}) => {
    this.setState({
      link: {
        download: this.download.bind(this, {ipfsHash, fileExtension}),
        message: 'Connecting.',
        downloadMessage: 'Cancel'
      },
      isDownloading: true
    })

    const blob = await services.ipfs.getBlobFromStream(ipfsHash, (progress) => {
      this.killStream = progress.killStream
      this.setState({
        link: {
          download: this.download.bind(this, {ipfsHash, fileExtension}),
          message: `${progress.progressInMbs} MB downloaded.`,
          downloadMessage: 'Cancel'
        },
        isDownloading: true
      })
    })

    return blob
  }

  getBlobFromWebWorker = ({ipfsHash, fileExtension}) => new Promise(resolve => {
    this.setState({
      link: {
        download: this.download.bind(this, {ipfsHash, fileExtension}),
        message: 'Connecting.',
        downloadMessage: 'Cancel'
      },
      isDownloading: true
    })

    const getBlobFromStream = new services.ipfs.webWorkers.GetBlobFromStream()
    this.killStream = () => getBlobFromStream.postMessage({killStream: true})
    getBlobFromStream.postMessage({
      ipfsHash
    })
    getBlobFromStream.onmessage = ({data}) => {
      if (data.progressInMbs) {
        this.setState({
          link: {
            download: this.download.bind(this, {ipfsHash, fileExtension}),
            message: `${data.progressInMbs} MB downloaded.`,
            downloadMessage: 'Cancel'
          },
          isDownloading: true
        })
      }
      if (data.blob) {
        resolve(data.blob)
      }
    }
  })

  download = async ({ipfsHash, fileExtension}) => {
    const {isDownloading} = this.state
    const {post} = this.props
    const username = post.username || post.address
    const postId = post.id

    if (!isDownloading) {
      this.setState({isDownloading: true})

      const blob = await this.getBlobFromStream({ipfsHash, fileExtension})

      downloadBlob({blob, fileName: `${username}-${postId}${fileExtension}`})

      this.setState({
        link: {
          download: () => downloadBlob({blob, fileName: `${username}-${postId}${fileExtension}`}),
          message: 'Download complete.',
          downloadMessage: 'Save'
        },
        isDownloading: false
      })
    }

    if (isDownloading) {
      this.killStream()

      this.setState({
        link: {
          download: this.download.bind(this, {ipfsHash, fileExtension}),
          message: 'Cancelled download.',
          downloadMessage: 'Try again'
        },
        isDownloading: false
      })
    }
  }

  render () {
    const {isLoading, post, preview, onPreviewClose} = this.props
    const {link, comment, codecsNeeded} = this.state

    const newPost = {...post}

    if (link) newPost.link = link
    if (comment) newPost.comment = comment

    // catch loading IPFS content on first render
    if (isIpfsContent(newPost.link)) newPost.link = 'loading'
    if (isIpfsContent(newPost.comment)) newPost.comment = 'loading'

    return (
      <Card isLoading={isLoading} post={newPost} preview={preview} onPreviewClose={onPreviewClose} />
    )
  }
}

export default Post

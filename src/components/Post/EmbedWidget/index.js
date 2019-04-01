import React from 'react';

import {
  Facebook,
  Instagram,
  Reddit,
  Twitter,
  Vimeo,
  Youtube,
  Image,
  Link,
  Torrent,
  Audio,
  Video,
  Loading,
  Magnet,
  Download,
  MediaSource
} from './components';

const { extractRootDomain, stripUrlQuery } = require('./util');

const EmbedWidget = props => {
  const settings = props.settings;
  const Widget = getWidgetFromUrl(props.url, settings);

  return <Widget settings={settings} url={props.url} />;
};

const getWidgetFromUrl = (url, settings) => {
  if (!url) {
    return () => <div />;
  }

  if (isMediaSource(url)) {
    return MediaSource;
  }

  if (isDownload(url)) {
    return Download;
  }

  if (isTorrent(url)) {
    if (!settings.WEB_TORRENT_EMBEDS) {
      return Magnet;
    }
    return Torrent;
  }

  if (isReactElement(url)) {
    return () => url;
  }

  if (isLoading(url)) {
    return Loading;
  }

  if (isMagnet(url)) {
    return Magnet;
  }

  if (isVideo(url)) {
    return Video;
  }

  if (isAudio(url)) {
    return Audio;
  }

  if (isImage(url)) {
    return Image;
  }

  const type = getWidgetTypeFromUrl(url);

  switch (type) {
    case 'facebook':
      return Facebook;

    case 'instagram':
      return Instagram;

    case 'reddit':
      return Reddit;

    case 'twitter':
      return Twitter;

    case 'vimeo':
      if (!isVimeoVideo(url)) {
        return Link;
      }
      return Vimeo;

    case 'youtube':
      if (!isYoutubeVideo(url)) {
        return Link;
      }
      return Youtube;

    default:
      return Link;
  }
};

const isYoutubeVideo = url => {
  return url.match(/watch\?v=([^&]+)/);
};

const isVimeoVideo = url => {
  if (!url.match(/\/([^/]+)$/)) {
    return false;
  }
  if (!url.match(/\/\d+$/)) {
    return false;
  }
  return true;
};

const getWidgetTypeFromUrl = url => {
  const domain = extractRootDomain(url);
  const type = domain.split('.')[0];
  return type;
};

const isImage = url => {
  // this is a base64 encoded image
  if (url.match(/^data:image/)) {
    return true;
  }

  // this is a link to a normal external image
  const cleanUrl = stripUrlQuery(url);
  if (cleanUrl.match(/\.(jpg|jpeg|png|gif)$/)) {
    return true;
  }
};

const isVideo = url => {
  const cleanUrl = stripUrlQuery(url);
  if (cleanUrl.match(/\.(webm|mp4|ogg)$/)) {
    return true;
  }
};

const isAudio = url => {
  const cleanUrl = stripUrlQuery(url);
  if (cleanUrl.match(/\.(wav|mp3|flac)$/)) {
    return true;
  }
};

const isIpfs = url => {
  if (url.match(/^ipfs:/)) {
    return true;
  }
};

const isMagnet = url => {
  if (url.match(/^magnet:/)) {
    return true;
  }
};

const isLoading = url => {
  if (url.match(/^loading:/) || url.match(/^loading$/)) {
    return true;
  }
};

const isTorrent = url => {
  return typeof url === 'object' && url.magnet;
};

const isDownload = url => {
  return typeof url === 'object' && url.download;
};

const isReactElement = url => {
  return typeof url === 'object' && url.props;
};

const isMediaSource = url => {
  return typeof url === 'object' && url.src && url.type;
};

export default EmbedWidget;

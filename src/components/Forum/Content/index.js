import React from 'react';
import styled from 'styled-components/macro';
import ForumContentTitle from './Title';
// import PostContentPreview from './Preview';
// import PostContentFullText from './FullText';
// import PostContentDetail from './Detail';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border-left: 1px solid ${props => props.theme.border};
  padding: 8px;
  min-width: 0;
`;

// const renderContent = props => {
//   switch (props.type) {
//     case 'link':
//       return <PostContentPreview>{props.url}</PostContentPreview>;

//     case 'text':
//       if (props.showFullPost) {
//         return <PostContentFullText>{props.text}</PostContentFullText>;
//       }
//       return <PostContentPreview>{props.text}</PostContentPreview>;

//     default:
//       break;
//   }
// };

const ForumContent = props => (
  <Wrapper>
    <ForumContentTitle
      // url={url}
      // title={props.title}
      address={props.address}
      name={props.name}
      // type={type}
      // full={showFullPost}
      // {...details}
    />
    {/* {renderContent({ type, url, text, showFullPost })} */}
    {/* {renderContent({ showFullPost: false, type: 'text', text: props.post })}
    <PostContentDetail
      commentCount={props.commentCount}
      time={props.time}
      creator={props.creator}
      forumName={props.forumName}
      forumAddress={props.forumAddress}
      postAddress={props.postAddress}
    /> */}
  </Wrapper>
);

export default ForumContent;

import React from 'react';
import styled from 'styled-components/macro';
import ReactLoading from 'react-loading';

const LoadingWrapper = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  padding-top: 3%;
  flex-direction: column;
  justify-content: center;
  alignitems: center;
`;

const Loading = styled(ReactLoading)`
  // color: ${props => props.theme.accent}
  margin: 0 auto;
`;

const LoadingBubble = () => (
  <LoadingWrapper>
    <Loading type='bubbles' color={'#1890ff'} height={'5%'} width={'5%'} />
  </LoadingWrapper>
);

export default LoadingBubble;

import React from 'react';
import LoadingTest from '../../shared/LoadingIndicator/LoadingTest';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import styled from 'styled-components/macro';

const ToastWrapper = styled.div`
  display: flex;
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
`;

const ButtonWrapper = styled.div`
  align-self: flex-end;
  color: ${props => props.theme.mod};
`;

const Upload = () => {
  return (
    <ToastWrapper>
      <ButtonWrapper>
        <LoadingTest />
      </ButtonWrapper>
      {'Uploading to IPFS'}
    </ToastWrapper>
  );
};

export default Upload;

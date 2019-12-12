import React from 'react';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import styled from 'styled-components/macro';
import CloseButton from '../../Buttons/CloseButton';

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
  color: ${props => props.theme.admin};
`;

const LoginFail = () => {
  return (
    <ToastWrapper>
      <ButtonWrapper>
        <CloseButton size={24} />
      </ButtonWrapper>
      {'Login Failed'}
    </ToastWrapper>
  );
};

export default LoginFail;

import React from 'react';
import styled from 'styled-components/macro';
import { MdClose } from 'react-icons/md';
import { headerItem } from '../../shared/helpers';
import { transition } from '../../shared/helpers';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Clear = styled(MdClose)`
  cursor: pointer;
  width: 20px;
  height: 20px;
  & path {
    ${transition('fill')};

    fill: ${props => props.theme.mutedText};
  }
  @media (max-width: 425px) {
    width: 18px;
    height: 18px;
  }

  @media (hover: hover) {
    :hover path {
      fill: ${props => props.theme.accent};
    }
  }
`;

const CancelButton = props => (
  <Wrapper>
    <Clear size={25} onClick={props.handleClose} />
  </Wrapper>
);

export default CancelButton;

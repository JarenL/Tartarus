import styled from 'styled-components/macro';
import { keyframes } from 'styled-components';
import React from 'react';

const spin = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const LoadingIndicatorSpinner = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  animation: ${spin} 1s infinite linear;
  border: 0.3rem solid ${props => props.theme.accent + '4d'};
  border-top-color: ${props => props.theme.accent};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  @media (max-width: 768px) {
    left: 50%;
  }
`;

export default LoadingIndicatorSpinner;

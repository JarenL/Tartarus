import styled from 'styled-components/macro';
import { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`;

const LoadingTest = styled.div`
  position: relative;
  margin-top: 32px;
  top: 50%;
  left: 50%;
  animation: ${spin} 1s infinite linear;
  border: 0.25rem solid ${props => props.theme.accent + '4d'};
  border-top-color: ${props => props.theme.accent};
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

export default LoadingTest;

import styled from 'styled-components/macro';
import { MdClose } from 'react-icons/md';

const CloseButton = styled(MdClose)`
  cursor: pointer;
  margin-right: 2px;
  margin-left: 2px;
  color: #ffffff;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

export default CloseButton;

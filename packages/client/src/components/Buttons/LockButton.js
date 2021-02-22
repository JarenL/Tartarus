import styled from 'styled-components/macro';
import { MdLockOpen } from 'react-icons/md';

const LockButton = styled(MdLockOpen)`
  vertical-align: sub;
  cursor: pointer;
  // margin-right: 2px;
  // margin-left: 2px;
  &:last-child {
    margin-right: 0;
  }
  color: ${props => props.theme.mutedText};
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

export default LockButton;

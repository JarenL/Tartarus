import styled from 'styled-components/macro';
import { MdDehaze } from 'react-icons/md';

const DrawerButton = styled(MdDehaze)`
  vertical-align: sub;
  cursor: pointer;
  margin-right: 2px;
  margin-left: 2px;
  color: ${props => props.theme.mutedText};
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

export default DrawerButton;

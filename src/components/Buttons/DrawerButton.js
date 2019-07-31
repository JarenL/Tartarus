import styled from 'styled-components/macro';
import { MdClose } from 'react-icons/md';
import MenuIcon from '@material-ui/icons/Menu';

const DrawerButton = styled(MenuIcon)`
  cursor: pointer;
  // margin-right: 2px;
  // margin-left: 2px;
  color: ${props => props.theme.mutedText};
  &:hover {
    color: ${props => props.theme.accent};
    & > svg {
      color: ${props => props.theme.accent} !important;
    }
  }
`;

export default DrawerButton;

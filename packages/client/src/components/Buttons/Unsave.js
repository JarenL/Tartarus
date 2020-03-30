import styled from 'styled-components/macro';
import { MdStar } from 'react-icons/md';

const Unsave = styled(MdStar)`
  vertical-align: sub;
  cursor: pointer;
  margin-right: 2px;
  margin-left: 2px;
  color: ${props => props.theme.accent};
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

export default Unsave;

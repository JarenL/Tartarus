import styled from 'styled-components/macro';
import { MdStarBorder } from 'react-icons/md';

const Save = styled(MdStarBorder)`
  vertical-align: sub;
  cursor: pointer;
  margin-right: 2px;
  margin-left: 2px;
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

export default Save;

import styled from 'styled-components/macro';
import { MdKeyboardArrowUp } from 'react-icons/md';

const Upvote = styled(MdKeyboardArrowUp)`
  border: 0;
  border-radius: 3px;
  // height: 18px;
  // width: 18px;
  background-color: transparent;
  cursor: pointer;
  color: ${props =>
    props.upvoted ? props.theme.upvote : props.theme.mutedText};

  :focus {
    outline: 0;
  }

  :hover {
    color: ${props => props.theme.upvote};
    background-color: ${props => props.theme.voteButtonHover};
  }
`;

export default Upvote;

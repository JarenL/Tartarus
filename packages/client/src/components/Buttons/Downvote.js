import styled from 'styled-components/macro';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Downvote = styled(MdKeyboardArrowDown)`
  border: 0;
  border-radius: 3px;
  // height: 18px;
  // width: 18px;
  background-color: transparent;
  cursor: pointer;
  color: ${props => 
    props.downvoted ? props.theme.downvote : props.theme.mutedText};

  :focus {
    outline: 0;
  }

  :hover {
    color: ${props => props.theme.downvote};
    background-color: ${props => props.theme.voteButtonHover};
  }
`;

export default Downvote;

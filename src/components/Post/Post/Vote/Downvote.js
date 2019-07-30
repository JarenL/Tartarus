import styled from 'styled-components/macro';
import PostVoteButton from './Button';
import { MdArrowDownward } from 'react-icons/md';

const PostVoteDownvote = styled(MdArrowDownward)`
  border: 0;
  border-radius: 3px;
  height: 18px;
  width: 18px;
  background-color: transparent;
  cursor: pointer;
  color: ${props => 
    props.downvoted ? props.theme.error : props.theme.mutedText};

  :focus {
    outline: 0;
  }

  :hover {
    color: ${props => '#ebb134'};
    background-color: ${props => props.theme.voteButtonHover};
  }
`;

export default PostVoteDownvote;

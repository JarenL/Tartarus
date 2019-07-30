import styled from 'styled-components/macro';
import PostVoteButton from './Button';
import { MdArrowUpward } from 'react-icons/md';

const PostVoteUpvote = styled(MdArrowUpward)`
  border: 0;
  border-radius: 3px;
  height: 18px;
  width: 18px;
  background-color: transparent;
  cursor: pointer;
  color: ${props =>
    props.upvoted ? props.theme.accent : props.theme.mutedText};

  :focus {
    outline: 0;
  }

  :hover {
    color: ${props => props.theme.accent};
    background-color: ${props => props.theme.voteButtonHover};
  }
`;

export default PostVoteUpvote;

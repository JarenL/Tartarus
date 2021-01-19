import styled from 'styled-components/macro';

const SplitTitle = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
  text-align: center;
  margin-right: auto;
  color: ${props => props.theme.accent};
  @media (max-width: 786px) {
    font-size: 14px;
  }
`

export default SplitTitle;

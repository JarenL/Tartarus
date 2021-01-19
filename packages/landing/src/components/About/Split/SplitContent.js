import styled from 'styled-components/macro';

const SplitContent = styled.p`
  font-size: 20px;
  // padding: 12px;
  text-align: left;
  color: ${props => props.theme.mutedText};
  @media (max-width: 786px) {
    font-size: 12px;  
  }
`

export default SplitContent;

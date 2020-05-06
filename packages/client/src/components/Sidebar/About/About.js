import React from 'react';
import styled from 'styled-components/macro';
import { wideFont } from '../../shared/helpers';
import { overflow } from '../../shared/helpers';
import AboutIcon from '../../Buttons/Search';
import SearchButton from '../../Buttons/Search';
import MailButton from '../../Buttons/Mail';
import Tip from '../../Buttons/Tip';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  // border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.foreground};
  // margin-top: 12px;
`;

const HeaderWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  color: ${props => props.theme.mutedText};
  border-bottom: 1px solid ${props => props.theme.border};
`;

const TextWrapper = styled.div`
  ${wideFont};
  ${overflow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  // background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const AddressWrapper = styled.div`
${overflow};
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  padding: 8px;
  // background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.mutedText};
`;

const ButtonWrapper = styled.span`
  cursor: pointer;
  align-self: flex-end;
  color: ${props => props.theme.mutedText};
  & > svg {
    margin-right: 5px;
  }
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

const About = props => (
  <Wrapper>
    <HeaderWrapper>{'About'}</HeaderWrapper>
    <TextWrapper>
      {'Tartarus'}
      <ButtonWrapper>
        <SearchButton
          size={16}
          onClick={() =>
            window.open(
              'https://ropsten.etherscan.io/address/' + props.tartarusAddress
            )
          }
        />
      </ButtonWrapper>
    </TextWrapper>
    <AddressWrapper>{props.tartarusAddress}</AddressWrapper>
    <TextWrapper>
      {'Donate'}
      <ButtonWrapper>
        <Tip size={16} />
      </ButtonWrapper>
    </TextWrapper>
    <AddressWrapper>
      {'0x366Ebde1b1cbCF95b35e1bd85de01D48f9F1eFC6'}
    </AddressWrapper>
    <TextWrapper>
      {'Contact'}
      <ButtonWrapper>
        <MailButton size={16} />
      </ButtonWrapper>
    </TextWrapper>
    <AddressWrapper>{'tartarus@protonmail.com'}</AddressWrapper>
  </Wrapper>
);

export default About;

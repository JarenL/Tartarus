import React, { Component } from "react";
import styled from "styled-components/macro";
// import Split from "./Split";
import SplitImg from "./SplitImg";
import SplitTitle from "./SplitTitle";
import SplitContent from "./SplitContent";

import logo from "../../../images/tartarus.png";
import User from "../../../images/user7.png";

const Wrapper = styled.div`
  width: 70%;
`;

const TextWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  background-color: ${props => props.theme.foreground};
  border: 2px solid ${props => props.theme.splitBorder};
`;

const ImageWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  background-color: ${props => props.theme.splitBorder};
`;

const Split = styled.div`
    padding: 12px;
    // padding-right: 6px;
    border-radius: 8px;
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
    align-items: center;
    grid-gap: 30px;

    // background-color: ${props => props.theme.foreground};

    // @media (max-width: 786px) {
    //     grid-template-columns: 3fr 1fr;
    // }
`

const InfoSplit = () => {
  return (
    <Wrapper>
      <Split>
        <TextWrapper>
          <SplitTitle>Share</SplitTitle>
          <SplitContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
            fugit provident. Fugit, distinctio dolor nesciunt natus quidem
            laborum beatae ratione accusantium hic illo quas id numquam
            possimus, similique odit alias.
          </SplitContent>
        </TextWrapper>
        <TextWrapper>
          <SplitTitle>Anonymous</SplitTitle>
          <SplitContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
            fugit provident. Fugit, distinctio dolor nesciunt natus quidem
            laborum beatae ratione accusantium hic illo quas id numquam
            possimus, similique odit alias.
          </SplitContent>
        </TextWrapper>
        <TextWrapper>
          <SplitTitle>Anonymous</SplitTitle>
          <SplitContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
            fugit provident. Fugit, distinctio dolor nesciunt natus quidem
            laborum beatae ratione accusantium hic illo quas id numquam
            possimus, similique odit alias.
          </SplitContent>
        </TextWrapper>
        {/* <BlockieWrapper src={User} alt="" /> */}
        {/* <SplitImg src={User} alt="" /> */}
        {/* </BlockieWrapper> */}
      </Split>
    </Wrapper>
  );
};

export default InfoSplit;
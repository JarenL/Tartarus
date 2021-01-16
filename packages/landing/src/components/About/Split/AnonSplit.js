import React, { Component } from "react";
import styled from "styled-components/macro";
import Split from "./Split";
import SplitImg from "./SplitImg";
import SplitTitle from "./SplitTitle";
import SplitContent from "./SplitContent";

import logo from "../../../images/tartarus.png";
import User from "../../../images/user7.png";

const Wrapper = styled.div`
  width: 50%;
`;

const TextWrapper = styled.div`
  width: 100%;
`;

const ImageWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 50%;
`;

const BlockieWrapper = styled.img`
  // height: 25%;
  width: 35%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  // border-radius: 64px;
  // padding: 24px;
`;

const AnonSplit = () => {
  return (
    <Wrapper>
      <Split>
        <TextWrapper>
          <SplitTitle>Anonymous</SplitTitle>
          <SplitContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
            fugit provident. Fugit, distinctio dolor nesciunt natus quidem
            laborum beatae ratione accusantium hic illo quas id numquam
            possimus, similique odit alias.
          </SplitContent>
        </TextWrapper>
        <BlockieWrapper src={User} alt="" />
        {/* <SplitImg src={User} alt="" /> */}
        {/* </BlockieWrapper> */}
      </Split>
    </Wrapper>
  );
};

export default AnonSplit;

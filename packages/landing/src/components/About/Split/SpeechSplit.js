import React, { Component } from "react";
import styled from "styled-components/macro";
import Split from "./Split";
import SplitImg from "./SplitImg";
import SplitTitle from "./SplitTitle";
import SplitContent from "./SplitContent";

import logo from "../../../images/tartarus.png";
import BanHammer from "../../../images/ban-hammer2.png";
import User from "../../../images/user.png";
import Lock from "../../../images/lock.svg"
import speak from "../../../images/speak.svg"


// #3BCB56

const Wrapper = styled.div`
  width: 50%;
`;

const TextWrapper = styled.div`
  width: 100%;
`;

const ImageWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 25%;
`;

const SpeechSplit = props => {
  return (
    <Wrapper>
      <Split night={props.night}>
        <TextWrapper>
          <SplitTitle>Uncensored</SplitTitle>
          <SplitContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
            fugit provident. Fugit, distinctio dolor nesciunt natus quidem
            laborum beatae ratione accusantium hic illo quas id numquam
            possimus, similique odit alias.
          </SplitContent>
        </TextWrapper>
        <ImageWrapper>
          <SplitImg src={speak} alt="" />
        </ImageWrapper>
      </Split>
      </Wrapper>
  );
};

export default SpeechSplit;

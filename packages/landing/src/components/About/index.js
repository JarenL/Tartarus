import React, { Component } from "react";
import styled from "styled-components/macro";
import Split from "./Split/Split";
import SplitImg from "./Split/SplitImg";
import SplitTitle from "./Split/SplitTitle";
import SplitContent from "./Split/SplitContent";

import logo from "../../images/tartarus.png";
import BanHammer from "../../images/ban-hammer2.png";
import User from "../../images/user.png";

const Divider = styled.div`
  height: 50px;
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
  height: 75%;
  width: 75%;
  display: block;
  margin-left: auto;;
  margin-right: auto;
  border-radius: 64px;
  // padding: 24px;
`;

const About = () => {
  return (
    <>
      <Split>
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
          <SplitImg src={BanHammer} alt="" />
        </ImageWrapper>
      </Split>
      <Divider />
      <Split>
        <TextWrapper>
          <SplitTitle>Decentralized</SplitTitle>
          <SplitContent>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
            fugit provident. Fugit, distinctio dolor nesciunt natus quidem
            laborum beatae ratione accusantium hic illo quas id numquam
            possimus, similique odit alias.
          </SplitContent>
        </TextWrapper>
        <ImageWrapper>
          <SplitImg src={logo} alt="" />
        </ImageWrapper>
      </Split>
      <Divider />
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
        <ImageWrapper>
          <BlockieWrapper src={User} alt="" />
        </ImageWrapper>
      </Split>
    </>
  );
};

export default About;

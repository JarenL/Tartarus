import React from "react";
import ReactDOM from "react-dom";
import { Parallax, ParallaxLayer } from "react-spring/addons";
import "./style.css";
import logo from "../../images/tartarus.svg";
import banHammer from "../../images/ban-hammer2.png";
import styled from "styled-components";
import SpeechSplit from "../About/Split/SpeechSplit";
import DesertDark from "../../images/desert-dark.svg";
import DesertLight from "../../images/desert-light.svg";
import AnonSplit from "../About/Split/AnonSplit";
import Lock from "../../images/lock.svg";
import Voice from "../../images/voice.svg";
import Hammer from "../../images/hammer.svg";
import VisOff from "../../images/vis-off.svg";
import ThumbDown from "../../images/thumb-down.svg";
import Error from "../../images/error.svg";
import SearchOff from "../../images/search-off.svg";
import User from "../../images/user.png";
import User2 from "../../images/user2.png";
import User3 from "../../images/user3.png";
import User4 from "../../images/user4.png";
import User5 from "../../images/user5.png";
import User6 from "../../images/user6.png";
import DecentSplit from "../About/Split/DecentSplit";
import Server from "../../images/server.svg";
import Server2 from "../../images/server2.svg";

import IPFS from "../../images/ipfs.svg";
import Ethereum from "../../images/ethereum.svg";
import Quarantine from "../../images/quarantine.svg";
import InfoSplit from "../About/Split/InfoSplit";
import Stars from "../../images/stars.svg";
import ConnectedStars from "../../images/stars-connected.svg";
import StarsDay from "../../images/starsday.svg";
import * as S from "../App/styles";
import * as A from "../../styles/shared-components";
import EnterButton from "../EnterButton";

class TestParallax extends React.Component {
  render() {
    return (
      <Parallax ref={(ref) => (this.parallax = ref)} pages={6}>
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={5}
          style={{
            backgroundImage: this.props.night
              ? `url(${Stars})`
              : `url(${StarsDay})`,
            backgroundSize: "cover",
          }}
        />
        <ParallaxLayer
          offset={1}
          speed={1}
          // style={{ backgroundColor: "#805E73" }}
        />
        <ParallaxLayer
          offset={2}
          speed={1}
          // style={{ backgroundColor: "#87BCDE" }}
        />
        <ParallaxLayer
          offset={5}
          speed={0}
          factor={1}
          style={{
            backgroundImage: this.props.night
              ? `url(${DesertDark})`
              : `url(${DesertLight})`,
            backgroundSize: "cover",
          }}
          onClick={() => this.parallax.scrollTo(0)}
        >
          <S.MainSection>
            <S.Content ref={this.props.contentRef}>
              <S.TextContent
                isAnimationDone={this.props.isAnimationDone.value}
                pose={this.props.homePose}
              >
                <S.Title>
                  <S.Logo src={logo} />
                  {/* <S.TitleText>tartaros</S.TitleText> */}
                </S.Title>

                <S.Subtitle>
                  <span>
                    Welcome to the marketplace of ideas.
                    <A.Space />
                    {this.props.noWeb3
                      ? "No web3 detected. Please use a web3 compatible Browser or extension."
                      : null}
                    <A.Space />
                  </span>
                  {this.props.noWeb3 ? null : (
                    <EnterButton
                      startLoading={this.props.isAnimationDone.value}
                      onClick={this.props.welcomeClick}
                    />
                  )}
                </S.Subtitle>
              </S.TextContent>
            </S.Content>
          </S.MainSection>
        </ParallaxLayer>
        <ParallaxLayer offset={4} speed={0} factor={1} />
        <ParallaxLayer offset={1.1} speed={0.2} style={{ opacity: 1 }}>
          <img
            src={VisOff}
            style={{ display: "block", width: "5%", marginLeft: "55%" }}
          />
          <img
            src={Quarantine}
            style={{ display: "block", width: "5%", marginLeft: "15%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={1.3} speed={0.5} style={{ opacity: 1 }}>
          <img
            src={banHammer}
            style={{ display: "block", width: "5%", marginLeft: "85%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={1.6} speed={0.7} style={{ opacity: 1 }}>
          <img
            src={SearchOff}
            style={{ display: "block", width: "5%", marginLeft: "40%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={1.7} speed={0.5} style={{ opacity: 1 }}>
          <img
            src={Error}
            style={{ display: "block", width: "5%", marginLeft: "10%" }}
          />
          <img
            src={Lock}
            style={{ display: "block", width: "5%", marginLeft: "75%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={2.7} speed={0.2} style={{ opacity: 1 }}>
          <img
            src={User2}
            style={{ display: "block", width: "5%", marginLeft: "70%" }}
          />
          <img
            src={User3}
            style={{ display: "block", width: "5%", marginLeft: "15%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={2.3} speed={0.5} style={{ opacity: 1 }}>
          <img
            src={User4}
            style={{ display: "block", width: "5%", marginLeft: "60%" }}
          />
          <img
            src={User5}
            style={{ display: "block", width: "5%", marginLeft: "30%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={2.1} speed={0.7} style={{ opacity: 1 }}>
          <img
            src={User}
            style={{ display: "block", width: "5%", marginLeft: "10%" }}
          />
          <img
            src={User6}
            style={{ display: "block", width: "5%", marginLeft: "85%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer
          offset={0}
          speed={0.1}
          onClick={() => this.parallax.scrollTo(1)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <img src={logo} style={{ width: "25%" }} />
          <TextWrapper>Welcome to the marketplace of ideas.</TextWrapper> */}
          <S.MainSection>
            <S.Content ref={this.props.contentRef}>
              <S.TextContent
                isAnimationDone={this.props.isAnimationDone.value}
                pose={this.props.homePose}
              >
                <S.Title>
                  {/* <S.Logo src={logo} /> */}
                  <S.TitleText>tartaros</S.TitleText>
                </S.Title>
              </S.TextContent>
            </S.Content>
          </S.MainSection>
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          speed={0.1}
          onClick={() => this.parallax.scrollTo(2)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpeechSplit night={this.props.night} />
          {/* <img src={url("bash")} style={{ width: "40%" }} /> */}
        </ParallaxLayer>
        <ParallaxLayer
          offset={2}
          speed={-0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => this.parallax.scrollTo(3)}
        >
          <AnonSplit />
        </ParallaxLayer>
        {/* <ParallaxLayer offset={3.2} speed={0.5} style={{ opacity: 0.1 }}>
          <img src={Server2} style={{ width: "5%", marginLeft: "70%" }} />
        </ParallaxLayer>
        <ParallaxLayer offset={3.2} speed={0.2} style={{ opacity: 1 }}>
          <img
            src={IPFS}
            style={{ display: "block", width: "5%", marginLeft: "10%" }}
          />
        </ParallaxLayer>

        <ParallaxLayer offset={3.6} speed={0.5} style={{ opacity: 0.1 }}>
          <img
            src={Server}
            style={{ display: "block", width: "5%", marginLeft: "20%" }}
          />
          <img
            src={Server}
            style={{ display: "block", width: "5%", marginLeft: "30%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer offset={3.7} speed={0.2} style={{ opacity: 1 }}>
          <img
            src={Ethereum}
            style={{ display: "block", width: "5%", marginLeft: "75%" }}
          />
        </ParallaxLayer> */}
        <ParallaxLayer
          offset={3}
          speed={1}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${ConnectedStars})`,
            backgroundSize: "cover",
          }}
          onClick={() => this.parallax.scrollTo(4)}
        >
          <DecentSplit />
        </ParallaxLayer>
        <ParallaxLayer
          offset={4}
          speed={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => this.parallax.scrollTo(5)}
        >
          <InfoSplit />
        </ParallaxLayer>
      </Parallax>
    );
  }
}

export default TestParallax;

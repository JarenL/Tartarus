import React from "react";
import ReactDOM from "react-dom";
import { Parallax, ParallaxLayer } from "react-spring/addons";
import "./style.css";
import logo from "../../images/tartarus.svg";
import banHammer from "../../images/ban-hammer2.png";
import styled from "styled-components";
import SpeechSplit from "../About/Split/SpeechSplit";
import DesertDark from "../../images/desert-dark.svg";
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
import IPFS from "../../images/ipfs.svg";
import Ethereum from "../../images/ethereum.svg";

const LogoWrapper = styled.div`
  width: 100%;
  // height: 100%;
  // justify-content: center;
  margin-right: auto;
  margin-left: auto;
  // align-self: center;
`;

const TextWrapper = styled.span`
  font-size: 32px;
  color: ${(props) => props.theme.mutedText};
`;

// Little helpers ...
const url = (name, wrap = false) =>
  `${
    wrap ? "url(" : ""
  }https://awv3node-homepage.surge.sh/build/assets/${name}.svg${
    wrap ? ")" : ""
  }`;
const Pink = ({ children }) => (
  <span style={{ color: "#FF6AC1" }}>{children}</span>
);
const Yellow = ({ children }) => (
  <span style={{ color: "#EFF59B" }}>{children}</span>
);
const Lightblue = ({ children }) => (
  <span style={{ color: "#9AEDFE" }}>{children}</span>
);
const Green = ({ children }) => (
  <span style={{ color: "#57EE89" }}>{children}</span>
);
const Blue = ({ children }) => (
  <span style={{ color: "#57C7FF" }}>{children}</span>
);
const Gray = ({ children }) => (
  <span style={{ color: "#909090" }}>{children}</span>
);

class TestParallax extends React.Component {
  render() {
    return (
      <Parallax ref={(ref) => (this.parallax = ref)} pages={5}>
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={4}
          style={{
            backgroundImage: url("stars", true),
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
          offset={4}
          speed={0}
          factor={1}
          style={{
            backgroundImage: `url(${DesertDark})`,
            backgroundSize: "cover",
          }}
        />

        <ParallaxLayer offset={1.1} speed={0.2} style={{ opacity: 1 }}>
          <img
            src={Lock}
            style={{ display: "block", width: "5%", marginLeft: "55%" }}
          />
          <img
            src={VisOff}
            style={{ display: "block", width: "5%", marginLeft: "15%" }}
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1.3} speed={0.5} style={{ opacity: 1 }}>
          <img
            src={Voice}
            style={{ display: "block", width: "5%", marginLeft: "70%" }}
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1.6} speed={0.7} style={{ opacity: 1 }}>
          <img
            src={Hammer}
            style={{ display: "block", width: "5%", marginLeft: "40%" }}
          />
        </ParallaxLayer>

        <ParallaxLayer offset={1.7} speed={0.5} style={{ opacity: 1 }}>
          <img
            src={Error}
            style={{ display: "block", width: "5%", marginLeft: "10%" }}
          />
          <img
            src={SearchOff}
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
            style={{ display: "block", width: "5%", marginLeft: "75%" }}
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
          <img src={logo} style={{ width: "25%" }} />
          <TextWrapper>Welcome to the marketplace of ideas.</TextWrapper>
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
          <SpeechSplit />
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

        <ParallaxLayer offset={3.2} speed={0.5} style={{ opacity: 0.1 }}>
          <img src={url("server")} style={{ width: "5%", marginLeft: "70%" }} />
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
          {/* <img
            src={Server}
            style={{ display: "block", width: "5%", marginLeft: "30%" }}
          /> */}
        </ParallaxLayer>

        <ParallaxLayer offset={3.7} speed={0.2} style={{ opacity: 1 }}>
          <img
            src={Ethereum}
            style={{ display: "block", width: "5%", marginLeft: "75%" }}
          />
        </ParallaxLayer>
        <ParallaxLayer
          offset={3}
          speed={1}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => this.parallax.scrollTo(4)}
        >
          <DecentSplit />
        </ParallaxLayer>
        <ParallaxLayer
          offset={4}
          speed={0}
          onClick={() => this.parallax.scrollTo(0)}
        >
        </ParallaxLayer>
      </Parallax>
    );
  }
}

export default TestParallax;

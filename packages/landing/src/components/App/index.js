import React, { useRef, useState } from "react";
import * as S from "./styles";
import * as A from "../../styles/shared-components";
import EnterButton from "../EnterButton";
import Background from "../Background";
import logo from "../../images/tartarus.png";
import About from "../About";

import {
  useGoogleAnalytics,
  useHovered,
  useToggleBodyClass,
  useFindElementCenter,
  useMousePosition,
  useCanHover,
  useClock,
} from "../../utils/hooks";

import useIntroAnimation from "./use-intro-animation";

import "focus-visible";
import { useBoolean } from "react-hanger";

//env
const { REACT_APP_ANALYTICS_ID, REACT_APP_DOWNLOAD_LINK } = process.env;

const redirectDownload = () => {
  if (window.location.href.includes("get-app")) {
    window.location.replace(REACT_APP_DOWNLOAD_LINK);
  }
};

function Home({ isAnimationDone, night, noWeb3, noAccount, welcomeClick }) {
  redirectDownload();

  const [composeIsOpen, setComposeOpen] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);

  const [text, setText] = useState(
    `Woah! With twizzle.app I can use Twitter DMs and tweet directly from the menubar. Sweet! 😄️`
  );

  // refs
  const contentRef = useRef();
  const messagesWindowRef = useRef();

  //custom hooks
  const isInSizzy = window.__sizzy;
  const { fabPose, menuBarPose, messagesPose, homePose } = useIntroAnimation(
    !isInSizzy,
    isAnimationDone
  );
  const canHover = useCanHover();
  const isHoveringMessages = useHovered();
  const isHoveringCompose = useHovered();
  const windowCenter = useFindElementCenter(messagesWindowRef);
  const { y: mouseY } = useMousePosition(isHoveringCompose.value);
  const clock = useClock();
  const showModal = useBoolean(false);

  // side effects
  useGoogleAnalytics(REACT_APP_ANALYTICS_ID, isAnimationDone.value);
  useToggleBodyClass(isAnimationDone.value, ["scroll", "no-scroll"]);

  // computed
  const isNotHoveringMenuBar = mouseY === null || mouseY >= 25;
  const showComposeWindow =
    composeIsOpen || (isHoveringCompose.value && isNotHoveringMenuBar);
  const isBig = window.innerWidth > 450;

  // methods
  const onToggleNight = () => {
    night.toggle();
    setToggleCount(toggleCount + 1);
  };

  return (
    <S.Home>
      <S.MainSection>
        <Background
          night={night}
          startLoadingLight={isAnimationDone.value}
          show={isBig}
        />
        <S.MainSection>
          <S.Content ref={contentRef}>
            <S.WindowBox
              ref={messagesWindowRef}
              initialPose="hidden"
              pose={homePose}
              {...windowCenter}
            ></S.WindowBox>

            <S.TextContent
              isAnimationDone={isAnimationDone.value}
              pose={homePose}
            >
              <S.Title>
                <S.Logo src={logo} />
                <S.TitleText>tartaros</S.TitleText>
              </S.Title>

              {/* <A.Space huge /> */}
              <S.Subtitle>
                <span>
                  Welcome to the marketplace of ideas.
                  <A.Space />
                  {noWeb3
                    ? "No web3 detected. Please use a web3 compatible Browser or extension."
                    : null}
                  <A.Space />
                </span>
                {noWeb3 ? null : (
                  <EnterButton
                    startLoading={isAnimationDone.value}
                    onClick={welcomeClick}
                  />
                )}
              </S.Subtitle>

              {/* <A.Space /> */}
            </S.TextContent>
          </S.Content>
        </S.MainSection>
        <S.SubSection>
          {/*  */}
          <S.TestContent>
            <About />
          </S.TestContent>
        </S.SubSection>
      </S.MainSection>
    </S.Home>
  );
}

export default Home;

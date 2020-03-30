import React, { useRef, useState } from "react";

//icons (imported as svg using babel plugin)
// import faBatteryFull from '../../icons/bat-charge.svg';
// import faVolumeUp from '../../icons/volume-up.svg';
// import faWifi from '../../icons/wifi.svg';
// import faFeather from '../../icons/feather.svg';

//styles
import * as S from "./styles";
import * as A from "../../styles/shared-components";

//components
// import Messages from '../Messages';
import DayNightSwitch from "../DayNightSwitch";
// import MenuBar from '../MenuBar';
// import Compose from '../Compose';
// import ToggleCount from '../ToggleCount';
import DownloadButton from '../DownloadButton';
import Background from "../Background";
// import Footer from '../Footer';
import logo from "../../images/tartarus.png";

//hooks
import {
  useGoogleAnalytics,
  useHovered,
  useToggleBodyClass,
  useFindElementCenter,
  useMousePosition,
  useCanHover,
  useClock
} from "../../utils/hooks";

import useIntroAnimation from "./use-intro-animation";

import "focus-visible";
// import DownloadModal from '../DownloadModal';
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

  const tweetProgress = () => {
    setText(
      `I'm having too much fun with the day/night switch on twizzle.app 🤦️ ${toggleCount} times so far! 😂️`
    );
    setComposeOpen(true);
  };

  return (
    <S.Home>
      {/* {showModal.value && <DownloadModal onClose={showModal.setFalse} />} */}
      <S.MainSection>
        <Background
          night={night}
          startLoadingLight={isAnimationDone.value}
          show={isBig}
        />

        {/* <MenuBar
          className="menubar"
          pose={menuBarPose}
          selected={showComposeWindow}
          onClick={() => setComposeOpen(v => !v)}
          mainIcon={faFeather}
          icons={[faWifi, clock, faVolumeUp, '100%', faBatteryFull]}
        /> */}

        {/* <Compose
          {...isHoveringCompose.bind}
          text={text}
          setText={setText}
          setComposeOpen={setComposeOpen}
          composeIsOpen={composeIsOpen}
          visible={showComposeWindow}
        /> */}

        <S.Content ref={contentRef}>
          <S.WindowBox
            ref={messagesWindowRef}
            initialPose="hidden"
            pose={homePose}
            {...windowCenter}
          >
            {/* <S.Window night={night.value} hovering={isHoveringMessages.value}>
              <Messages
                messagesPose={messagesPose}
                fabPose={fabPose}
                night={night.value}
                onToggleNight={onToggleNight}
              />
            </S.Window> */}
          </S.WindowBox>

          {/* <A.Space huge /> */}

          <S.TextContent
            isAnimationDone={isAnimationDone.value}
            pose={homePose}
          >
            <S.Title>
              <S.Logo src={logo} />
              <S.TitleText>tartarus</S.TitleText>
            </S.Title>

            <A.Space huge />
            <S.Subtitle>
              {/* <span>
                Create. Discuss. Uninhibited.

              </span> */}
              {/* <br />
              <span>
              </span>
              <br />
              <span>
              </span>
              <br /> */}
              {/* <br /> */}
              <span>
                Welcome to the marketplace of ideas.
                {/* Focus on <A.Hover {...isHoveringMessages.bind}>messages</A.Hover> and{' '} */}
                {/* <A.Hover
                  {...(canHover ? isHoveringCompose.bind : { onClick: () => setComposeOpen(true) })}
                  className="tweeting"
                >
                  tweeting
                </A.Hover> */}
                <A.Space />
                {noWeb3 ? "No web3 detected. Please use a web3 compatible Browser or extension." : null}
                <A.Space />
              </span>
              {noWeb3 ? null : <DownloadButton startLoading={isAnimationDone.value} onClick={welcomeClick} /> }


              {/* <span>The timeline can wait.</span> */}
            </S.Subtitle>

            <A.Space />

          </S.TextContent>
        </S.Content>
      </S.MainSection>
      {/* <Footer composeIsOpen={composeIsOpen} menuBarPose={menuBarPose} /> */}
    </S.Home>
  );
}

export default Home;

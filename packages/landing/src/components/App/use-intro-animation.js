import { useEffect } from 'react';
import { usePose, useVisiblePose } from 'utils/hooks';
import { devAndProd } from 'utils/dev-prod';
import sequence from 'utils/sequence';

const useIntroAnimation = (showInDev = true, isAnimationDone) => {
  // poses
  const { pose: homePose, setPose: setHomePose } = usePose('hidden', ['hidden', 'middle', 'normal']);
  const [fabPose, setFabPose] = useVisiblePose(false);
  const [menuBarPose, setMenubarPose] = useVisiblePose(false);

  useEffect(() => {
    //always show animation in prod, but toggle it in dev
    const showAnimation = isAnimationDone.value === false && devAndProd(showInDev, true);

    if (showAnimation) {
      sequence([
        0,
        () => setHomePose('hiddenCenter'),
        200,
        () => setHomePose('middle'),
        200,
        () => setHomePose('normal'),
        200,
        () => setFabPose(true),
        200,
        () => {
          setMenubarPose(true);
          isAnimationDone.setTrue();
        }
      ]);
    } else {
      setHomePose('normal');
      setFabPose(true);
      setMenubarPose(true);
      isAnimationDone.setTrue();
    }
  }, []);

  return {
    homePose,
    fabPose,
    menuBarPose,
    isAnimationDone: isAnimationDone.value
  };
};

export default useIntroAnimation;

import React, { useContext, useEffect, useMemo } from "react";
import { WindowDataContext } from "../Window";
import { randomChar } from "../../utils";
import bonziBuddyImg from "../../images/bonzi_buddy.gif";
import { useBoundStore } from "../../store";

const Virus = () => {
  const { setTitle, sysObj } = useContext(WindowDataContext) ?? {};
  const array = useMemo(() => Array.from(Array(50)), []);
  const addWindow = useBoundStore((state) => state.addWindow);
  useEffect(() => {
    if (!setTitle) return;
    setTitle(`Uh oh you've got a virus`);
    let interval: NodeJS.Timeout | null = null;
    const timeout = setTimeout(
      () =>
        (interval = setInterval(() => {
          setTitle(array.map(randomChar).join(""));
          sysObj && addWindow(sysObj);
        }, 1000)),
      1000,
    );

    return () => {
      clearTimeout(timeout);
      interval && clearInterval(interval);
    };
  }, [setTitle]);

  return (
    <img
      src={bonziBuddyImg}
      alt="Loser"
      className="h-full bg-[url('/bg_imgs/rainbow.png')] bg-contain bg-repeat object-contain"
    />
  );
};

export default Virus;

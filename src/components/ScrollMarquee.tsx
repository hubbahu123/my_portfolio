import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";
import React from "react";
import { mod } from "../utils";

interface MarqueeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  scroll?: MotionValue<number>;
  innerClass?: string;
  panSpeed?: number;
  scrollStrength?: number;
  vertical?: boolean;
}

const ScrollMarquee: React.FC<MarqueeProps> = (props) => {
  const {
    children,
    className = "",
    innerClass = "",
    panSpeed = 10,
    scrollStrength = 0.002,
    vertical = false,
    scroll = useScroll().scrollY,
    style,
    ...rest
  } = props;

  const fullInnerClass = `inline-block ${vertical ? "min-h-full" : "min-w-full"} ${innerClass}`;
  const smoothScroll = useSpring(useVelocity(scroll), {
    damping: 50,
    stiffness: 400,
  });
  const x = useMotionValue("0%");
  const secondX = useMotionValue("100%");
  useAnimationFrame((_, delta) => {
    const val =
      mod(
        parseFloat(x.get()) +
          (delta / 1000) * panSpeed +
          smoothScroll.get() * scrollStrength +
          100,
        200,
      ) - 100;
    x.set(`${val}%`);
    secondX.set(`${(val > 0 ? -100 : 100) + val}%`);
  });

  return (
    <div
      {...rest}
      className={`${className} group relative ${vertical ? "h-full" : "w-full"} overflow-hidden whitespace-nowrap`}
      style={{
        ...style,
        textOrientation: vertical ? "upright" : style?.textOrientation,
        writingMode: vertical ? "vertical-lr" : style?.writingMode,
      }}
    >
      <motion.span
        className={fullInnerClass}
        style={vertical ? { y: x } : { x }}
      >
        {children}
      </motion.span>
      <motion.span
        className={`absolute ${vertical ? "top-0" : "left-0"} ${fullInnerClass}`}
        style={vertical ? { y: secondX } : { x: secondX }}
      >
        {children}
      </motion.span>
    </div>
  );
};

export default ScrollMarquee;

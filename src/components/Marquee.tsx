import React from "react";

interface MarqueeProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  innerClass?: string;
  panTime?: number;
  pauseOnHover?: boolean;
  vertical?: boolean;
}

const Marquee: React.FC<MarqueeProps> = (props) => {
  const {
    children,
    className = "",
    innerClass = "",
    panTime = 10,
    pauseOnHover = true,
    vertical = false,
    style,
    ...rest
  } = props;
  const durationStr = `${panTime}s`;
  const delayStr = `-${panTime / 2}s`;
  const fullInnerClass = `inline-block ${vertical ? "animate-pan-vertical min-h-full" : "animate-pan min-w-full"} ${innerClass} ${pauseOnHover && "group-hover:animate-pause"}`;

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
      <span
        className={fullInnerClass}
        style={{
          animationDuration: durationStr,
          MozAnimationDuration: durationStr,
          WebkitAnimationDuration: durationStr,
        }}
      >
        {children}
      </span>
      <span
        className={`absolute ${vertical ? "top-0" : "left-0"} ${fullInnerClass}`}
        style={{
          animationDuration: durationStr,
          MozAnimationDuration: durationStr,
          WebkitAnimationDuration: durationStr,
          animationDelay: delayStr,
          MozAnimationDelay: delayStr,
          WebkitAnimationDelay: delayStr,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default Marquee;

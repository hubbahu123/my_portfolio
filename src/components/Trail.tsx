import { motion, useAnimationFrame } from "framer-motion";
import React, { ReactNode, useRef, useState } from "react";
import { randRange } from "../utils";

interface TrailProps {
  //Root can be a slow math function. Got rid of it in distance bc I can
  children: ReactNode;
  sqrSpawnDist?: number;
  minSize?: number;
  maxSize?: number;
}

const Trail: React.FC<TrailProps> = ({
  children,
  sqrSpawnDist = 17500,
  minSize = 1,
  maxSize = 1,
}) => {
  const [trailElements, setTrailElements] = useState<ReactNode[]>([]);
  const mousePos = useRef({
    x: 0,
    y: 0,
    lastX: sqrSpawnDist,
    lastY: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    const { x, y, lastX, lastY } = mousePos.current;
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    const sqrDist = deltaX * deltaX + deltaY * deltaY;
    if (sqrDist > sqrSpawnDist) {
      mousePos.current.lastX = x;
      mousePos.current.lastY = y;
      setTrailElements((prev) => [
        ...prev,
        <motion.div
          className="pointer-events-none absolute select-none"
          initial={{ x, y, scale: randRange(minSize, maxSize) }}
          animate={{ x, y: y + 10, opacity: 0 }}
          onAnimationComplete={() =>
            setTrailElements((prev) => {
              prev.shift();
              return prev;
            })
          }
          transition={{
            type: "tween",
            duration: 0.5,
            ease: "easeOut",
          }}
          key={`(${x},${y})`}
        >
          {children}
        </motion.div>,
      ]);
    }
  });

  return (
    <div
      className="absolute left-0 top-0 z-10 h-full w-full"
      ref={containerRef}
      onPointerMove={(e) => {
        if (!containerRef.current) return;
        const bounds = containerRef.current.getBoundingClientRect();
        mousePos.current.x = e.clientX - bounds.left;
        mousePos.current.y = e.clientY - bounds.top;
      }}
    >
      {trailElements}
    </div>
  );
};

export default Trail;

import { motion, useSpring, useMotionValue } from "framer-motion";
import React, { ReactNode, useRef } from "react";

interface FollowProps {
  children: ReactNode;
}

const Follow: React.FC<FollowProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(0);

  return (
    <div
      className="absolute left-0 top-0 z-10 h-full w-full"
      ref={containerRef}
      onPointerMove={(e) => {
        if (!containerRef.current) return;
        opacity.set(1);
        const bounds = containerRef.current.getBoundingClientRect();
        x.set(e.clientX - bounds.left);
        y.set(e.clientY - bounds.top);
      }}
      onPointerLeave={() => opacity.set(0)}
    >
      <motion.div
        style={{ x, y, opacity }}
        className="pointer-events-none select-none"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Follow;

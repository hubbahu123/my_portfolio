import React, { useState } from "react";
import { pickRand } from "../utils";

interface TagProps {
  children: string;
  className?: string;
  bg?: "random" | "solid";
}

const Tag: React.FC<TagProps> = ({ children, bg, className }) => {
  const [randBg] = useState(
    pickRand([
      "bg-blue-accent",
      "bg-pink-accent",
      "bg-purple-accent",
      "bg-burgundy-accent",
    ]),
  );
  return (
    <span
      className={`whitespace-nowrap p-2 py-1 outline outline-2 outline-white-primary ${className} ${
        bg && (bg == "random" ? randBg : "bg-white-primary text-black-primary")
      }`}
    >
      {children}
    </span>
  );
};

export default Tag;

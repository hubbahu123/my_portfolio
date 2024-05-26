import React, { useContext, useEffect, useRef, useState } from "react";
import { WindowDataContext } from "../Window";
import throbber from "../../images/throbber.gif";
import { motion } from "framer-motion";

const PDFReader = () => {
  const { setTitle, sysObj } = useContext(WindowDataContext) ?? {};
  useEffect(() => {
    if (setTitle && sysObj) setTitle(`${sysObj.name}.pdf - PDF Reader`);
  }, [setTitle]);

  return (
    <>
      <object
        data="./resume.pdf"
        type="application/pdf"
        width="100%"
        height="100%"
        className="h-full"
      >
        <iframe
          src="./resume.pdf"
          width="100%"
          height="100%"
          className="h-full border-none"
        >
          <PDFNoSupport />
        </iframe>
      </object>
    </>
  );
};

const PDFNoSupport = () => {
  const downloadLink = useRef<HTMLAnchorElement>(null);
  const [dowloaded, setDowloaded] = useState(false);
  useEffect(() => {
    if (!downloadLink.current) return;
    if (downloadLink.current.clientWidth === 0) return;
    //If all else fails, object and iframe must not be supported, so use default method
    if (dowloaded) return;
    downloadLink.current.click();
    setDowloaded(true); //Prevents double downloads
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden bg-black-primary">
      <div className="min-w-0 flex-shrink overflow-hidden">
        <motion.div
          className="h-full w-40 rotate-180 bg-[url('/bg_imgs/grid.png')] bg-contain bg-repeat-y"
          animate={{ backgroundPositionY: "160px" }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
            type: "tween",
          }}
        />
      </div>
      <div className="flex flex-grow flex-col items-center justify-center px-8 text-center">
        <img src={throbber} alt="Throbber" className="w-16" />
        <a
          className="text-md pt-8 text-white-primary"
          href="./resume.pdf"
          download="resume.pdf"
          ref={downloadLink}
        >
          Should download soon...
        </a>
      </div>
      <div className="min-w-0 flex-shrink overflow-hidden">
        <motion.div
          className="float-right h-full w-40 bg-[url('/bg_imgs/grid.png')] bg-contain bg-repeat-y"
          animate={{ backgroundPositionY: "160px" }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
            type: "tween",
          }}
        />
      </div>
    </div>
  );
};
export default PDFReader;

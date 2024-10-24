import React from "react";
import { createContext, useEffect } from "react";
import { useBreakpointMD, useBreakpointShort } from "../utils";
import arrowUp from "../images/arrow_up.png";
import arrowUpActive from "../images/arrow_up_active.png";
import arrowDown from "../images/arrow_down.png";
import arrowDownActive from "../images/arrow_down_active.png";
import ShortcutsArea from "./ShortcutsArea";
import Background from "./Background";
import Taskbar from "./Taskbar";
import MobileTaskbar from "./MobileTaskbar";
import Intro from "./Intro";
import { usePersistent } from "../utils";
import Loader from "./Loader";
import WindowsArea from "./WindowsArea";
import Modifiers from "./Modifiers";

export const MobileContext = createContext(true);

const OS: React.FC = () => {
	const wide = useBreakpointMD();
	const tall = useBreakpointShort();
	const isMobile = !wide || !tall;
	const mainRef = React.useRef<HTMLDivElement>(null);

	//Updates global css properties
	useEffect(() => {
		const documentStyle = document.documentElement.style;
		const updateVH = () =>
			documentStyle.setProperty("--vh-full", `${window.innerHeight}px`);
		window.addEventListener("resize", updateVH);
		window.addEventListener("orientationchange", updateVH);
		updateVH();

		documentStyle.setProperty("--arrow-up", `url("${arrowUp}")`);
		documentStyle.setProperty("--arrow-up-active", `url("${arrowUpActive}")`);
		documentStyle.setProperty("--arrow-down", `url("${arrowDown}")`);
		documentStyle.setProperty(
			"--arrow-down-active",
			`url("${arrowDownActive}")`,
		);

		//I don't know why this is a bug
		if (mainRef.current)
			!isMobile
				? mainRef.current.classList.remove("use-scrollbar")
				: mainRef.current.classList.add("use-scrollbar");

		return () => {
			window.removeEventListener("resize", updateVH);
			window.removeEventListener("orientationchange", updateVH);
			documentStyle.removeProperty("--vh-full");
		};
	}, []);

	const [ready, introDone, setIntroDone] = usePersistent(
		"introDone",
		isMobile,
		(str) => str === "true",
	);

	return (
		<MobileContext.Provider value={isMobile}>
			<main
				className={`relative h-screen w-screen overflow-hidden bg-black ${isMobile && "use-scrollbar"}`}
				style={{ height: "var(--vh-full, 100vh)" }}
				ref={mainRef}
			>
				{ready &&
					(introDone ? (
						<Loader>
							<Background />
							{isMobile ? <MobileTaskbar /> : <Taskbar />}
							<ShortcutsArea />
							<WindowsArea />
						</Loader>
					) : (
						<Intro onFinish={() => setIntroDone(true)} />
					))}
				<Modifiers />
			</main>
		</MobileContext.Provider>
	);
};

export default OS;

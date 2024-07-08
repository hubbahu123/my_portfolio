import React, { useEffect, useState } from 'react';
import { useBoundStore, useMobileStore, useSettingsStore } from '../store';
import { StaticImage } from 'gatsby-plugin-image';
import { easeSteps, useInterval } from '../utils';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { clamp } from 'three/src/math/MathUtils';
import Battery from './Battery';
import Slider from './Slider';
import ToggleBtn from './ToggleBtn';
import { useBackgroundSound, usePlaySound } from '../utils/sound';
import bgMusic from '../audio/background.mp3';
import mobileIcons from '../images/mobile_icon.png';
import exitSound from '../audio/shutdown.mp3';
import gitHubImg from '../images/github.png';
import linkedInImg from '../images/linkedIn.png';
import restartImg from '../images/restart.png';
import shutdownImg from '../images/shutdown.png';

const MobileTaskbar = () => {
	const {
		brightness,
		setBrightness,
		use3D,
		set3D,
		useStatic,
		setStatic,
		scanlines,
		setScanlines,
		useFlicker,
		setFlicker,
		volume,
		setVolume,
		fancyText,
		setFancyText,
		lightModeText,
		lightMode,
		setLightMode,
		fullscreen,
		setFullscreen,
		initFullscreen,
		restart,
		shutdown,
	} = useSettingsStore(state => state);
	const [toggleMenu, home, back, windowOpen, menuOpen] = useMobileStore(
		state => [
			state.toggleMenu,
			state.home,
			state.back,
			state.windowOpen,
			state.menuOpen,
		]
	);
	const windows = useBoundStore(state => state.windows.length);

	const [playBg, pauseBg] = useBackgroundSound(bgMusic, 0.5);
	const [playShutdown] = usePlaySound(exitSound, 1);

	const settingsReveal = useMotionValue(0);

	const [now, setNow] = useState<Date>();
	useInterval(() => setNow(new Date()), 1000);

	const [battery, setBattery] = useState(1);
	useEffect(() => {
		setVolume(0);
		initFullscreen();

		if (!('getBattery' in navigator))
			return setBattery(Math.max(Math.random(), 0.001));
		let batteryRef: any, updateBattery: Function;
		//@ts-ignore
		navigator.getBattery().then(batt => {
			batteryRef = batt;
			updateBattery = () => setBattery(batt.level);
			batt.addEventListener('levelchange', updateBattery);
			updateBattery();
		});
		return () =>
			batteryRef?.removeEventListener('levelchange', updateBattery);
	}, []);

	return (
		<>
			<motion.div
				style={{
					opacity: settingsReveal,
					pointerEvents: useTransform(settingsReveal, val =>
						val == 0 ? 'none' : 'auto'
					),
				}}
				className="fixed touch-none top-0 w-full z-40 h-full bg-black-primary/75 backdrop-blur-lg p-4 pt-16 pb-12 text-white-primary"
				drag
				dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
				dragElastic={0}
				dragMomentum={false}
				onDragStart={() => {
					document.documentElement.classList.add('cursor-grab');
					document.body.classList.add('pointer-events-none');
				}}
				onDrag={(_e, info) =>
					settingsReveal.set(
						clamp(1 + info.offset.y / window.innerHeight, 0, 1)
					)
				}
				onDragEnd={() => {
					document.documentElement.classList.remove('cursor-grab');
					document.body.classList.remove('pointer-events-none');
					animate(
						settingsReveal,
						settingsReveal.get() > 0.65 ? 1 : 0
					);
				}}
			>
				<motion.div
					className="grid grid-cols-2 h-full gap-4"
					style={{
						y: useTransform(
							settingsReveal,
							val => `${(1 - val) * -100}%`
						),
						gridTemplateRows: 'auto repeat(5, 1fr) auto auto',
					}}
				>
					<div className="flex justify-end gap-4 col-span-2">
						<a
							href="https://www.linkedin.com/in/reda-elmountassir"
							target="_blank"
							className="cursor-pointer"
						>
							<img
								src={linkedInImg}
								alt="LinkedIn Logo"
								height={24}
							/>
						</a>
						<a
							href="https://github.com/redaelmountassir"
							target="_blank"
							className="cursor-pointer"
						>
							<img
								src={gitHubImg}
								alt="GitHub Logo"
								height={24}
							/>
						</a>
						<button
							type="button"
							className="cursor-pointer"
							onClick={() => {
								restart();
								pauseBg();
								playShutdown();
							}}
						>
							<img
								src={restartImg}
								alt="restart symbol"
								height={24}
							/>
						</button>
						<button
							type="button"
							className="cursor-pointer"
							onClick={() => {
								shutdown();
								pauseBg();
								playShutdown();
							}}
						>
							<img
								src={shutdownImg}
								alt="shutdown symbol"
								height={24}
							/>
						</button>
					</div>
					<h3 className="text-7xl col-span-2 font-display my-5 short:my-10">
						{now?.toLocaleDateString([], {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
						})}
					</h3>
					<ToggleBtn setter={set3D} state={use3D}>
						3D Background
					</ToggleBtn>
					<ToggleBtn setter={setStatic} state={useStatic}>
						Static
					</ToggleBtn>
					<ToggleBtn setter={setScanlines} state={scanlines}>
						Scanlines
					</ToggleBtn>
					<ToggleBtn setter={setFlicker} state={useFlicker}>
						Flicker
					</ToggleBtn>
					<ToggleBtn setter={setLightMode} state={lightMode}>
						{lightModeText}
					</ToggleBtn>
					<ToggleBtn setter={setFancyText} state={fancyText}>
						Fancy Text
					</ToggleBtn>
					<ToggleBtn setter={setFullscreen} state={fullscreen}>
						Fullscreen
					</ToggleBtn>
					<Slider
						className="col-span-2 mt-6 short:mt-16"
						state={brightness}
						setter={setBrightness}
						purpose="Brightness"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 -0.5 16 16"
							shapeRendering="crispEdges"
						>
							<path
								className="stroke-white-primary transition"
								d="M7 4h2M5 5h2M9 5h2M5 6h1M10 6h1M4 7h1M11 7h1M4 8h1M11 8h1M5 9h1M10 9h1M5 10h2M9 10h2M7 11h2"
							/>
							{[
								'M11 0h1M10 1h1M10 2h1',
								'M15 4h1M13 5h2',
								'M13 10h2M15 11h1',
								'M10 13h1M10 14h1M11 15h1',
								'M5 13h1M5 14h1M4 15h1',
								'M1 10h2M0 11h1',
								'M0 4h1M1 5h2',
								'M4 0h1M5 1h1M5 2h1',
							].map((path, i, arr) => (
								<path
									key={path}
									className={`origin-center scale-0 stroke-transparent transition ${
										brightness >=
											((arr.length - i) / arr.length) *
												100 &&
										'!scale-100 !stroke-white-primary'
									}`}
									d={path}
								/>
							))}
						</svg>
					</Slider>
					<Slider
						state={volume}
						setter={(val: number) => {
							setVolume(val);
							playBg();
						}}
						purpose="Volume"
						className="col-span-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 -0.5 16 16"
							shapeRendering="crispEdges"
						>
							<path
								className="stroke-white-primary"
								d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
							/>
							<path
								className={`-translate-x-1 stroke-transparent transition ${
									volume > 0 &&
									'!translate-x-0 !stroke-white-primary'
								}`}
								d="M9 6h1M10 7h1M10 8h1M9 9h1"
							/>
							<path
								className={`-translate-x-1 stroke-transparent transition ${
									volume > 33.3 &&
									'!translate-x-0 !stroke-white-primary'
								}`}
								d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
							/>
							<path
								className={`-translate-x-1 stroke-transparent transition ${
									volume > 66.6 &&
									'!translate-x-0 !stroke-white-primary'
								}`}
								d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
							/>
							<path
								className={`stroke-transparent transition ${
									volume == 0 && '!stroke-white-primary'
								}`}
								d="M11 6h1M15 6h1M12 7h1M14 7h1M13 8h1M12 9h1M14 9h1M11 10h1M15 10h1"
							/>
						</svg>
					</Slider>
				</motion.div>
			</motion.div>
			<motion.div
				style={{
					pointerEvents: useTransform(settingsReveal, val =>
						val == 1 ? 'none' : 'auto'
					),
				}}
				className="fixed touch-none top-0 w-full p-4 text-white-primary z-40 cursor-grab flex gap-2 items-center"
				drag
				dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
				dragElastic={0}
				dragMomentum={false}
				onDragStart={() => {
					document.documentElement.classList.add('cursor-grab');
					document.body.classList.add('pointer-events-none');
				}}
				onDrag={(_e, info) =>
					settingsReveal.set(
						clamp(info.offset.y / window.innerHeight, 0, 1)
					)
				}
				onDragEnd={() => {
					document.documentElement.classList.remove('cursor-grab');
					document.body.classList.remove('pointer-events-none');
					animate(
						settingsReveal,
						settingsReveal.get() > 0.35 ? 1 : 0
					);
				}}
			>
				<p>
					{now?.toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}) ?? 'Loading...'}
				</p>
				<img
					src={mobileIcons}
					alt="Mobile icons"
					className="ml-auto h-4"
					height={16}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 -0.5 16 16"
					shapeRendering="crispEdges"
					className="h-5"
				>
					<path
						className="stroke-white-primary"
						d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
					/>
					<path
						className={`-translate-x-1 stroke-transparent transition ${
							volume > 0 && '!translate-x-0 !stroke-white-primary'
						}`}
						d="M9 6h1M10 7h1M10 8h1M9 9h1"
					/>
					<path
						className={`-translate-x-1 stroke-transparent transition ${
							volume > 33.3 &&
							'!translate-x-0 !stroke-white-primary'
						}`}
						d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
					/>
					<path
						className={`-translate-x-1 stroke-transparent transition ${
							volume > 66.6 &&
							'!translate-x-0 !stroke-white-primary'
						}`}
						d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
					/>
					<path
						className={`stroke-transparent transition ${
							volume == 0 && '!stroke-white-primary'
						}`}
						d="M11 6h1M15 6h1M12 7h1M14 7h1M13 8h1M12 9h1M14 9h1M11 10h1M15 10h1"
					/>
				</svg>
				<p>{Math.floor(battery * 100)}%</p>
				<Battery level={battery} className="h-6" />
			</motion.div>
			<motion.nav
				className="fixed bottom-0 w-full px-4 py-2 font-bold md:top-0 md:bottom-auto md:p-0 z-30"
				variants={{
					unloaded: { opacity: 0, y: '100%' },
					loaded: {
						opacity: 1,
						y: 0,
						transition: {
							type: 'tween',
							ease: easeSteps(5),
							delay: 0.5,
						},
					},
				}}
			>
				<div
					className={`outline-2 outline-white-primary flex text-white from-black-primary/75 to-dark-primary/75 from-25% to-70% relative ${(!windowOpen || menuOpen) && 'bg-gradient-to-r outline'}`}
				>
					<button
						className="grow flex justify-center py-2 select-none"
						type="button"
						onClick={() => {
							if (windows == 0 && menuOpen) return home();
							toggleMenu();
						}}
					>
						<StaticImage
							src="../images/menu.png"
							alt="menu"
							placeholder="none"
							draggable={false}
							className="w-12 h-12"
						/>
					</button>
					<button
						className="grow flex justify-center py-2 select-none"
						type="button"
						onClick={() => home()}
					>
						<StaticImage
							src="../images/home.png"
							alt="home"
							placeholder="none"
							draggable={false}
							className="w-12 h-12"
						/>
					</button>
					<button
						className="grow flex justify-center py-2 select-none"
						type="button"
						onClick={() => back()}
					>
						<StaticImage
							src="../images/back.png"
							alt="back"
							placeholder="none"
							draggable={false}
							className="w-12 h-12"
						/>
					</button>
				</div>
			</motion.nav>
		</>
	);
};

export default MobileTaskbar;

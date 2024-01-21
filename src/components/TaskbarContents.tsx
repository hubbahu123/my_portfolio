import React, { useEffect, useRef } from 'react';
import GlitchText from './GlitchText';
import Dropdown from './Dropdown';
import Clock from './Clock';
import { useInterval } from '../utils';
import Toggle from './Toggle';
import Slider from './Slider';
import { StaticImage } from 'gatsby-plugin-image';
import { useState } from 'react';
import Battery from './Battery';
import { useSettingsStore } from '../store';
import githubImg from '../images/github.png';
import linkedInImg from '../images/linkedIn.png';

const TaskbarContents = () => {
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

	const volumeRef = useRef(0);

	const [battery, setBattery] = useState(1);
	useEffect(() => {
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

	const [now, setNow] = useState<Date>();
	const [effectsSelected, setEffectsSelected] = useState(false);
	const [audioSelected, setAudioSelected] = useState(false);
	const [timeSelected, setTimeSelected] = useState(false);
	useInterval(() => setNow(new Date()), 1000);

	return (
		<>
			<Dropdown
				className="h-full group px-4 transition-colors ease-steps hover:bg-white-primary"
				noPadding
				dContent={
					<>
						<div className="px-4 py-16 space-y-2">
							<h1 className="text-5xl">RedaOS™</h1>
							<h2 className="text-lg whitespace-nowrap">
								Software Version 1.0.0
							</h2>
							<p className="text-md font-normal">
								© Paradox Computers, Inc. 2022-2023
							</p>
						</div>
						<a
							href="https://www.linkedin.com/in/reda-elmountassir"
							target="_blank"
							className="block w-full p-4 text-left whitespace-nowrap transition-colors ease-steps hover:bg-white-primary hover:text-black-primary outline outline-2 outline-white-primary"
						>
							<img
								src={linkedInImg}
								alt="LinkedIn Logo"
								className="inline-block mr-4 h-6"
							/>
							LinkedIn
						</a>
						<a
							href="https://github.com/redaelmountassir"
							target="_blank"
							className="block w-full p-4 text-left whitespace-nowrap transition-colors ease-steps hover:bg-white-primary hover:text-black-primary outline outline-2 outline-white-primary"
						>
							<img
								src={githubImg}
								alt="Github Logo"
								className="inline-block mr-4 h-6"
							/>
							Github
						</a>
						<button
							type="button"
							className="w-full p-4 text-left whitespace-nowrap transition-colors ease-steps hover:bg-white-primary hover:text-black-primary outline outline-2 outline-white-primary"
							onClick={() => restart()}
						>
							Restart
						</button>
						<button
							type="button"
							className="w-full p-4 text-left whitespace-nowrap transition-colors ease-steps hover:bg-white-primary hover:text-black-primary"
							onClick={() => shutdown()}
						>
							Shut down
						</button>
					</>
				}
			>
				<StaticImage
					src="../images/logo/logo_plain.png"
					alt="Start Button"
					width={28}
					className="group-hover:invert group-active:glitch"
				/>
			</Dropdown>
			<span className="grow" />
			<Dropdown
				className="p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary"
				onPointerDown={() => setEffectsSelected(true)}
				onPointerOut={() =>
					effectsSelected && setEffectsSelected(false)
				}
				onPointerUp={() => setEffectsSelected(false)}
				dContent={
					<>
						<Slider state={brightness} setter={setBrightness}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 -0.5 16 16"
								shapeRendering="crispEdges"
							>
								<path
									className="transition stroke-white-primary"
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
										className={`transition origin-center scale-0 stroke-transparent ${
											brightness >=
												((arr.length - i) /
													arr.length) *
													100 &&
											'!stroke-white-primary !scale-100'
										}`}
										d={path}
									/>
								))}
							</svg>
						</Slider>
						<Toggle state={use3D} setter={set3D}>
							3D (Slow)
						</Toggle>
						<Toggle state={useStatic} setter={setStatic}>
							Static
						</Toggle>
						<Toggle state={scanlines} setter={setScanlines}>
							Scanlines
						</Toggle>
						<Toggle state={fancyText} setter={setFancyText}>
							Fancy Text
						</Toggle>
						<Toggle state={useFlicker} setter={setFlicker}>
							Flicker
						</Toggle>
						<Toggle state={lightMode} setter={setLightMode}>
							{lightModeText}
						</Toggle>
						<Toggle state={fullscreen} setter={setFullscreen}>
							Fullscreen
						</Toggle>
					</>
				}
			>
				<GlitchText animated={effectsSelected}>Visuals</GlitchText>
			</Dropdown>
			<Dropdown
				className="p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary"
				onPointerDown={() => setAudioSelected(true)}
				onPointerOut={() => audioSelected && setAudioSelected(false)}
				onPointerUp={() => setAudioSelected(false)}
				dContent={
					<Slider state={volume} setter={setVolume}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 -0.5 16 16"
							shapeRendering="crispEdges"
							className="cursor-pointer"
							onClick={() => {
								if (volume === 0)
									return setVolume(volumeRef.current);
								volumeRef.current = volume;
								return setVolume(0);
							}}
						>
							<path
								className="stroke-white-primary"
								d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
							/>
							<path
								className={`transition -translate-x-1 stroke-transparent ${
									volume > 0 &&
									'!stroke-white-primary !translate-x-0'
								}`}
								d="M9 6h1M10 7h1M10 8h1M9 9h1"
							/>
							<path
								className={`transition -translate-x-1 stroke-transparent ${
									volume > 33.3 &&
									'!stroke-white-primary !translate-x-0'
								}`}
								d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
							/>
							<path
								className={`transition -translate-x-1 stroke-transparent ${
									volume > 66.6 &&
									'!stroke-white-primary !translate-x-0'
								}`}
								d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
							/>
							<path
								className={`transition stroke-transparent ${
									volume == 0 && '!stroke-white-primary'
								}`}
								d="M11 6h1M15 6h1M12 7h1M14 7h1M13 8h1M12 9h1M14 9h1M11 10h1M15 10h1"
							/>
						</svg>
					</Slider>
				}
			>
				<GlitchText animated={audioSelected}>Audio</GlitchText>
			</Dropdown>
			<Dropdown
				className="px-3 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary h-full"
				dContent={
					<span className="whitespace-nowrap">
						<p className="mr-4 inline text-md">
							{Math.floor(battery * 100)}%
						</p>
						<Battery level={battery} className="w-16 inline" />
					</span>
				}
			>
				<Battery level={battery} className="w-8" />
			</Dropdown>
			<Dropdown
				className="p-4 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary"
				onPointerDown={() => setTimeSelected(true)}
				onPointerOut={() => timeSelected && setTimeSelected(false)}
				onPointerUp={() => setTimeSelected(false)}
				dContent={<Clock now={now} />}
			>
				<GlitchText animated={timeSelected}>
					{now?.toLocaleTimeString() ?? 'Loading...'}
				</GlitchText>
			</Dropdown>
		</>
	);
};

export default TaskbarContents;

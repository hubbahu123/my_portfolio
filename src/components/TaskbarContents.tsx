import React, { useEffect, useRef } from 'react';
import GlitchText from './GlitchText';
import Dropdown from './Dropdown';
import Clock from './Clock';
import { colors, useInterval } from '../utils';
import Toggle from './Toggle';
import Slider from './Slider';
import { StaticImage } from 'gatsby-plugin-image';
import { useContext, useState } from 'react';

const TaskbarContents = () => {
	const [brightness, setBrightness] = useState(100);
	const [threeD, setThreeD] = useState(true);
	const [scanlines, setScanlines] = useState(false);

	const [volume, setVolume] = useState(0);
	const volumeRef = useRef(0);

	const [battery, setBattery] = useState(3);
	useEffect(() => {
		if (!('getBattery' in navigator))
			return setBattery(Math.max(Math.random() * 3, 0.0001));
		let batteryRef: any, updateBattery: Function;
		//@ts-ignore
		navigator.getBattery().then(batt => {
			batteryRef = batt;
			updateBattery = () => {
				const newVal = Math.ceil(batt.level * 3);
				if (newVal === battery) return;
				setBattery(newVal);
			};
			updateBattery();
			batt.addEventListener('levelchange', updateBattery);
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
						<button
							type="button"
							className="w-full p-4 text-left whitespace-nowrap transition-colors ease-steps hover:bg-white-primary hover:text-black-primary outline outline-2 outline-white-primary"
						>
							Restart
						</button>
						<button
							type="button"
							className="w-full p-4 text-left whitespace-nowrap transition-colors ease-steps hover:bg-white-primary hover:text-black-primary"
						>
							Shut Off
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
									className="transition-all stroke-white-primary"
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
										className={`transition-all origin-center scale-0 stroke-transparent ${
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
						<Toggle state={threeD} setter={setThreeD}>
							3D
						</Toggle>
						<Toggle state={scanlines} setter={setScanlines}>
							Scanlines
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
							onClick={() =>
								setVolume(volume => {
									if (volume === 0) return volumeRef.current;
									volumeRef.current = volume;
									return 0;
								})
							}
						>
							<path
								className="transition-all stroke-white-primary"
								d="M6 1h2M5 2h1M7 2h1M4 3h1M7 3h1M3 4h1M7 4h1M0 5h3M7 5h1M0 6h1M7 6h1M0 7h1M7 7h1M0 8h1M7 8h1M0 9h1M7 9h1M0 10h3M7 10h1M3 11h1M7 11h1M4 12h1M7 12h1M5 13h1M7 13h1M6 14h2"
							/>
							<path
								className={`transition-all -translate-x-1 stroke-transparent ${
									volume > 0 &&
									'!stroke-white-primary !translate-x-0'
								}`}
								d="M9 6h1M10 7h1M10 8h1M9 9h1"
							/>
							<path
								className={`transition-all -translate-x-1 stroke-transparent ${
									volume > 33.3 &&
									'!stroke-white-primary !translate-x-0'
								}`}
								d="M10 4h1M11 5h1M12 6h1M12 7h1M12 8h1M12 9h1M11 10h1M10 11h1"
							/>
							<path
								className={`transition-all -translate-x-1 stroke-transparent ${
									volume > 66.6 &&
									'!stroke-white-primary !translate-x-0'
								}`}
								d="M11 2h1M12 3h1M13 4h1M14 5h1M14 6h1M14 7h1M14 8h1M14 9h1M14 10h1M13 11h1M12 12h1M11 13h1"
							/>
							<path
								className={`transition-all stroke-transparent ${
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
			<div className="px-3 transition-colors ease-steps hover:bg-white-primary hover:text-black-primary">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 -0.5 16 16"
					shapeRendering="crispEdges"
					className="h-full w-8"
				>
					<path
						className="stroke-current"
						d="M0 3h15M0 4h1M14 4h1M0 5h1M14 5h2M0 6h1M14 6h2M0 7h1M14 7h2M0 8h1M14 8h2M0 9h1M14 9h2M0 10h1M14 10h2M0 11h1M14 11h1M0 12h15"
					/>
					<path
						className={battery > 0 ? 'stroke-current' : ''}
						d="M2 5h2M2 6h2M2 7h2M2 8h2M2 9h2M2 10h2"
					/>
					<path
						className={battery >= 1 ? 'stroke-current' : ''}
						d="M5 5h2M5 6h2M5 7h2M5 8h2M5 9h2M5 10h2"
					/>
					<path
						className={battery >= 2 ? 'stroke-current' : ''}
						d="M8 5h2M8 6h2M8 7h2M8 8h2M8 9h2M8 10h2"
					/>
					<path
						className={battery == 3 ? 'stroke-current' : ''}
						d="M11 5h2M11 6h2M11 7h2M11 8h2M11 9h2M11 10h2"
					/>
				</svg>
			</div>
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

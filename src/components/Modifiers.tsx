import React from 'react';
import { useSettingsStore } from '../store';
import { map } from '../utils';
import { motion } from 'framer-motion';
import staticVideo from '../videos/static.mp4';

const Modifiers = () => {
	const [brightness, scanlines, useStatic, useFlicker] = useSettingsStore(
		state => [
			state.brightness,
			state.scanlines,
			state.useStatic,
			state.useFlicker,
		]
	);
	return (
		<>
			<div
				className="fixed w-full h-full pointer-events-none z-50 top-0 bg-black"
				style={{ opacity: map(brightness, 0, 100, 0.8, 0) }}
			/>
			{useStatic && (
				<video
					className="fixed w-full h-full pointer-events-none z-50 top-0 object-cover mix-blend-color-dodge"
					muted
					autoPlay
					loop
				>
					<source src={staticVideo} type="video/mp4" />
				</video>
			)}
			{scanlines && (
				<motion.div
					className="fixed w-full h-full pointer-events-none z-50 bottom-0 box-content pt-3 bg-gradient-to-b from-transparent via-black bg-repeat-y bg-[length:100%_10px] opacity-5"
					initial={{ y: 0 }}
					animate={{ y: 10 }}
					transition={{
						repeat: Infinity,
						duration: 2,
						ease: 'linear',
					}}
				/>
			)}
			{useFlicker && (
				<div className="fixed w-full h-full pointer-events-none z-50 top-0 animate-[flicker_0.12s_infinite] bg-black bg-opacity-20" />
			)}
		</>
	);
};

export default Modifiers;

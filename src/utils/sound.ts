import { useMemo, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store';

const attemptPlay = (audio: HTMLAudioElement) => () => {
	const safePlay = () => {
		try {
			console.log('played normal');
			audio.play();
		} catch {
			console.error("Can't play yet");
		}
	};
	if (audio.readyState >= 3) {
		console.log('maybe early');
		safePlay();
		return;
	}
	console.log('maybe wrong event');
	audio.addEventListener('canplay', safePlay);
};

export const usePlaySound = (src: string, vol: number = 1) => {
	const audio = useMemo(() => new Audio(src), [src]);
	const globalVol = useSettingsStore(store => store.volume / 100);

	useEffect(() => {
		audio.volume = vol * globalVol;
	}, [globalVol]);

	return [attemptPlay(audio), audio.pause];
};

export const useBackgroundSound = (src: string, vol: number = 1) => {
	const audio = useMemo(() => new Audio(src), [src]);
	const globalVol = useSettingsStore(store => store.volume / 100);
	const started = useRef(false);

	useEffect(() => {
		audio.volume = vol * globalVol;
	}, [globalVol]);

	return [
		() => {
			if (!started.current) {
				audio.volume = vol * globalVol;
				audio.loop = true;
				attemptPlay(audio)();
				started.current = true;
				return true;
			}
			return false;
		},
		audio.pause,
	];
};

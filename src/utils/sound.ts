import { useMemo, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store';

const attemptPlay = (audio: HTMLAudioElement, globalVol: number) => () => {
	const safePlay = () => {
		try {
			audio.play();
		} catch {
			console.error("Can't play yet");
		}
	};
	if (globalVol === 0) return;
	if (audio.readyState >= 3) {
		safePlay();
		return;
	}
	audio.addEventListener('canplay', safePlay);
};

export const usePlaySound = (src: string, vol: number = 1) => {
	const audio = useMemo(() => new Audio(src), [src]);
	const globalVol = useSettingsStore(store => store.volume / 100);
	useEffect(() => {
		audio.volume = vol * globalVol;
	}, [globalVol]);
	return [attemptPlay(audio, globalVol), audio.pause];
};

export const useBackgroundSound = (src: string, vol: number = 1) => {
	const audio = useMemo(() => new Audio(src), [src]);
	const globalVol = useSettingsStore(store => store.volume / 100);
	const started = useRef(false);
	useEffect(() => {
		audio.volume = vol * globalVol;
	}, [globalVol]);
	return () => {
		if (!started.current) {
			audio.volume = vol * globalVol;
			audio.loop = true;
			attemptPlay(audio, globalVol)();
			started.current = true;
			return true;
		}
		return false;
	};
};

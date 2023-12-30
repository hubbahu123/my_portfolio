import { useEffect, useMemo } from 'react';
import { Vector2, MathUtils } from 'three';
import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSettingsStore } from '../store';

const MIN = new Vector2(-1, -1);
const MAX = new Vector2(1, 1);
const MouseControls = () => {
	const targetPos = useMemo(() => new Vector2(0, 0), []);
	useEffect(() => {
		const updateTarget = (e: PointerEvent) => {
			let x = (e.clientX / window.innerWidth) * -2 + 1,
				y = (e.clientY / window.innerHeight) * -2 + 1;

			if (window.innerWidth < window.innerHeight)
				x *= window.innerWidth / window.innerHeight;
			else y *= window.innerHeight / window.innerWidth;
			targetPos.set(x, y);
			targetPos.clamp(MIN, MAX);
		};

		window.addEventListener('pointermove', updateTarget);

		return () => window.removeEventListener('pointermove', updateTarget);
	}, []);

	useFrame(({ camera }, delta) => {
		camera.rotation.x = MathUtils.damp(
			camera.rotation.x,
			targetPos.y * Math.PI * 0.05,
			6,
			delta
		);
		camera.rotation.y = MathUtils.damp(
			camera.rotation.y,
			targetPos.x * Math.PI * 0.05,
			6,
			delta
		);
	});

	return <></>;
};

export default MouseControls;

import { useEffect, useMemo } from 'react';
import { Vector2, MathUtils } from 'three';
import * as React from 'react';
import { useFrame } from '@react-three/fiber';

const MIN = new Vector2(-1, -1);
const MAX = new Vector2(1, 1);
const MouseControls = () => {
	const targetPos = useMemo(() => new Vector2(0, 0), []);
	useEffect(() => {
		const updateTarget = (e: PointerEvent | DeviceOrientationEvent) => {
			let x = 0,
				y = 0;
			if ('clientX' in e) {
				x = (e.clientX / window.innerWidth) * -2 + 1;
				y = (e.clientY / window.innerHeight) * -2 + 1;

				if (window.innerWidth < window.innerHeight)
					x *= window.innerWidth / window.innerHeight;
				else y *= window.innerHeight / window.innerWidth;
			} else {
				x = e.gamma ?? 0 / 90;
				y = e.beta ?? 0 / 180;
			}
			targetPos.set(x, y);
			targetPos.clamp(MIN, MAX);
		};

		window.addEventListener('pointermove', updateTarget);
		window.addEventListener('deviceorientation', updateTarget);

		return () => {
			window.removeEventListener('pointermove', updateTarget);
			window.removeEventListener('deviceorientation', updateTarget);
		};
	}, []);

	useFrame((state, delta) => {
		state.camera.rotation.x = MathUtils.damp(
			state.camera.rotation.x,
			targetPos.y * Math.PI * 0.1,
			3,
			delta
		);
		state.camera.rotation.y = MathUtils.damp(
			state.camera.rotation.y,
			targetPos.x * Math.PI * 0.1,
			3,
			delta
		);
	});

	return <></>;
};

export default MouseControls;

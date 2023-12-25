import * as THREE from 'three';
import * as React from 'react';
import { Bvh, Float, useGLTF, useTexture } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useBoundStore } from '../store';
import { Throbber } from './Throbber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Window } from '../store/types';
import { useFrame } from '@react-three/fiber';
import { createGlitchMat } from '../shaders/glitchMat';
import { randRange } from '../utils';

type GLTFResult = GLTF & {
	nodes: {
		bust: THREE.Mesh;
		phone: THREE.Mesh;
		computer: THREE.Mesh;
		logo: THREE.Mesh;
		pen: THREE.Mesh;
	};
};

function checkVisibility(window: Window | undefined): string {
	if (!window) return 'bust';
	switch (window.type) {
		case 'FileExplorer':
			return 'computer';
		case 'Console':
			return 'pen';
		default:
			return 'bust';
	}
}

export const Symbols: React.FC<
	React.JSX.IntrinsicElements['group']
> = props => {
	const { nodes } = useGLTF('/models/symbols.glb') as GLTFResult;
	const transitionStatus = useRef({
		prevNode: '',
		currentNode: '',
		timeout: null as null | NodeJS.Timeout,
		glitching: false,
	});
	const [nodesVisibility, setVisibility] = useState<{
		[key: string]: boolean;
	}>({});
	const symbolMat = useMemo(() => createGlitchMat(), []);

	const currentWindow = useBoundStore(({ windows }) => windows[0]);

	useEffect(() => {
		const shouldBeVisible = checkVisibility(currentWindow);
		if (nodesVisibility[shouldBeVisible]) {
			if (transitionStatus.current.timeout) {
				clearTimeout(transitionStatus.current.timeout);
				transitionStatus.current.timeout = setTimeout(() => {
					transitionStatus.current.glitching = false;
					transitionStatus.current.timeout = null;
				}, randRange(500, 1250));
			}
			return;
		}
		transitionStatus.current.glitching = true;
		transitionStatus.current.prevNode =
			transitionStatus.current.currentNode;
		transitionStatus.current.currentNode = shouldBeVisible;
		if (transitionStatus.current.timeout) return;
		transitionStatus.current.timeout = setTimeout(() => {
			transitionStatus.current.glitching = false;
			transitionStatus.current.timeout = null;
			setVisibility(prev => ({
				...prev,
				[transitionStatus.current.prevNode]: false,
			}));
			setVisibility(prev => ({ ...prev, [shouldBeVisible]: true }));
		}, randRange(500, 1250));
	}, [currentWindow]);

	useFrame(state => {
		if (!symbolMat.userData.shader || !symbolMat.userData.shader.uniforms)
			return;
		if (!transitionStatus.current.glitching) {
			if (symbolMat.userData.shader.uniforms.glitching.value)
				symbolMat.userData.shader.uniforms.glitching.value = 0;
			return;
		}

		symbolMat.userData.shader.uniforms.time.value =
			state.clock.getElapsedTime();
		if (!symbolMat.userData.shader.uniforms.glitching.value)
			symbolMat.userData.shader.uniforms.glitching.value = 1;
	});

	useEffect(() => () => symbolMat.dispose(), []);

	return (
		<React.Suspense fallback={<Throbber />}>
			<Float rotationIntensity={2}>
				<group {...props} dispose={null}>
					{Object.keys(nodes).map(node =>
						//@ts-ignore
						nodes[node].geometry == undefined ? null : (
							<mesh
								//@ts-ignore
								geometry={nodes[node].geometry}
								key={node}
								visible={nodesVisibility[node] ?? false}
								material={symbolMat}
							/>
						)
					)}
				</group>
			</Float>
		</React.Suspense>
	);
};

useGLTF.preload('/models/symbols.glb');

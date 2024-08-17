import React, { startTransition } from 'react';
import { Float, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useBoundStore } from '../store';
import { Throbber } from './Throbber';
import { useEffect, useRef, useState } from 'react';
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
	if (!window) return 'logo';
	switch (window.type) {
		case 'Contact':
			return 'phone';
		case 'PDFReader':
		case 'TextEditor':
			return 'pen';
		case 'MediaViewer':
			return 'bust';
		case 'Console':
		case 'FileExplorer':
		case 'Virus':
			return 'computer';
		default:
			return 'logo';
	}
}

const symbolMat = createGlitchMat();

export const Symbols: React.FC<
	React.JSX.IntrinsicElements['group']
> = props => {
	const { nodes } = useGLTF('/models/symbols.glb') as unknown as GLTFResult;

	const data = useRef<{ timeout?: NodeJS.Timeout; glitching: boolean }>({
		glitching: false,
	});

	// Create glitchy material
	useFrame(state => {
		if (!symbolMat.userData.shader || !symbolMat.userData.shader.uniforms)
			return;

		if (!data.current.glitching) {
			if (symbolMat.userData.shader.uniforms.glitching.value)
				symbolMat.userData.shader.uniforms.glitching.value = 0;
			return;
		}

		symbolMat.userData.shader.uniforms.time.value =
			state.clock.getElapsedTime();
		if (!symbolMat.userData.shader.uniforms.glitching.value)
			symbolMat.userData.shader.uniforms.glitching.value = 1;
	});

	// Tie symbols to current window
	const [currentNode, setCurrentNode] = useState<string>(
		checkVisibility(undefined)
	);
	const currentWindow = useBoundStore(
		({ windows }) => windows[windows.length - 1]
	);
	useEffect(() => {
		const shouldBeVisible = checkVisibility(currentWindow);
		// If symbol is returned to the current one
		if (currentNode === shouldBeVisible) {
			if (data.current.timeout) {
				clearTimeout(data.current.timeout);
				data.current.timeout = setTimeout(
					() => {
						data.current.glitching = false;
						data.current.timeout = undefined;
					},
					randRange(500, 1000)
				);
			}
			return;
		}

		// New symbol! Start animating.
		data.current.glitching = true;
		// If existing switch exists, extend animation and change the change
		if (data.current.timeout) clearTimeout(data.current.timeout);
		data.current.timeout = setTimeout(
			() => {
				data.current.glitching = false;
				data.current.timeout = undefined;
				startTransition(() => setCurrentNode(shouldBeVisible));
			},
			randRange(500, 1250)
		);
	}, [currentWindow]);

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
								visible={currentNode === node}
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

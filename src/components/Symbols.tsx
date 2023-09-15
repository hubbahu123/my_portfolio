import * as THREE from 'three';
import * as React from 'react';
import { Float, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useBoundStore } from '../store';
import { colors } from '../utils';
import { Throbber } from './Throbber';
import { motion } from 'framer-motion-3d';
import {
	AnimatePresence,
	AnimationScope,
	useAnimate,
	useMotionValue,
} from 'framer-motion';
import { FileExtension } from '../store/types';
import { useEffect, useRef } from 'react';
import { Window } from '../store/types';

type GLTFResult = GLTF & {
	nodes: {
		bust: THREE.Mesh;
		phone: THREE.Mesh;
		computer: THREE.Mesh;
		logo: THREE.Mesh;
		pen: THREE.Mesh;
		trashcan: THREE.Mesh;
	};
	materials: {
		marble: THREE.MeshStandardMaterial;
	};
};

function checkVisibility(
	window: Window | undefined,
	prevWindow: Window | undefined,
	node: string
): boolean {
	if (!window) return node === 'logo';
	switch (window.type) {
		case 'FileExplorer':
			if (node === 'computer') return true;
			break;
		case 'Console':
			if (node === 'pen') return true;
			break;
		default:
			break;
	}
	return prevWindow ? checkVisibility(prevWindow, undefined, node) : false;
}

export const Symbols: React.FC<
	React.JSX.IntrinsicElements['group']
> = props => {
	const {
		nodes,
		materials: { marble: symbolMat },
	} = useGLTF('/models/symbols.glb') as GLTFResult;
	symbolMat.transparent = true;
	symbolMat.flatShading = true;
	symbolMat.side = THREE.FrontSide;

	const [currentWindow, prevWindow] = useBoundStore(({ windows }) => [
		windows[0],
		windows[1],
	]);
	const [scope, animate] = useAnimate();
	const exitingScale = useMotionValue(0);
	const exitingX = useMotionValue(0);
	const enteringScale = useMotionValue(0);
	const enteringX = useMotionValue(0);
	useEffect(() => {
		const group = scope as AnimationScope & THREE.Group;
		// animate(exitingScale,,,)
	}, [currentWindow]);

	return (
		<React.Suspense fallback={<Throbber />}>
			<Float rotationIntensity={2}>
				<group {...props} dispose={null} scale={[0.01, 0.01, 0.01]} ref={scope}>
					{Object.keys(nodes).map(node => (
						<motion.mesh
							//@ts-ignore
							geometry={nodes[node].geometry}
							key={node}
							visible={checkVisibility(currentWindow, prevWindow, node)}
						>
							<meshPhysicalMaterial
								color={colors.whitePrimary}
								roughness={0.5}
								metalness={0}
							/>
						</motion.mesh>
					))}
				</group>
			</Float>
		</React.Suspense>
	);
};

useGLTF.preload('/models/symbols.glb');

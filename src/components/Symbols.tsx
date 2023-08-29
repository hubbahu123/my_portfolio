import * as THREE from 'three';
import * as React from 'react';
import { Float, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useBoundStore } from '../store';
import { colors } from '../utils';
import { Throbber } from './Throbber';
import { motion } from 'framer-motion-3d';
import { AnimatePresence } from 'framer-motion';
import { FileExtension } from '../store/types';

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

// type ContextType = Record<
// 	string,
// 	React.ForwardRefExoticComponent<React.JSX.IntrinsicElements['mesh']>
// >;

// Slated to change
const NODES: Array<{ name: string; ext?: FileExtension }> = [
	{ name: 'logo' },
	{ name: 'bust', ext: 'png' },
	{ name: 'phone', ext: 'pdf' },
	{ name: 'computer', ext: 'exe' },
	{ name: 'pen', ext: 'txt' },
	// { name: 'trashcan', ext: '' },
];

export const Symbols: React.FC<
	React.JSX.IntrinsicElements['group']
> = props => {
	const {
		nodes,
		materials: { marble: symbolMat },
	} = useGLTF('/models/symbols.glb') as GLTFResult;
	const currentWindow = useBoundStore(state => state.windows)[0];
	symbolMat.transparent = true;
	symbolMat.flatShading = true;
	symbolMat.side = THREE.FrontSide;

	return (
		<React.Suspense fallback={<Throbber />}>
			<Float rotationIntensity={2}>
				<group {...props} dispose={null} scale={[0.01, 0.01, 0.01]}>
					<AnimatePresence>
						{NODES.map(node => (
							<mesh
								//@ts-ignore
								geometry={nodes[node.name].geometry}
								key={node.name}
							>
								<meshPhysicalMaterial
									color={colors.whitePrimary}
									roughness={0.5}
									metalness={0}
								/>
							</mesh>
						))}
					</AnimatePresence>
				</group>
			</Float>
		</React.Suspense>
	);
};

useGLTF.preload('/models/symbols.glb');

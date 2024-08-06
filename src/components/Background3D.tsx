import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { Colors } from '../utils';
import { PerspectiveCamera } from '@react-three/drei';
import { Symbols } from './Symbols';
import Plane from './Plane';
import Sky from './Sky';
import Effects from './Effects';
import MouseControls from './MouseControls';
import * as THREE from 'three';
import { DoubleSide, Color } from 'three';

THREE.ColorManagement.enabled = true;
const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(Colors.blueAccent).multiplyScalar(20);
const Background3D: React.FC = () => {
	return (
		<Canvas
			dpr={0.3}
			gl={{
				powerPreference: 'high-performance',
				alpha: false,
				depth: false,
			}}
		>
			<directionalLight
				position={[0, 50, 50]}
				color={Colors.whitePrimary}
				intensity={0.3}
			/>
			<ambientLight color="grey" intensity={0.4} />
			<PerspectiveCamera
				fov={50}
				position={[0, 0, 6]}
				near={1}
				makeDefault
			/>
			<MouseControls />
			<Effects />
			<Sky seed={SEED} />
			<Plane seed={SEED} />
			<Symbols />
			<mesh position={[0, -0.2, 0.2]} rotation={[0.2, 0.2, 0]}>
				<ringGeometry args={[3, 3.25, 3]} />
				<meshBasicMaterial color={TRIANGLE_COLOR} side={DoubleSide} />
			</mesh>
		</Canvas>
	);
};

export default Background3D;

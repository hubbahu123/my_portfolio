import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { colors } from '../utils';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Symbols } from './Symbols';
import Plane from './Plane';
import Sky from './Sky';
import Effects from './Effects';
import MouseControls from './MouseControls';
import { DoubleSide, Color } from 'three';

const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(colors.blueAccent).multiplyScalar(20);
const Background: React.FC = () => {
	return (
		<Canvas
			dpr={.3}
			gl={{ powerPreference: 'high-performance' }}
		>
			<directionalLight
				position={[0, 50, 50]}
				color={colors.whitePrimary}
				intensity={0.3}
			/>
			<ambientLight color='grey' intensity={0.4} />
			<PerspectiveCamera fov={50} position={[0, 0, 6]} near={1} makeDefault />
			<MouseControls />
			<Effects />
			<Sky seed={SEED} />
			<Plane seed={SEED} />
			<Symbols />
			<mesh position={[0, -.2, .2]} rotation={[.2, .2, 0]}>
				<ringGeometry args={[3, 3.25, 3]} />
				<meshBasicMaterial color={TRIANGLE_COLOR} side={DoubleSide} />
			</mesh>
		</Canvas>
	);
};

export default Background;

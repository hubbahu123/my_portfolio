import { Canvas, Props, useThree } from '@react-three/fiber';
import * as React from 'react';
import { colors } from '../utils';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BakeShadows } from '@react-three/drei';
import { Desk } from './Desk';
import { PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { Symbols } from './Symbols';
import Plane from './Plane';
import Sky from './Sky';
import Effects from './Effects';
import MouseControls from './MouseControls';

const SEED = Math.round((Math.random() * 2 - 1) * 1000);

const Background: React.FC = () => {
	return (
		<Canvas
			dpr={window.devicePixelRatio / 4}
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
		</Canvas>
	);
};

export default Background;

import { Canvas } from '@react-three/fiber';
import React from 'react';
import { Colors } from '../utils';
import { PerspectiveCamera } from '@react-three/drei';
import { Symbols } from './Symbols';
import Plane from './Plane';
import Sky from './Sky';
import Effects from './Effects';
import MouseControls from './MouseControls';
import { DoubleSide, Color } from 'three';
import { useBoundStore, useMobileStore } from '../store';
import { MobileContext } from './OS';

const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(Colors.blueAccent).multiplyScalar(20);
const Background3D: React.FC = () => {
	const isMobile = React.useContext(MobileContext);
	const windowCovering =
		useMobileStore(
			state => state.windowOpen !== undefined || state.menuOpen
		) && isMobile;
	const windowMaximized =
		useBoundStore(state => state.windowMaximized) && !isMobile;

	return (
		<Canvas
			dpr={0.3}
			fallback={
				<p className="absolute top-1/2 text-center w-full px-10 -translate-y-1/2 text-white-primary">
					3D is not supported on this browser. Check the visuals panel
					to disable it.
				</p>
			}
			frameloop={windowCovering || windowMaximized ? 'demand' : 'always'}
			gl={{
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

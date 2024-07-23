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
import { useSettingsStore } from '../store';
import bgImg1 from '../images/background_1.jpg';
import bgImg2 from '../images/background_2.jpg';
import pixelatedHeadGif from '../images/pixelated_head.gif';
import triangleImg from '../images/triangle_outline_blue.png';
import palmImg from '../images/palm.png';
import { motion } from 'framer-motion';

THREE.ColorManagement.enabled = true;
const PALM_PATH =
	'polygon(42% 100%, 38% 70%, 48% 37%, 63% 54%, 72% 46%, 80% 43%, 66% 30%, 95% 30%, 96% 25%, 87% 23%, 73% 16%, 94% 18%, 84% 4%, 60% 5%, 42% 0%, 34% 1%, 36% 9%, 21% 7%, 5% 13%, 14% 19%, 2% 25%, 4% 31%, 17% 31%, 23% 34%, 24% 44%, 31% 46%, 35% 52%, 27% 69%, 22% 100%)';
const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(Colors.blueAccent).multiplyScalar(20);
const Background: React.FC = () => {
	const use3D = useSettingsStore(state => state.use3D);

	return use3D ? (
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
	) : (
		<>
			<motion.div
				initial={{ x: 0 }}
				animate={{ x: -95 }}
				transition={{
					repeat: Infinity,
					duration: 2,
					ease: 'linear',
				}}
				className="mask-up absolute bottom-0 left-0 box-content h-36 w-full bg-[url('/bg_imgs/tile.png')] bg-contain pl-24"
			/>
			<img
				src={Math.random() !== 0 ? bgImg2 : bgImg1}
				alt="background image of sky"
				className="h-full w-full  object-cover"
				draggable={false}
			/>
			<img
				src={triangleImg}
				draggable={false}
				className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-[62%]  drop-shadow-[0_0_35px_#b1d7ef] filter"
			/>
			<img
				src={palmImg}
				draggable={false}
				style={{ clipPath: PALM_PATH }}
				className="absolute -bottom-10 -left-32 w-96 origin-[35%_bottom] rotate-6  transition-transform duration-1000 ease-in-out hover:rotate-12 md:-left-5"
			/>
			<img
				src={pixelatedHeadGif}
				draggable={false}
				className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 "
			/>
			<img
				src={palmImg}
				draggable={false}
				style={{ clipPath: PALM_PATH }}
				className="invisible absolute -bottom-24 -right-10 w-96 origin-[35%_bottom] -rotate-12 scale-75 -scale-x-100  transition-transform duration-1000 ease-in-out hover:-rotate-6 md:visible"
			/>
			<img
				src={palmImg}
				draggable={false}
				style={{ clipPath: PALM_PATH }}
				className="absolute -bottom-10 -right-36 w-96 origin-[35%_bottom] rotate-12 -scale-x-100  transition-transform duration-1000 ease-in-out hover:rotate-6"
			/>
		</>
	);
};

export default Background;

import { Canvas } from '@react-three/fiber';
import * as React from 'react';
import { colors } from '../utils';
import { PerspectiveCamera } from '@react-three/drei';
import { Symbols } from './Symbols';
import Plane from './Plane';
import Sky from './Sky';
import Effects from './Effects';
import MouseControls from './MouseControls';
import { DoubleSide, Color } from 'three';
import { useSettingsStore } from '../store';
import bgImg1 from '../images/background_1.jpg';
import bgImg2 from '../images/background_2.jpg';
import pixelatedHeadGif from '../images/pixelated_head.gif';
import triangleImg from '../images/triangle_outline_blue.png';
import palmImg from '../images/palm.png';
import { motion } from 'framer-motion';

const SEED = Math.round((Math.random() * 2 - 1) * 1000);
const TRIANGLE_COLOR = new Color(colors.blueAccent).multiplyScalar(20);
const Background: React.FC = () => {
	const use3D = useSettingsStore(state => state.use3D);

	return (
		<div className="w-full h-full bg-black-primary">
			{use3D ? (
				<Canvas dpr={0.3} gl={{ powerPreference: 'high-performance' }}>
					<directionalLight
						position={[0, 50, 50]}
						color={colors.whitePrimary}
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
						<meshBasicMaterial
							color={TRIANGLE_COLOR}
							side={DoubleSide}
						/>
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
						className="pl-24 absolute bottom-0 left-0 box-content w-full h-36 bg-[url('/background_images/tile.png')] bg-contain mask-up"
					/>
					<img
						src={Math.random() !== 0 ? bgImg2 : bgImg1}
						alt="background image of sky"
						className="w-full h-full object-cover select-none"
						draggable={false}
					/>
					<img
						src={triangleImg}
						draggable={false}
						className="absolute w-96 left-1/2 top-1/2 -translate-x-1/2 -translate-y-[62%] select-none filter drop-shadow-[0_0_35px_#b1d7ef]"
					/>
					<img
						src={palmImg}
						draggable={false}
						className="absolute -left-32 -bottom-10 w-96 rotate-6 select-none transition-transform ease-in-out hover:rotate-12 md:-left-5"
					/>
					<img
						src={palmImg}
						draggable={false}
						className="absolute -right-10 -bottom-24 w-96 -scale-x-100 scale-75 -rotate-12 select-none transition-transform ease-in-out invisible md:visible hover:-rotate-6"
					/>
					<img
						src={pixelatedHeadGif}
						draggable={false}
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
					/>
					<img
						src={palmImg}
						draggable={false}
						className="absolute -right-36 -bottom-10 w-96 -scale-x-100 rotate-12 select-none transition-transform ease-in-out hover:rotate-6"
					/>
					{/* <h3 className="absolute right-4 top-20 text-yellow-accent text-3xl font-bold  select-none pointer-events-none">
						RedaOS™
					</h3> */}
				</>
			)}
		</div>
	);
};

export default Background;

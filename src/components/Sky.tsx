import React, { useContext, useEffect, useMemo, useRef } from 'react';
import fragmentShader from '../shaders/sky.frag';
import vertexShader from '../shaders/sky.vert';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, Vector3, ShaderMaterial, Mesh } from 'three';
import * as THREE from 'three';
import { colors } from '../utils';
import { MobileContext } from './OS';

interface SkyProps {
	seed: number;
}

const SUN_COLOR = new Color(colors.pinkAccent).multiplyScalar(2);
const SUN_COLOR_2 = new Color(colors.yellowAccent);
const SKY_COLOR = new Color(colors.blueAccent).multiplyScalar(0.6);
const NEBULA_COLOR = new Color(colors.blueAccent);
const GROUND_COLOR = new Color(colors.blackPrimary);
const Sky: React.FC<SkyProps> = ({ seed }) => {
	const { camera } = useThree();
	const isMobile = useContext(MobileContext);

	const mat = useRef<ShaderMaterial>(null);
	useFrame(state => {
		if (!mat.current) return;
		const { clock } = state;
		mat.current.uniforms.time.value = clock.getElapsedTime();
	});
	useEffect(() => {
		if (!mat.current) return;
		mat.current.uniforms.sunSize.value = isMobile ? 300 : 600;
	}, [isMobile]);

	const uniforms = useMemo(
		() => ({
			sunColor: { value: SUN_COLOR },
			sunColor2: { value: SUN_COLOR_2 },
			sunPos: {
				value: new Vector3().setFromSphericalCoords(
					camera.far,
					Math.PI / 2 - 0.2,
					Math.PI
				),
			},
			groundColor: { value: GROUND_COLOR },
			skyColor: { value: SKY_COLOR },
			nebulaColor: { value: NEBULA_COLOR },
			sunSize: { value: isMobile ? 300 : 600 },
			seed: { value: seed ?? 0 },
			time: { value: 0 },
		}),
		[camera]
	);

	return (
		<group position={camera.position}>
			<mesh frustumCulled={false}>
				<sphereGeometry args={[camera.far, 10, 10]} />
				<shaderMaterial
					ref={mat}
					vertexShader={vertexShader}
					fragmentShader={fragmentShader}
					uniforms={uniforms}
					side={THREE.BackSide}
				/>
			</mesh>
		</group>
	);
};

export default Sky;
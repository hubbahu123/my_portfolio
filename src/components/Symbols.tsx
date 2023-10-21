import * as THREE from 'three';
import * as React from 'react';
import { Bvh, Float, useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useBoundStore } from '../store';
import { colors } from '../utils';
import { Throbber } from './Throbber';
import { useEffect } from 'react';
import { Window } from '../store/types';
import { useFrame } from '@react-three/fiber';

type GLTFResult = GLTF & {
	nodes: {
		bust: THREE.Mesh;
		phone: THREE.Mesh;
		computer: THREE.Mesh;
		logo: THREE.Mesh;
		pen: THREE.Mesh;
	};
};

function checkVisibility(
	window: Window | undefined,
	prevWindow: Window | undefined,
	node: string
): boolean {
	if (!window) return node === 'bust';
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

const mat = new THREE.MeshLambertMaterial({
	color: colors.whitePrimary,
	reflectivity: 0
});
mat.onBeforeCompile = shader => {
	shader.uniforms.time = { value: 0 };
	shader.uniforms.size = { value: .1 }
	shader.uniforms.rot = { value: 15 }

	shader.vertexShader = `
		uniform float time;
		uniform float size;
		uniform float rot;
		varying float vGlitch;
		varying vec3 pos;
		float rand(float n) {
			return fract(sin(n) * 43758.5453);
		}
		vec2 rotate(vec2 v, float a) {
			float s = sin(a);
			float c = cos(a);
			mat2 m = mat2(c, s, -s, c);
			return m * v;
		}
		${shader.vertexShader}
	`;
	shader.vertexShader = shader.vertexShader.replace(
		'#include <begin_vertex>',
		`pos = position;
		float val = (rotate(pos.xy, rot).y + 1.0) / 2.0;
		float current = time * (1.0 + size * 2.0) - size;
		vGlitch = smoothstep(current - size, current, val) * smoothstep(current + size, current, val);
		vGlitch *= vGlitch;
		vec3 transformed = pos + vGlitch * vec3(rand(val - floor(time * .25)) * 2.0 - 1.0, 0.0, 0.0);`
	);

	shader.fragmentShader = `
		uniform float time;
		varying float vGlitch;
		varying vec3 pos;
		float rand3D(vec3 x) {
			return fract(sin(dot(x.xyz ,vec3(12.9898,78.233,144.7272))) * 43758.5453);
		}
		${shader.fragmentShader}
	`;
	shader.fragmentShader = shader.fragmentShader.replace(
		'#include <color_fragment>',
		`diffuseColor = mix(diffuseColor, vec4(rand3D(pos + time)), vGlitch);`
	);

	mat.userData.shader = shader;
};

export const Symbols: React.FC<
	React.JSX.IntrinsicElements['group']
> = props => {
	const { nodes } = useGLTF('/models/symbols.glb') as GLTFResult;

	const [currentWindow, prevWindow] = useBoundStore(({ windows }) => [
		windows[0],
		windows[1],
	]);
	
	useFrame(state => {
		if (!mat.userData.shader || !mat.userData.shader.uniforms) return;

	});

	useEffect(() => () => mat.dispose(), []);
	
	return (
		<React.Suspense fallback={<Throbber />}>
			<Float rotationIntensity={2}>
				<Bvh firstHitOnly>
					<group {...props} dispose={null}
								onPointerOver={e => console.log(e)}>
						{Object.keys(nodes).map(node => 
							//@ts-ignore
							nodes[node].geometry == undefined ? null :
							<mesh
								//@ts-ignore
								geometry={nodes[node].geometry}
								key={node}
								visible={checkVisibility(currentWindow, prevWindow, node)}
								material={mat}
							/>
						)}
					</group>
				</Bvh>
			</Float>
		</React.Suspense>
	);
};

useGLTF.preload('/models/symbols.glb');

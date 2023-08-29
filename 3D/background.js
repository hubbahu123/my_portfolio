'use strict';
import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/loaders/GLTFLoader.js';
import { ImprovedNoise } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/math/ImprovedNoise.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/ShaderPass.js';
import { LowResShader } from '../../3D/LowResShader.js';

const DEBUG = false;
const fileLoader = new THREE.FileLoader(),
	gltfLoader = new GLTFLoader(),
	seed = Math.round((Math.random() * 2 - 1) * 1000);

//Yes the name is in fact oxymoronic. Cry about it
class StraightCurve extends THREE.Curve {
	constructor(points, closed) {
		super();
		this.points = points;
		if (closed) this.points.push(this.points[0].clone());
		this.length = this.points.length - 1;
	}

	getPoint(t, optionalTarget = new THREE.Vector3()) {
		if (t == 1) return optionalTarget.copy(this.points[this.length]);
		const remappedT = t * this.length,
			index = Math.floor(remappedT),
			prevPoint = this.points[index],
			nextPoint = this.points[index + 1];
		return optionalTarget.lerpVectors(prevPoint, nextPoint, remappedT - index);
	}
}
function OutrunSky(
	camera,
	sunPhi,
	sunTheta,
	sunColor,
	sunColor2,
	nebulaColor,
	skyColor,
	groundColor,
	onComplete = undefined
) {
	let vertShader, fragShader;

	fileLoader.load(`${staticPath}/3D/sky.vert`, data => {
		vertShader = data;
		if (fragShader) finish();
	});

	fileLoader.load(`${staticPath}/3D/sky.frag`, data => {
		fragShader = data;
		if (vertShader) finish();
	});

	const radius = camera.far,
		skySphere = new THREE.SphereBufferGeometry(radius, 30, 30),
		sky = new THREE.Mesh(skySphere);
	sky.position.copy(camera.position);

	function finish() {
		//Places the sun based off of a radian angle on the spherical skybox (skySphere?)
		const sunPos = new THREE.Vector3().setFromSphericalCoords(
				radius,
				sunPhi,
				sunTheta
			),
			dullingColor = new THREE.Color(0x000000);
		//Reduces the vibrance of the sky
		skyColor.lerp(dullingColor, 0.3);

		const skyMat = new THREE.ShaderMaterial({
			uniforms: {
				sunColor: { value: sunColor },
				sunColor2: { value: sunColor2 },
				sunPos: { value: sunPos },
				groundColor: { value: groundColor },
				skyColor: { value: skyColor },
				nebulaColor: { value: nebulaColor },
				seed: { value: seed },
				time: { value: 0 }
			},
			vertexShader: vertShader,
			fragmentShader: fragShader,
			side: THREE.BackSide
		});

		sky.material = skyMat;
		if (onComplete) onComplete();
	}

	return sky;
}
function OutrunGrid(
	camera,
	divisions,
	color,
	lineColor,
	lightColor,
	onComplete = undefined
) {
	let vertShader, fragShader;

	fileLoader.load(`${staticPath}/3D/grid.vert`, data => {
		vertShader = data;
		if (fragShader) finish();
	});

	fileLoader.load(`${staticPath}/3D/grid.frag`, data => {
		fragShader = data;
		if (vertShader) finish();
	});

	const depth = camera.far,
		width = depth * 2,
		plane = new THREE.PlaneBufferGeometry(
			width,
			depth,
			divisions * 2,
			divisions
		),
		gridPlane = new THREE.Mesh(plane);
	gridPlane.rotation.x = -Math.PI / 2;
	gridPlane.position.z -= depth / 2 - 200;
	gridPlane.position.y -= 100;

	function finish() {
		const gridMat = new THREE.ShaderMaterial({
			uniforms: {
				gridDepth: { value: depth },
				gridSquare: { value: depth / divisions },
				color: { value: color },
				lineColor: { value: lineColor },
				lightColor: { value: lightColor },
				seed: { value: seed },
				time: { value: 0 }
			},
			extensions: { derivatives: true },
			vertexShader: vertShader,
			fragmentShader: fragShader,
			transparent: true
		});

		gridPlane.material = gridMat;
		if (onComplete) onComplete();
	}

	return gridPlane;
}
function OutrunTriangle(sideLength, radius, resolution, color) {
	const offset = (sideLength * Math.sqrt(3)) / 6;
	sideLength /= 2;
	const triangleGeometry = new THREE.TubeBufferGeometry(
			new StraightCurve(
				[
					new THREE.Vector3(-sideLength, 0, 0),
					new THREE.Vector3(sideLength, 0, 0),
					new THREE.Vector3(0, sideLength * Math.sqrt(3), 0)
				],
				true
			),
			resolution,
			radius,
			4,
			true
		),
		triangleMaterial = new THREE.MeshBasicMaterial({ color: color });

	triangleGeometry.translate(0, -offset, 0);
	const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);

	return triangle;
}
function damp(a, b, lambda, delta) {
	a.x = THREE.MathUtils.damp(a.x, b.x, lambda, delta);
	a.y = THREE.MathUtils.damp(a.y, b.y, lambda, delta);
	a.z = THREE.MathUtils.damp(a.z, b.z, lambda, delta);
}

window.Background = {
	initialSymbol: 3,
	resize() {
		this.camera.aspect = viewport.ratio;
		this.camera.updateProjectionMatrix();

		this.lowResPass.uniforms['resolution'].value
			.set(viewport.size.w, viewport.size.h)
			.multiplyScalar(window.devicePixelRatio);

		this.renderer.setSize(viewport.size.w, viewport.size.h, false);
		this.composer.setSize(viewport.size.w, viewport.size.h);
	},
	render() {
		this.clock = new THREE.Clock();

		const renderLoop = (() => {
			const deltaTime = this.clock.getDelta(),
				time = this.clock.elapsedTime;

			//Animate camera
			if (!DEBUG) {
				//Calculate target cam pos
				this.camOffset.set(this.mousePos.x * 200, this.mousePos.y * 60, 0);
				this.camTarget.copy(this.camBasePos).add(this.camOffset);

				//Calculate cam shake
				this.rawShake.set(
					this.camNoise.noise(time, 0, seed),
					this.camNoise.noise(0, time, seed),
					this.camNoise.noise(0, seed, time)
				);
				damp(this.camShake, this.rawShake.multiplyScalar(25), 3, deltaTime);

				//Calculate mouse movement
				this.mouseDelta.subVectors(this.mousePos, this.mouseLastPos);
				this.mouseLastPos.copy(this.mousePos);

				//Calculate cam rot with movement
				this.rawCamRot
					.set(
						THREE.MathUtils.clamp(this.mouseDelta.y, -0.02, 0.02) * 2,
						0,
						THREE.MathUtils.clamp(this.mouseDelta.x, -0.02, 0.02) * 5
					)
					.add(this.camBaseRot);
				damp(this.camRot, this.rawCamRot, 3, deltaTime);
				damp(this.camera.rotation, this.camRot, 5, deltaTime);

				//Combine all cam positioning
				damp(this.camHolder.position, this.camTarget, 2.5, deltaTime);
				this.camera.position.copy(this.camShake);

				//Look at symbols
				if (this.symbolsPos) this.camHolder.lookAt(this.symbolsPos);
			}

			//Animate shaders
			const timeMats = [this.sky.material, this.gridPlane.material];
			timeMats.forEach(mat => {
				if (mat.uniforms) mat.uniforms.time.value = time;
			});

			//Render
			this.composer.render(this.scene, this.camera);
			requestAnimationFrame(renderLoop);
		}).bind(this);

		renderLoop();
	},
	init() {
		this.backgroundLoadEvent = new LoadEvent({ itemsToLoad: 3 });

		//Setup scene
		this.scene = new THREE.Scene();

		//Setup cam
		// remember these initial values
		this.camera = new THREE.PerspectiveCamera(75, viewport.ratio, 0.1, 2000);
		this.camBasePos = new THREE.Vector3(0, 75, 250);
		this.camera.rotation.y = Math.PI;
		this.camBaseRot = new THREE.Vector3().copy(this.camera.rotation);

		this.camHolder = new THREE.Object3D();
		this.camHolder.add(this.camera);
		this.scene.add(this.camHolder);

		//Camera look around
		if (!DEBUG) {
			this.camOffset = new THREE.Vector3();
			this.camTarget = new THREE.Vector3();

			this.camShake = new THREE.Vector3();
			this.rawShake = new THREE.Vector3();
			this.camNoise = new ImprovedNoise();

			this.rawCamRot = new THREE.Vector3();
			this.camRot = new THREE.Vector3().copy(this.camBaseRot);

			//pos in -1 to 1 range
			this.mousePos = new THREE.Vector2();
			this.mouseLastPos = new THREE.Vector2();
			this.mouseDelta = new THREE.Vector2();
			document.addEventListener(
				'pointermove',
				(e =>
					this.mousePos.set(
						(e.clientX / viewport.size.w) * 2 - 1,
						(e.clientY / viewport.size.h) * -2 + 1
					)).bind(this),
				false
			);
		}

		//Setup renderer
		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('background')
		});
		this.renderer.setSize(viewport.size.w, viewport.size.h, false);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		//TODO: extra improvements to rendering in my newer projects like rgb encoding and filtering
		viewport.target.addEventListener('update', this.resize.bind(this));

		//Debug Stuff
		if (DEBUG) new OrbitControls(this.camera, this.renderer.domElement);

		//Lights - used only by the symbols
		this.mainLight = new THREE.DirectionalLight(0xffffff, 4);
		this.mainLight.position.set(0, 50, 50);
		this.scene.add(this.mainLight);

		this.leftLight = new THREE.DirectionalLight(
			new THREE.Color(colors.pinkAccent),
			3
		);
		this.leftLight.position.set(-50, 0, -25);
		this.scene.add(this.leftLight);

		this.rightLight = new THREE.DirectionalLight(
			new THREE.Color(colors.blueAccent),
			10
		);
		this.rightLight.position.set(50, 0, -25);
		this.scene.add(this.rightLight);

		//Add window symbols
		this.symbolsPos = new THREE.Vector3(0, 110, -200);
		gltfLoader.load(
			`${staticPath}/3D/symbols.glb`,
			(data => {
				this.symbols = data.scene.children;
				this.symbols.forEach(symbol => {
					symbol.visible = false;
					symbol.material.transparent = true;
					symbol.material.flatShading = true;
					symbol.material.side = THREE.FrontSide;
					symbol.material.format = THREE.RGBAFormat;
				});
				this.activeSymbol = this.symbols[this.initialSymbol];
				this.activeSymbol.visible = true;
				data.scene.position.copy(this.symbolsPos);
				this.scene.add(data.scene);

				this.backgroundLoadEvent.complete();
			}).bind(this)
		);

		//Sky
		this.sky = new OutrunSky(
			this.camera,
			Math.PI / 2 - 0.25,
			Math.PI,
			new THREE.Color(colors.pinkAccent),
			new THREE.Color(colors.yellowAccent),
			new THREE.Color(colors.blueAccent),
			new THREE.Color(colors.blueAccent),
			new THREE.Color(colors.blackPrimary),
			this.backgroundLoadEvent.complete(this.backgroundLoadEvent)
		);
		this.scene.add(this.sky);

		//Grid
		this.gridPlane = new OutrunGrid(
			this.camera,
			25,
			new THREE.Color(colors.blackPrimary),
			new THREE.Color(colors.blueAccent).lerp(
				new THREE.Color(colors.whitePrimary),
				0.5
			),
			new THREE.Color(colors.pinkAccent).lerp(
				new THREE.Color(colors.whitePrimary),
				0.5
			),
			this.backgroundLoadEvent.complete.bind(this.backgroundLoadEvent)
		);
		this.scene.add(this.gridPlane);

		//Item Showcase
		const triangleColor = new THREE.Color(colors.blueAccent).lerp(
			new THREE.Color(colors.whitePrimary),
			0.5
		);
		this.triangles = [];
		for (let i = 0; i < 4; i++) {
			this.triangles[i] = new OutrunTriangle(
				600 - 150 * i,
				7.5,
				100,
				triangleColor
			);
			this.triangles[i].position.set(
				0,
				80 - 20 * i,
				this.symbolsPos.z - 300 * i
			);
			this.scene.add(this.triangles[i]);
		}

		//Setup post processing
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.composer.addPass(
			new UnrealBloomPass(
				new THREE.Vector2(viewport.size.w, viewport.size.h),
				0.75,
				0.4,
				0.25
			)
		); //res strength rad thresh
		this.lowResPass = new ShaderPass(LowResShader);
		this.lowResPass.uniforms.resolution.value = new THREE.Vector2(
			viewport.size.w,
			viewport.size.h
		).multiplyScalar(window.devicePixelRatio);
		this.composer.addPass(this.lowResPass);

		//Start render loop
		this.render();
	},
	setSymbol(index = 3) {
		if (!this.symbols) return (this.initialSymbol = index);

		if (this.nextActiveSymbol)
			return (this.nextActiveSymbol = this.symbols[index]);
		this.nextActiveSymbol = this.symbols[index];
		gsap
			.timeline({
				defaults: { duration: 0.5, ease: 'power2.out', overwrite: true }
			})
			.fromTo(this.activeSymbol.position, { x: this.symbolsPos.x }, { x: -500 })
			.fromTo(this.activeSymbol.material, { opacity: 1 }, { opacity: 0 }, '<')
			.call(
				() => {
					if (this.activeSymbol != this.nextActiveSymbol) {
						this.nextActiveSymbol.visible = true;
						this.activeSymbol.visible = false;
						this.activeSymbol = this.nextActiveSymbol;
					}
					this.nextActiveSymbol = null;

					gsap
						.timeline({
							defaults: { duration: 0.5, ease: 'power2.out', overwrite: true }
						})
						.fromTo(
							this.activeSymbol.position,
							{ x: 500 },
							{ x: this.symbolsPos.x }
						)
						.fromTo(
							this.activeSymbol.material,
							{ opacity: 0 },
							{ opacity: 1 },
							'<'
						);
				},
				null,
				'>.1'
			);
	}
};

Background.init();

const LowResShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"resolution": { value: null }
	},
	vertexShader: `
		varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
    `,
	fragmentShader: `
        #define PIXEL_SIZE 4.0
		
		uniform vec2 resolution;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;
		
		void main() {
			vec2 dxy = PIXEL_SIZE / resolution;
			vec2 coord = dxy * floor(vUv / dxy);

            gl_FragColor = texture2D(tDiffuse, coord);
        }
    `
};

export { LowResShader };
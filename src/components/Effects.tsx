import React from 'react';
import {
	Bloom,
	ChromaticAberration,
	EffectComposer,
} from '@react-three/postprocessing';

const Effects: React.FC = () => {
	return (
		<EffectComposer multisampling={0}>
			<Bloom
				intensity={0.2}
				luminanceThreshold={0.2}
				width={512}
				height={512}
			/>
			<ChromaticAberration
				radialModulation={false}
				modulationOffset={0}
			/>
		</EffectComposer>
	);
};

export default Effects;

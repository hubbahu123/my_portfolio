import React from 'react';
import { map } from '../utils';

interface SliderProps {
	state: number;
	setter:
		| React.Dispatch<React.SetStateAction<number>>
		| ((value: number) => void);
	children: React.ReactNode;
}

const Slider: React.FC<SliderProps> = ({ state, setter, children }) => {
	return (
		<div className="flex h-6 my-4">
			{children}
			<input
				type="range"
				value={state}
				onChange={e => setter(e.target.valueAsNumber)}
				className="slider"
				style={{
					backgroundPositionX: `${map(state, 100, 0, 3, 97)}%`,
				}}
			/>
		</div>
	);
};

export default Slider;

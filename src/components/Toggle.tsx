import { motion } from 'framer-motion';
import React, { memo } from 'react';

interface ToggleProps {
	state: boolean;
	setter:
		| React.Dispatch<React.SetStateAction<boolean>>
		| ((value: boolean) => void);
	children: string;
}

const Toggle: React.FC<ToggleProps> = memo(
	({ state, setter, children }) => {
		return (
			<button
				type="button"
				onClick={() => setter(!state)}
				className="flex items-center justify-between my-2 cursor-pointer whitespace-nowrap w-full"
			>
				{children}
				<div
					className={`w-14 h-6 p-1 ml-4 outline outline-2 outline-white-primary transition-colors ease-steps2 ${
						state &&
						'bg-gradient-to-r from-pink-accent to-blue-accent'
					}`}
				>
					<motion.div
						className="w-1/2 h-full bg-white-primary shadow-[-2px_-2px_inset] shadow-light-primary"
						animate={{
							x: state ? '100%' : 0,
						}}
						transition={{
							type: 'spring',
							stiffness: 800,
							damping: 30,
						}}
					/>
				</div>
			</button>
		);
	},
	({ state, children }, newProps) => {
		return state === newProps.state && newProps.children === children;
	}
);

export default Toggle;

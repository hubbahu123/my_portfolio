import { MotionStyle, Variants, motion } from 'framer-motion';
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

interface DropdownProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	children: React.ReactElement;
	dContent: React.ReactElement;
	forcedAlignment?: Alignment;
}

const dropdownVariants: Variants = {
	open: {
		opacity: 1,
		y: 0,
	},
	closed: {
		opacity: 0,
		y: '-100%',
	},
};

type Alignment = 'left' | 'center' | 'right';

const Dropdown: React.FC<DropdownProps> = props => {
	const { children, dContent, forcedAlignment, ...rest } = props;

	const [open, setOpen] = useState(false);
	const button = useRef<HTMLButtonElement>(null);
	const dropdown = useRef<HTMLDivElement>(null);
	const [align, setAlign] = useState<Alignment>(forcedAlignment ?? 'left');
	useEffect(() => {
		if (!button.current) return;

		if (forcedAlignment) {
			setAlign(forcedAlignment);
		} else {
			const buttonRect = button.current.getBoundingClientRect();
			const centerX = buttonRect.left + buttonRect.width / 2;
			const windowThird = window.innerWidth / 3;
			// Sets the alignment of a dropdown based on if it falls in the 1st, 2nd, or 3rd area of the screen
			setAlign(
				centerX < windowThird
					? 'left'
					: centerX < windowThird * 2
					? 'center'
					: 'right'
			);
		}

		const clickOut = (e: PointerEvent) => {
			if (
				!dropdown.current ||
				!e.target ||
				!(e.target instanceof Element) ||
				dropdown.current.contains(e.target)
			)
				return;
			e.preventDefault();
			setOpen(false);
		};

		document.addEventListener('pointerdown', clickOut);
		return () => document.removeEventListener('pointerdown', clickOut);
	}, [forcedAlignment]);

	const alignmentStyle: React.CSSProperties = { top: '100%' };
	if (align === 'left') alignmentStyle.left = '0';
	else if (align === 'right') alignmentStyle.right = '0';
	else {
		alignmentStyle.left = '50%';
		alignmentStyle.transform = 'translateX(-50%)';
	}

	return (
		<div className='relative' ref={dropdown}>
			<button
				{...rest}
				ref={button}
				type='button'
				onClick={e => {
					e.preventDefault();
					setOpen(open => !open);
				}}
			>
				{children}
			</button>
			<div className='absolute overflow-hidden pb-96' style={alignmentStyle}>
				<motion.div
					className='m-0.5 p-2 outline outline-2 outline-white-primary backdrop-blur bg-gradient-to-r from-black-primary/75 to-dark-primary/75 from-25% to-70%'
					animate={open ? 'open' : 'closed'}
					variants={dropdownVariants}
				>
					{dContent}
				</motion.div>
			</div>
		</div>
	);
};

export default Dropdown;
